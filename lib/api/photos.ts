import { supabase } from '@/lib/supabase'

export type PhotoType = 'avatar' | 'album' | 'pedigree' | 'health_check'

// API 回應類型
export interface PhotoUploadResponse {
  success: boolean
  data?: {
    url: string
    type: PhotoType
    member: any
  }
  error?: string
}

export interface PhotoDeleteResponse {
  success: boolean
  data?: {
    deletedUrl: string
    type: PhotoType
    member: any
  }
  error?: string
}

/**
 * 上傳成員照片
 * @param memberId 成員ID
 * @param file 檔案
 * @param photoType 照片類型
 * @param accessToken 訪問令牌
 * @returns 上傳結果
 */
export async function uploadMemberPhoto(
  memberId: string,
  file: File,
  photoType: PhotoType,
  accessToken?: string
): Promise<PhotoUploadResponse> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', photoType)

    const headers: HeadersInit = {}

    // 如果有訪問令牌，添加到 headers
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    
    // 注意：不要手動設置Content-Type，讓瀏覽器自動設置multipart/form-data的boundary

    const response = await fetch(`/api/members/${memberId}/photos`, {
      method: 'POST',
      headers,
      body: formData
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || '上傳失敗'
      }
    }

    return {
      success: true,
      data: result.data
    }

  } catch (error) {
    console.error('Upload photo error:', error)
    return {
      success: false,
      error: '網路錯誤，請稍後重試'
    }
  }
}

/**
 * 刪除成員照片
 * @param memberId 成員ID
 * @param photoUrl 照片URL
 * @param photoType 照片類型
 * @param accessToken 訪問令牌
 * @returns 刪除結果
 */
export async function deleteMemberPhoto(
  memberId: string,
  photoUrl: string,
  photoType: PhotoType,
  accessToken?: string
): Promise<PhotoDeleteResponse> {
  try {
    const params = new URLSearchParams({
      url: photoUrl,
      type: photoType
    })

    const headers: HeadersInit = {}

    // 如果有訪問令牌，添加到 headers
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(`/api/members/${memberId}/photos?${params}`, {
      method: 'DELETE',
      headers
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || '刪除失敗'
      }
    }

    return {
      success: true,
      data: result.data
    }

  } catch (error) {
    console.error('Delete photo error:', error)
    return {
      success: false,
      error: '網路錯誤，請稍後重試'
    }
  }
}

/**
 * 批量上傳照片
 * @param memberId 成員ID
 * @param files 檔案陣列
 * @param photoType 照片類型
 * @param accessToken 訪問令牌
 * @param onProgress 進度回調
 * @returns 上傳結果陣列
 */
export async function uploadMultiplePhotos(
  memberId: string,
  files: File[],
  photoType: PhotoType,
  accessToken?: string,
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<PhotoUploadResponse[]> {
  const results: PhotoUploadResponse[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    if (onProgress) {
      onProgress(i + 1, files.length, file.name)
    }

    try {
      const result = await uploadMemberPhoto(memberId, file, photoType, accessToken)
      results.push(result)
    } catch (error) {
      results.push({
        success: false,
        error: `上傳 ${file.name} 失敗: ${error}`
      })
    }
  }

  return results
}

/**
 * 獲取當前用戶的訪問令牌
 * @returns 訪問令牌
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    console.error('Get access token error:', error)
    return null
  }
} 