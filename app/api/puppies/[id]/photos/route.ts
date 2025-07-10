import { NextRequest } from 'next/server'
import { createAuthenticatedSupabaseClient } from '@/lib/supabase'
import { 
  apiSuccess, 
  apiError, 
  validateAuth, 
  handleSupabaseError
} from '@/lib/api-utils'

// 支援的幼犬照片類型
type PuppyPhotoType = 'cover' | 'album' | 'pedigree' | 'health_check'

// POST /api/puppies/[id]/photos - 上傳照片
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: puppyId } = params

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建已認證的 Supabase 客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 檢查幼犬是否存在（使用已認證的客戶端）
    const { data: existingPuppy, error: fetchError } = await authenticatedSupabase
      .from('puppies')
      .select('id, name')
      .eq('id', puppyId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return apiError('幼犬不存在', 'PUPPY_NOT_FOUND', 404)
      }
      return handleSupabaseError(fetchError)
    }

    // 解析 FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const photoType = formData.get('type') as PuppyPhotoType

    if (!file) {
      return apiError('沒有提供檔案', 'FILE_REQUIRED', 400)
    }

    if (!photoType || !['cover', 'album', 'pedigree', 'health_check'].includes(photoType)) {
      return apiError('無效的照片類型', 'INVALID_PHOTO_TYPE', 400)
    }

    // 檢查檔案類型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return apiError('不支援的檔案格式', 'INVALID_FILE_TYPE', 400)
    }

    // 檢查檔案大小 (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return apiError('檔案過大 (最大 5MB)', 'FILE_TOO_LARGE', 400)
    }

    // 生成檔案路徑 - 根據 MIME 類型確定正確的副檔名
    let fileExtension = file.name.split('.').pop() || 'jpg'
    
    // 如果檔案名稱沒有有效的副檔名，根據 MIME 類型決定
    if (!fileExtension || fileExtension === 'blob' || fileExtension.length > 4) {
      switch (file.type) {
        case 'image/jpeg':
          fileExtension = 'jpg'
          break
        case 'image/png':
          fileExtension = 'png'
          break
        case 'image/webp':
          fileExtension = 'webp'
          break
        case 'image/gif':
          fileExtension = 'gif'
          break
        default:
          fileExtension = 'jpg' // 預設為 jpg
      }
    }
    
    const fileName = `${crypto.randomUUID()}.${fileExtension}`
    const filePath = `${puppyId}/${photoType}/${fileName}`
    
    console.log('Puppy photo upload processing:', {
      originalName: file.name,
      fileType: file.type,
      extractedExtension: file.name.split('.').pop(),
      correctedExtension: fileExtension,
      finalFileName: fileName,
      finalPath: filePath,
      photoType
    })

    // 上傳檔案到 Supabase Storage（使用已認證的客戶端）
    const { data: uploadData, error: uploadError } = await authenticatedSupabase.storage
      .from('puppy-photos')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Puppy photo upload error details:', {
        error: uploadError,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        bucketName: 'puppy-photos'
      })
      
      // 檢查是否是 bucket 不存在的錯誤
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('bucket does not exist')) {
        return apiError('Storage bucket 未配置，請聯繫管理員', 'BUCKET_NOT_FOUND', 500)
      }
      
      return apiError(`檔案上傳失敗: ${uploadError.message}`, 'UPLOAD_ERROR', 500)
    }

    // 獲取公開 URL
    const { data: { publicUrl } } = authenticatedSupabase.storage
      .from('puppy-photos')
      .getPublicUrl(filePath)

    // 更新資料庫中的照片 URL
    let updateData: any = {}
    
    if (photoType === 'cover') {
      // 主要照片 - 單個URL
      updateData.cover_image = publicUrl
    } else {
      // 對於陣列類型的欄位，需要先獲取現有資料
      const { data: currentPuppy, error: getCurrentError } = await authenticatedSupabase
        .from('puppies')
        .select('images, pedigree_documents, health_certificates')
        .eq('id', puppyId)
        .single()

      if (getCurrentError) {
        return handleSupabaseError(getCurrentError)
      }

      // 根據照片類型更新對應的陣列欄位
      let urlField: keyof typeof currentPuppy
      switch (photoType) {
        case 'album':
          urlField = 'images'
          break
        case 'pedigree':
          urlField = 'pedigree_documents'
          break
        case 'health_check':
          urlField = 'health_certificates'
          break
        default:
          throw new Error('無效的照片類型')
      }

      const currentUrls = (currentPuppy[urlField] as string[]) || []
      updateData[urlField] = [...currentUrls, publicUrl]
    }

    // 更新幼犬記錄（使用已認證的客戶端）
    const { data: updatedPuppy, error: updateError } = await authenticatedSupabase
      .from('puppies')
      .update(updateData)
      .eq('id', puppyId)
      .select()
      .single()

    if (updateError) {
      // 如果資料庫更新失敗，嘗試刪除已上傳的檔案
      await authenticatedSupabase.storage
        .from('puppy-photos')
        .remove([filePath])
      
      return handleSupabaseError(updateError)
    }

    return apiSuccess({
      url: publicUrl,
      type: photoType,
      puppy: updatedPuppy
    }, '照片上傳成功')

  } catch (error) {
    console.error('POST /api/puppies/[id]/photos error:', error)
    return apiError('上傳照片失敗', 'UPLOAD_PHOTO_ERROR', 500)
  }
}

// DELETE /api/puppies/[id]/photos - 刪除照片
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: puppyId } = params
    const { searchParams } = new URL(request.url)
    const photoUrl = searchParams.get('url')
    const photoType = searchParams.get('type') as PuppyPhotoType

    if (!photoUrl) {
      return apiError('沒有提供照片URL', 'URL_REQUIRED', 400)
    }

    if (!photoType || !['cover', 'album', 'pedigree', 'health_check'].includes(photoType)) {
      return apiError('無效的照片類型', 'INVALID_PHOTO_TYPE', 400)
    }

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建已認證的 Supabase 客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 檢查幼犬是否存在
    const { data: existingPuppy, error: fetchError } = await authenticatedSupabase
      .from('puppies')
      .select('id, name, cover_image, images, pedigree_documents, health_certificates')
      .eq('id', puppyId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return apiError('幼犬不存在', 'PUPPY_NOT_FOUND', 404)
      }
      return handleSupabaseError(fetchError)
    }

    // 從 URL 中提取檔案路徑
    const urlParts = photoUrl.split('/')
    const bucketIndex = urlParts.indexOf('puppy-photos')
    if (bucketIndex === -1) {
      return apiError('無效的照片URL', 'INVALID_URL', 400)
    }
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/')

    // 從 storage 中刪除檔案
    const { error: deleteError } = await authenticatedSupabase.storage
      .from('puppy-photos')
      .remove([filePath])

    if (deleteError) {
      console.error('Delete file error:', deleteError)
      // 繼續執行，即使檔案刪除失敗也要更新資料庫
    }

    // 更新資料庫記錄
    let updateData: any = {}
    
    if (photoType === 'cover') {
      // 主要照片 - 清空
      updateData.cover_image = null
    } else {
      // 陣列類型 - 移除指定URL
      let urlField: keyof typeof existingPuppy
      switch (photoType) {
        case 'album':
          urlField = 'images'
          break
        case 'pedigree':
          urlField = 'pedigree_documents'
          break
        case 'health_check':
          urlField = 'health_certificates'
          break
        default:
          throw new Error('無效的照片類型')
      }

      const currentUrls = (existingPuppy[urlField] as string[]) || []
      updateData[urlField] = currentUrls.filter(url => url !== photoUrl)
    }

    // 更新幼犬記錄
    const { data: updatedPuppy, error: updateError } = await authenticatedSupabase
      .from('puppies')
      .update(updateData)
      .eq('id', puppyId)
      .select()
      .single()

    if (updateError) {
      return handleSupabaseError(updateError)
    }

    return apiSuccess({
      deletedUrl: photoUrl,
      type: photoType,
      puppy: updatedPuppy
    }, '照片刪除成功')

  } catch (error) {
    console.error('DELETE /api/puppies/[id]/photos error:', error)
    return apiError('刪除照片失敗', 'DELETE_PHOTO_ERROR', 500)
  }
} 