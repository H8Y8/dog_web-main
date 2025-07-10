// ===============================================
// 幼犬圖片上傳 API 客戶端
// ===============================================

// 支援的幼犬照片類型
export type PuppyPhotoType = 'cover' | 'album' | 'pedigree' | 'health_check'

// 照片類型的中文標籤
export const PUPPY_PHOTO_TYPE_LABELS: Record<PuppyPhotoType, string> = {
  cover: '主要照片',
  album: '相簿照片',
  pedigree: '血統證書',
  health_check: '健康證明'
}

// API 響應介面
export interface PuppyPhotoUploadResponse {
  success: boolean
  data?: {
    url: string
    type: PuppyPhotoType
    puppy: any // 更新後的幼犬資料
  }
  error?: string
}

/**
 * 上傳幼犬照片
 * @param puppyId 幼犬ID
 * @param file 檔案
 * @param photoType 照片類型
 * @param accessToken 訪問令牌
 * @returns 上傳結果
 */
export async function uploadPuppyPhoto(
  puppyId: string,
  file: File,
  photoType: PuppyPhotoType,
  accessToken?: string
): Promise<PuppyPhotoUploadResponse> {
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

    const response = await fetch(`/api/puppies/${puppyId}/photos`, {
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
    console.error('Upload puppy photo error:', error)
    return {
      success: false,
      error: '網路錯誤，請稍後重試'
    }
  }
}

/**
 * 刪除幼犬照片
 * @param puppyId 幼犬ID
 * @param photoUrl 照片URL
 * @param photoType 照片類型
 * @param accessToken 訪問令牌
 * @returns 刪除結果
 */
export async function deletePuppyPhoto(
  puppyId: string,
  photoUrl: string,
  photoType: PuppyPhotoType,
  accessToken?: string
): Promise<PuppyPhotoUploadResponse> {
  try {
    const headers: HeadersInit = {}

    // 如果有訪問令牌，添加到 headers
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const url = new URL(`/api/puppies/${puppyId}/photos`, window.location.origin)
    url.searchParams.set('url', photoUrl)
    url.searchParams.set('type', photoType)

    const response = await fetch(url.toString(), {
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
    console.error('Delete puppy photo error:', error)
    return {
      success: false,
      error: '網路錯誤，請稍後重試'
    }
  }
}

/**
 * 批量上傳幼犬照片
 * @param puppyId 幼犬ID
 * @param files 檔案陣列
 * @param photoType 照片類型
 * @param accessToken 訪問令牌
 * @param onProgress 進度回調
 * @returns 上傳結果陣列
 */
export async function uploadMultiplePuppyPhotos(
  puppyId: string,
  files: File[],
  photoType: PuppyPhotoType,
  accessToken?: string,
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<PuppyPhotoUploadResponse[]> {
  const results: PuppyPhotoUploadResponse[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    if (onProgress) {
      onProgress(i + 1, files.length, file.name)
    }

    try {
      const result = await uploadPuppyPhoto(puppyId, file, photoType, accessToken)
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
 * 獲取照片類型的中文名稱
 * @param photoType 照片類型
 * @returns 中文名稱
 */
export function getPuppyPhotoTypeLabel(photoType: PuppyPhotoType): string {
  return PUPPY_PHOTO_TYPE_LABELS[photoType] || photoType
}

/**
 * 驗證是否為有效的圖片檔案
 * @param file 檔案
 * @returns 是否有效
 */
export function isValidImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  return allowedTypes.includes(file.type)
}

/**
 * 驗證檔案大小
 * @param file 檔案
 * @param maxSizeMB 最大大小（MB）
 * @returns 是否在限制內
 */
export function isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSize = maxSizeMB * 1024 * 1024 // 轉換為 bytes
  return file.size <= maxSize
}

/**
 * 格式化檔案大小
 * @param bytes 檔案大小（bytes）
 * @returns 格式化的字串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 創建圖片預覽URL
 * @param file 檔案
 * @returns 預覽URL
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * 釋放圖片預覽URL
 * @param previewUrl 預覽URL
 */
export function revokeImagePreview(previewUrl: string): void {
  URL.revokeObjectURL(previewUrl)
} 