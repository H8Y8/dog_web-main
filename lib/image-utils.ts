import imageCompression from 'browser-image-compression'

// 圖片壓縮配置選項
export interface ImageCompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  quality?: number
  initialQuality?: number
}

// 預設壓縮配置
export const DEFAULT_COMPRESSION_OPTIONS: ImageCompressionOptions = {
  maxSizeMB: 2, // 最大檔案大小 2MB
  maxWidthOrHeight: 1920, // 最大寬度或高度
  useWebWorker: true, // 使用 Web Worker
  quality: 0.8, // 壓縮品質
  initialQuality: 0.8
}

// 不同照片類型的專用配置
export const PHOTO_TYPE_OPTIONS: Record<string, ImageCompressionOptions> = {
  avatar: {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    quality: 0.85,
    useWebWorker: true
  },
  album: {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    quality: 0.8,
    useWebWorker: true
  },
  pedigree: {
    maxSizeMB: 3,
    maxWidthOrHeight: 2048,
    quality: 0.9, // 文件類型需要更高品質
    useWebWorker: true
  },
  health_check: {
    maxSizeMB: 3,
    maxWidthOrHeight: 2048,
    quality: 0.9, // 健康檢查文件需要清晰度
    useWebWorker: true
  }
}

/**
 * 壓縮圖片檔案
 * @param file 要壓縮的檔案
 * @param options 壓縮選項
 * @returns 壓縮後的檔案
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = DEFAULT_COMPRESSION_OPTIONS
): Promise<File> {
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: options.maxSizeMB || 2,
      maxWidthOrHeight: options.maxWidthOrHeight || 1920,
      useWebWorker: options.useWebWorker !== false,
      initialQuality: options.quality || 0.8
    })

    return compressedFile
  } catch (error) {
    console.error('圖片壓縮失敗:', error)
    throw new Error('圖片壓縮失敗')
  }
}

/**
 * 根據照片類型壓縮圖片
 * @param file 要壓縮的檔案
 * @param photoType 照片類型
 * @returns 壓縮後的檔案
 */
export async function compressImageByType(
  file: File,
  photoType: keyof typeof PHOTO_TYPE_OPTIONS
): Promise<File> {
  const options = PHOTO_TYPE_OPTIONS[photoType] || DEFAULT_COMPRESSION_OPTIONS
  return compressImage(file, options)
}

/**
 * 驗證檔案類型是否為圖片
 * @param file 檔案
 * @returns 是否為有效的圖片檔案
 */
export function isValidImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  return allowedTypes.includes(file.type)
}

/**
 * 驗證檔案大小
 * @param file 檔案
 * @param maxSizeMB 最大檔案大小（MB）
 * @returns 檔案大小是否有效
 */
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * 獲取檔案資訊
 * @param file 檔案
 * @returns 檔案資訊
 */
export function getFileInfo(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
  }
}

/**
 * 創建圖片預覽 URL
 * @param file 檔案
 * @returns 預覽 URL
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * 清理預覽 URL
 * @param url 預覽 URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url)
}

/**
 * 批量壓縮圖片
 * @param files 檔案陣列
 * @param photoType 照片類型
 * @param onProgress 進度回調
 * @returns 壓縮後的檔案陣列
 */
export async function compressMultipleImages(
  files: File[],
  photoType: keyof typeof PHOTO_TYPE_OPTIONS,
  onProgress?: (progress: number, currentFile: string) => void
): Promise<File[]> {
  const compressedFiles: File[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    if (onProgress) {
      onProgress((i / files.length) * 100, file.name)
    }
    
    try {
      const compressedFile = await compressImageByType(file, photoType)
      compressedFiles.push(compressedFile)
    } catch (error) {
      console.error(`壓縮檔案 ${file.name} 失敗:`, error)
      // 如果壓縮失敗，使用原檔案
      compressedFiles.push(file)
    }
  }
  
  if (onProgress) {
    onProgress(100, '完成')
  }
  
  return compressedFiles
}

/**
 * 生成唯一檔案名稱
 * @param originalName 原始檔案名稱
 * @returns 新的檔案名稱
 */
export function generateUniqueFileName(originalName: string): string {
  const extension = originalName.split('.').pop()
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  return `${timestamp}_${randomString}.${extension}`
} 