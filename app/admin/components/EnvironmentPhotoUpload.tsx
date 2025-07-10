'use client'

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { 
  Environment,
  EnvironmentPhotoType,
  ENVIRONMENT_PHOTO_TYPE_LABELS,
  ENVIRONMENT_PHOTO_TYPE_DESCRIPTIONS
} from '../../../lib/types/environment'
import { uploadEnvironmentPhoto } from '../../../lib/api/environmentPhotos'

interface EnvironmentPhotoUploadProps {
  environment: Environment
  photoType: EnvironmentPhotoType
  onSuccess?: (updatedEnvironment: Environment) => void
  onError?: (error: string) => void
  className?: string
}

export default function EnvironmentPhotoUpload({
  environment,
  photoType,
  onSuccess,
  onError,
  className = ''
}: EnvironmentPhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 檢查檔案類型和大小
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return '不支援的檔案格式，請選擇 JPEG、PNG、WebP 或 GIF 格式'
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return '檔案大小不能超過 5MB'
    }

    return null
  }

  // 處理檔案上傳
  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      onError?.(validationError)
      return
    }

    setUploading(true)

    try {
      const result = await uploadEnvironmentPhoto(environment.id, file, photoType)
      onSuccess?.(result.environment)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上傳照片失敗'
      onError?.(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  // 拖拽處理
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  // 檔案選擇處理
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 照片類型說明 */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{ENVIRONMENT_PHOTO_TYPE_LABELS[photoType]}</span>
        <p className="text-xs mt-1">{ENVIRONMENT_PHOTO_TYPE_DESCRIPTIONS[photoType]}</p>
      </div>

      {/* 上傳區域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={uploading ? undefined : openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">上傳中...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-8 h-8 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              {dragOver ? '放開檔案以上傳' : '點擊或拖拽檔案到此處'}
            </p>
            <p className="text-xs text-gray-500">
              支援 JPEG、PNG、WebP、GIF 格式，最大 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 