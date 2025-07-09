import { NextRequest } from 'next/server'
import { supabase, createAuthenticatedSupabaseClient } from '@/lib/supabase'
import { 
  apiSuccess, 
  apiError, 
  validateAuth, 
  methodNotAllowed,
  handleSupabaseError
} from '@/lib/api-utils'

type PhotoType = 'avatar' | 'album' | 'pedigree' | 'health_check'

// POST /api/members/[id]/photos - 上傳照片
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: memberId } = params

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建已認證的 Supabase 客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 檢查成員是否存在（使用已認證的客戶端）
    const { data: existingMember, error: fetchError } = await authenticatedSupabase
      .from('members')
      .select('id, name')
      .eq('id', memberId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return apiError('成員不存在', 'MEMBER_NOT_FOUND', 404)
      }
      return handleSupabaseError(fetchError)
    }

    // 解析 FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const photoType = formData.get('type') as PhotoType

    if (!file) {
      return apiError('沒有提供檔案', 'FILE_REQUIRED', 400)
    }

    if (!photoType || !['avatar', 'album', 'pedigree', 'health_check'].includes(photoType)) {
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
    const filePath = `${memberId}/${photoType}/${fileName}`
    
    console.log('File processing:', {
      originalName: file.name,
      fileType: file.type,
      extractedExtension: file.name.split('.').pop(),
      correctedExtension: fileExtension,
      finalFileName: fileName,
      finalPath: filePath
    })

    // 上傳檔案到 Supabase Storage（使用已認證的客戶端）
    const { data: uploadData, error: uploadError } = await authenticatedSupabase.storage
      .from('member-avatars')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error details:', {
        error: uploadError,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        bucketName: 'member-avatars'
      })
      
      // 檢查是否是 bucket 不存在的錯誤
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('bucket does not exist')) {
        return apiError('Storage bucket 未配置，請聯繫管理員', 'BUCKET_NOT_FOUND', 500)
      }
      
      return apiError(`檔案上傳失敗: ${uploadError.message}`, 'UPLOAD_ERROR', 500)
    }

    // 獲取公開 URL
    const { data: { publicUrl } } = authenticatedSupabase.storage
      .from('member-avatars')
      .getPublicUrl(filePath)

    // 更新資料庫中的照片 URL
    let updateData: any = {}
    
    if (photoType === 'avatar') {
      updateData.avatar_url = publicUrl
    } else {
      // 對於陣列類型的欄位，需要先獲取現有資料
      const { data: currentMember, error: getCurrentError } = await authenticatedSupabase
        .from('members')
        .select('album_urls, pedigree_urls, health_check_urls')
        .eq('id', memberId)
        .single()

      if (getCurrentError) {
        return handleSupabaseError(getCurrentError)
      }

      const urlField = `${photoType}_urls` as keyof typeof currentMember
      const currentUrls = (currentMember[urlField] as string[]) || []
      updateData[urlField] = [...currentUrls, publicUrl]
    }

    // 更新成員記錄（使用已認證的客戶端）
    const { data: updatedMember, error: updateError } = await authenticatedSupabase
      .from('members')
      .update(updateData)
      .eq('id', memberId)
      .select()
      .single()

    if (updateError) {
      // 如果資料庫更新失敗，嘗試刪除已上傳的檔案
      await authenticatedSupabase.storage
        .from('member-avatars')
        .remove([filePath])
      
      return handleSupabaseError(updateError)
    }

    return apiSuccess({
      url: publicUrl,
      type: photoType,
      member: updatedMember
    }, '照片上傳成功')

  } catch (error) {
    console.error('POST /api/members/[id]/photos error:', error)
    return apiError('上傳照片失敗', 'UPLOAD_PHOTO_ERROR', 500)
  }
}

// DELETE /api/members/[id]/photos - 刪除照片
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: memberId } = params
    const { searchParams } = new URL(request.url)
    const photoUrl = searchParams.get('url')
    const photoType = searchParams.get('type') as PhotoType

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建已認證的 Supabase 客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    if (!photoUrl || !photoType) {
      return apiError('缺少必要參數', 'MISSING_PARAMETERS', 400)
    }

    // 檢查成員是否存在（使用已認證的客戶端）
    const { data: existingMember, error: fetchError } = await authenticatedSupabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return apiError('成員不存在', 'MEMBER_NOT_FOUND', 404)
      }
      return handleSupabaseError(fetchError)
    }

    // 從 URL 提取檔案路徑
    const urlParts = photoUrl.split('/')
    const bucketIndex = urlParts.findIndex(part => part === 'member-avatars')
    const filePath = urlParts.slice(bucketIndex + 1).join('/')

    // 從 Storage 刪除檔案（使用已認證的客戶端）
    const { error: deleteError } = await authenticatedSupabase.storage
      .from('member-avatars')
      .remove([filePath])

    if (deleteError) {
      console.error('Storage delete error:', deleteError)
    }

    // 更新資料庫
    let updateData: any = {}
    
    if (photoType === 'avatar') {
      updateData.avatar_url = null
    } else {
      const currentUrls = existingMember[`${photoType}_urls`] || []
      updateData[`${photoType}_urls`] = currentUrls.filter((url: string) => url !== photoUrl)
    }

    // 更新成員記錄（使用已認證的客戶端）
    const { data: updatedMember, error: updateError } = await authenticatedSupabase
      .from('members')
      .update(updateData)
      .eq('id', memberId)
      .select()
      .single()

    if (updateError) {
      return handleSupabaseError(updateError)
    }

    return apiSuccess({
      deletedUrl: photoUrl,
      type: photoType,
      member: updatedMember
    }, '照片刪除成功')

  } catch (error) {
    console.error('DELETE /api/members/[id]/photos error:', error)
    return apiError('刪除照片失敗', 'DELETE_PHOTO_ERROR', 500)
  }
}

// 處理不支援的 HTTP 方法
export async function GET() {
  return methodNotAllowed(['POST', 'DELETE'])
}

export async function PUT() {
  return methodNotAllowed(['POST', 'DELETE'])
}

export async function PATCH() {
  return methodNotAllowed(['POST', 'DELETE'])
} 