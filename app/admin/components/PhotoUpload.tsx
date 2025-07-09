'use client'

import React, { useState, useCallback, useRef } from 'react'
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  XMarkIcon,
  DocumentIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { 
  compressImageByType, 
  isValidImageFile, 
  isValidFileSize, 
  createImagePreview, 
  revokeImagePreview, 
  getFileInfo 
} from '@/lib/image-utils'

export type PhotoType = 'avatar' | 'album' | 'pedigree' | 'health_check'

interface FileWithPreview extends File {
  preview?: string
  compressed?: File
}

interface PhotoUploadProps {
  /** 照片類型 */
  photoType: PhotoType
  /** 是否允許多檔案上傳（avatar只能單檔，其他可多檔） */
  multiple?: boolean
  /** 已存在的照片URL陣列（用於顯示現有照片） */
  existingPhotos?: string[]
  /** 檔案選擇完成的回調 */
  onFilesSelected?: (files: File[], photoType: PhotoType) => void
  /** 檔案壓縮完成的回調 */
  onFilesCompressed?: (files: File[], photoType: PhotoType) => void
  /** 刪除現有照片的回調 */
  onDeleteExisting?: (photoUrl: string, photoType: PhotoType) => void
  /** 自定義CSS類名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
}

const PHOTO_TYPE_LABELS: Record<PhotoType, string> = {
  avatar: '頭像照片',
  album: '相簿照片',
  pedigree: '血統證書',
  health_check: '健康檢查'
}

const PHOTO_TYPE_DESCRIPTIONS: Record<PhotoType, string> = {
  avatar: '單張正方形頭像照片，建議尺寸 800x800px',
  album: '多張生活照片，展示狗狗的日常',
  pedigree: '血統證書文件照片，需要清晰可讀',
  health_check: '健康檢查報告照片或文件'
}

export default function PhotoUpload({
  photoType,
  multiple = photoType !== 'avatar',
  existingPhotos = [],
  onFilesSelected,
  onFilesCompressed,
  onDeleteExisting,
  className = '',
  disabled = false
}: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 處理檔案選擇
  const handleFiles = useCallback(async (files: FileList) => {
    if (disabled) return

    const fileArray = Array.from(files)
    const validFiles: FileWithPreview[] = []

    // 驗證檔案
    for (const file of fileArray) {
      if (!isValidImageFile(file)) {
        alert(`檔案 "${file.name}" 不是有效的圖片格式`)
        continue
      }

      if (!isValidFileSize(file, 10)) {
        alert(`檔案 "${file.name}" 過大（最大 10MB）`)
        continue
      }

      // 為檔案創建預覽
      const fileWithPreview = file as FileWithPreview
      fileWithPreview.preview = createImagePreview(file)
      validFiles.push(fileWithPreview)
    }

    if (validFiles.length === 0) return

    // 如果是avatar類型，只允許一個檔案
    const filesToProcess = photoType === 'avatar' ? [validFiles[0]] : validFiles

    setSelectedFiles(prev => {
      // 清理舊的預覽URL
      prev.forEach(file => {
        if (file.preview) {
          revokeImagePreview(file.preview)
        }
      })
      return filesToProcess
    })

    // 通知父組件
    if (onFilesSelected) {
      onFilesSelected(filesToProcess, photoType)
    }

    // 開始壓縮
    await compressFiles(filesToProcess)
  }, [photoType, disabled, onFilesSelected])

  // 壓縮檔案
  const compressFiles = useCallback(async (files: FileWithPreview[]) => {
    setCompressing(true)
    setCompressionProgress(0)

    try {
      const compressedFiles: File[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setCompressionProgress(((i + 0.5) / files.length) * 100)

        try {
          const compressed = await compressImageByType(file, photoType)
          
          // 確保壓縮後的檔案保持正確的檔案名稱和擴展名
          const originalExtension = file.name.split('.').pop() || 'jpg'
          const preservedName = file.name.replace(/\.[^/.]+$/, '') + '.' + originalExtension
          
          // 創建一個新的 File 物件，保持原始檔案名稱
          const preservedFile = new File([compressed], preservedName, {
            type: compressed.type || file.type,
            lastModified: Date.now()
          })
          
          compressedFiles.push(preservedFile)
          
          // 將壓縮後的檔案儲存到原檔案物件中
          file.compressed = preservedFile
        } catch (error) {
          console.error(`壓縮檔案 ${file.name} 失敗:`, error)
          compressedFiles.push(file) // 使用原檔案
        }

        setCompressionProgress(((i + 1) / files.length) * 100)
      }

      // 通知父組件壓縮完成
      if (onFilesCompressed) {
        onFilesCompressed(compressedFiles, photoType)
      }

    } catch (error) {
      console.error('壓縮檔案時發生錯誤:', error)
      alert('壓縮檔案時發生錯誤')
    } finally {
      setCompressing(false)
      setCompressionProgress(0)
    }
  }, [photoType, onFilesCompressed])

  // 拖放事件處理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles, disabled])

  // 檔案輸入變更處理
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  // 開啟檔案選擇器
  const openFileSelector = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  // 移除選中的檔案
  const removeSelectedFile = useCallback((index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev]
      const removedFile = newFiles[index]
      
      // 清理預覽URL
      if (removedFile.preview) {
        revokeImagePreview(removedFile.preview)
      }
      
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  // 刪除現有照片
  const handleDeleteExisting = useCallback((photoUrl: string) => {
    if (onDeleteExisting) {
      onDeleteExisting(photoUrl, photoType)
    }
  }, [onDeleteExisting, photoType])

  // 清理組件卸載時的預覽URL
  React.useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.preview) {
          revokeImagePreview(file.preview)
        }
      })
    }
  }, [selectedFiles])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 標題和說明 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {PHOTO_TYPE_LABELS[photoType]}
        </h3>
        <p className="text-sm text-gray-600">
          {PHOTO_TYPE_DESCRIPTIONS[photoType]}
        </p>
      </div>

      {/* 現有照片預覽 */}
      {existingPhotos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">現有照片</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingPhotos.map((photoUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={photoUrl}
                  alt={`${PHOTO_TYPE_LABELS[photoType]} ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => window.open(photoUrl, '_blank')}
                      className="p-1 bg-white rounded-full text-gray-600 hover:text-gray-900"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExisting(photoUrl)}
                      className="p-1 bg-white rounded-full text-red-600 hover:text-red-900"
                      disabled={disabled}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 拖放上傳區域 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              拖放檔案到這裡，或點擊選擇檔案
            </p>
            <p className="text-sm text-gray-600 mt-1">
              支援 JPG、PNG、WebP、GIF 格式，最大 10MB
            </p>
            {multiple && (
              <p className="text-xs text-gray-500 mt-1">
                可選擇多個檔案
              </p>
            )}
          </div>
        </div>

        {/* 壓縮進度條 */}
        {compressing && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-sm text-gray-600">
                壓縮中... {Math.round(compressionProgress)}%
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${compressionProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 選中檔案預覽 */}
      {selectedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            已選擇的檔案 ({selectedFiles.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="relative">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* 移除按鈕 */}
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    disabled={disabled || compressing}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>

                  {/* 檔案資訊 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="truncate">{file.name}</p>
                    <p>{getFileInfo(file).sizeInMB} MB</p>
                    {file.compressed && (
                      <p className="text-green-300">
                        已壓縮: {getFileInfo(file.compressed).sizeInMB} MB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 