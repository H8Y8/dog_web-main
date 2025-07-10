import { NextRequest } from 'next/server'
import { createAuthenticatedSupabaseClient } from '../../../../../lib/supabase'
import { validateAuth } from '../../../../../lib/api-utils'
import { apiSuccess, apiError, handleSupabaseError } from '../../../../../lib/api-utils'

export type EnvironmentPhotoType = 'cover' | 'album' | 'equipment' | 'details'

// POST /api/environments/[id]/photos - 上傳照片
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: environmentId } = params

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建已認證的 Supabase 客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 檢查環境是否存在（使用已認證的客戶端）
    const { data: existingEnvironment, error: fetchError } = await authenticatedSupabase
      .from('environments')
      .select('id, name')
      .eq('id', environmentId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return apiError('環境不存在', 'ENVIRONMENT_NOT_FOUND', 404)
      }
      return handleSupabaseError(fetchError)
    }

    // 解析 FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const photoType = formData.get('type') as EnvironmentPhotoType

    if (!file) {
      return apiError('沒有提供檔案', 'FILE_REQUIRED', 400)
    }

    if (!photoType || !['cover', 'album', 'equipment', 'details'].includes(photoType)) {
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
    const filePath = `${environmentId}/${photoType}/${fileName}`
    
    console.log('Environment photo upload processing:', {
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
      .from('environment-photos')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Environment photo upload error details:', {
        error: uploadError,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        bucketName: 'environment-photos'
      })
      
      // 檢查是否是 bucket 不存在的錯誤
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('bucket does not exist')) {
        return apiError('Storage bucket 未配置，請聯繫管理員', 'BUCKET_NOT_FOUND', 500)
      }
      
      return apiError(`檔案上傳失敗: ${uploadError.message}`, 'UPLOAD_ERROR', 500)
    }

    // 獲取公開 URL
    const { data: { publicUrl } } = authenticatedSupabase.storage
      .from('environment-photos')
      .getPublicUrl(filePath)

    // 更新資料庫中的照片 URL
    let updateData: any = {}
    
    if (photoType === 'cover') {
      // 主要照片 - 單個URL
      updateData.cover_image = publicUrl
    } else {
      // 對於陣列類型的欄位，需要先獲取現有資料
      const { data: currentEnvironment, error: getCurrentError } = await authenticatedSupabase
        .from('environments')
        .select('images, equipment_images, detail_images')
        .eq('id', environmentId)
        .single()

      if (getCurrentError) {
        return handleSupabaseError(getCurrentError)
      }

      // 根據照片類型更新對應的陣列欄位
      let urlField: keyof typeof currentEnvironment
      switch (photoType) {
        case 'album':
          urlField = 'images'
          break
        case 'equipment':
          urlField = 'equipment_images'
          break
        case 'details':
          urlField = 'detail_images'
          break
        default:
          throw new Error('無效的照片類型')
      }

      const currentUrls = (currentEnvironment[urlField] as string[]) || []
      updateData[urlField] = [...currentUrls, publicUrl]
    }

    // 更新環境記錄（使用已認證的客戶端）
    const { data: updatedEnvironment, error: updateError } = await authenticatedSupabase
      .from('environments')
      .update(updateData)
      .eq('id', environmentId)
      .select()
      .single()

    if (updateError) {
      // 如果資料庫更新失敗，嘗試刪除已上傳的檔案
      await authenticatedSupabase.storage
        .from('environment-photos')
        .remove([filePath])
      
      return handleSupabaseError(updateError)
    }

    return apiSuccess({
      url: publicUrl,
      type: photoType,
      environment: updatedEnvironment
    }, '照片上傳成功')

  } catch (error) {
    console.error('POST /api/environments/[id]/photos error:', error)
    return apiError('上傳照片失敗', 'UPLOAD_PHOTO_ERROR', 500)
  }
}

// DELETE /api/environments/[id]/photos - 刪除照片
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: environmentId } = params
    const { searchParams } = new URL(request.url)
    const photoUrl = searchParams.get('url')
    const photoType = searchParams.get('type') as EnvironmentPhotoType

    if (!photoUrl) {
      return apiError('沒有提供照片URL', 'URL_REQUIRED', 400)
    }

    if (!photoType || !['cover', 'album', 'equipment', 'details'].includes(photoType)) {
      return apiError('無效的照片類型', 'INVALID_PHOTO_TYPE', 400)
    }

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建已認證的 Supabase 客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 檢查環境是否存在
    const { data: existingEnvironment, error: fetchError } = await authenticatedSupabase
      .from('environments')
      .select('id, name, cover_image, images, equipment_images, detail_images')
      .eq('id', environmentId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return apiError('環境不存在', 'ENVIRONMENT_NOT_FOUND', 404)
      }
      return handleSupabaseError(fetchError)
    }

    // 從URL中提取檔案路徑
    const url = new URL(photoUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.indexOf('environment-photos')
    if (bucketIndex === -1) {
      return apiError('無效的照片URL', 'INVALID_URL', 400)
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    // 從 Storage 刪除檔案
    const { error: deleteError } = await authenticatedSupabase.storage
      .from('environment-photos')
      .remove([filePath])

    if (deleteError) {
      console.error('Delete file error:', deleteError)
      return apiError(`刪除檔案失敗: ${deleteError.message}`, 'DELETE_FILE_ERROR', 500)
    }

    // 更新資料庫記錄
    let updateData: any = {}
    
    if (photoType === 'cover') {
      updateData.cover_image = null
    } else {
      const urlField = photoType === 'album' ? 'images' : 
                     photoType === 'equipment' ? 'equipment_images' : 'detail_images'
      
      const currentUrls = (existingEnvironment[urlField as keyof typeof existingEnvironment] as string[]) || []
      updateData[urlField] = currentUrls.filter(url => url !== photoUrl)
    }

    // 更新環境記錄
    const { data: updatedEnvironment, error: updateError } = await authenticatedSupabase
      .from('environments')
      .update(updateData)
      .eq('id', environmentId)
      .select()
      .single()

    if (updateError) {
      return handleSupabaseError(updateError)
    }

    return apiSuccess({
      environment: updatedEnvironment
    }, '照片刪除成功')

  } catch (error) {
    console.error('DELETE /api/environments/[id]/photos error:', error)
    return apiError('刪除照片失敗', 'DELETE_PHOTO_ERROR', 500)
  }
} 