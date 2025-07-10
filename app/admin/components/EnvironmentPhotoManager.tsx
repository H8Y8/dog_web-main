'use client'

import React, { useState } from 'react'
import { 
  Environment,
  EnvironmentPhotoType,
  ENVIRONMENT_PHOTO_TYPE_LABELS
} from '../../../lib/types/environment'
import { deleteEnvironmentPhoto } from '../../../lib/api/environmentPhotos'
import EnvironmentPhotoUpload from './EnvironmentPhotoUpload'

interface EnvironmentPhotoManagerProps {
  environment: Environment
  onUpdate?: (updatedEnvironment: Environment) => void
  onError?: (error: string) => void
}

export default function EnvironmentPhotoManager({
  environment,
  onUpdate,
  onError
}: EnvironmentPhotoManagerProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  // 獲取指定類型的照片URL
  const getPhotosForType = (type: EnvironmentPhotoType): string[] => {
    switch (type) {
      case 'cover':
        return environment.cover_image ? [environment.cover_image] : []
      case 'album':
        return environment.images || []
      case 'equipment':
        return environment.equipment_images || []
      case 'details':
        return environment.detail_images || []
      default:
        return []
    }
  }

  // 刪除照片
  const handleDeletePhoto = async (photoUrl: string, type: EnvironmentPhotoType) => {
    const confirmDelete = window.confirm(`確定要刪除這張${ENVIRONMENT_PHOTO_TYPE_LABELS[type]}嗎？`)
    if (!confirmDelete) return

    setDeleting(photoUrl)

    try {
      const updatedEnvironment = await deleteEnvironmentPhoto(environment.id, photoUrl, type)
      onUpdate?.(updatedEnvironment)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '刪除照片失敗'
      onError?.(errorMessage)
    } finally {
      setDeleting(null)
    }
  }

  // 渲染照片網格
  const renderPhotoGrid = (type: EnvironmentPhotoType) => {
    const photos = getPhotosForType(type)
    const isDeleting = (url: string) => deleting === url

    return (
      <div className="space-y-3">
        {/* 上傳組件 */}
        <EnvironmentPhotoUpload
          environment={environment}
          photoType={type}
          onSuccess={onUpdate}
          onError={onError}
        />

        {/* 現有照片 */}
        {photos.length > 0 && (
          <div className={`
            grid gap-3
            ${type === 'cover' ? 'grid-cols-1 max-w-md' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}
          `}>
            {photos.map((photoUrl, index) => (
              <div
                key={`${type}-${index}`}
                className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={photoUrl}
                  alt={`${ENVIRONMENT_PHOTO_TYPE_LABELS[type]} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder.jpg'
                  }}
                />
                
                {/* 刪除按鈕 */}
                <button
                  onClick={() => handleDeletePhoto(photoUrl, type)}
                  disabled={isDeleting(photoUrl)}
                  className="
                    absolute top-2 right-2 
                    bg-red-500 hover:bg-red-600 text-white 
                    rounded-full w-6 h-6 flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  title="刪除照片"
                >
                  {isDeleting(photoUrl) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>

                {/* 主要照片標籤 */}
                {type === 'cover' && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    主要照片
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 空狀態 */}
        {photos.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            尚未上傳{ENVIRONMENT_PHOTO_TYPE_LABELS[type]}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">環境照片管理</h3>
          <p className="text-sm text-gray-600 mt-1">
            管理 {environment.name} 的各類型照片
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* 照片尺寸建議說明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  照片尺寸建議
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>封面照片：</strong>建議 1920×1080 像素 (16:9比例)，完美適配前台輪播顯示</li>
                    <li><strong>環境照片：</strong>建議 1920×1080 像素 (16:9比例)，展示整體環境空間和氛圍</li>
                    <li><strong>設備照片：</strong>建議 1920×1080 像素 (16:9比例)，展示專業設備和器材</li>
                    <li><strong>細節照片：</strong>建議 1920×1080 像素 (16:9比例)，展示特色細節和重點</li>
                  </ul>
                  <p className="mt-2 text-xs">
                    <strong>說明：</strong>前台輪播使用16:9比例顯示，是最常見的照片比例，避免裁切並提供最佳視覺效果<br/>
                    <strong>提示：</strong>檔案大小建議小於 5MB，支援 JPEG、PNG、WebP、GIF 格式
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 封面照片 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                封面照片
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                建議：1920×1080px (16:9)
              </span>
            </div>
            {renderPhotoGrid('cover')}
          </div>

          {/* 環境照片 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                環境照片
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                建議：1920×1080px (16:9)
              </span>
            </div>
            {renderPhotoGrid('album')}
          </div>

          {/* 設備照片 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                設備照片
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                建議：1920×1080px (16:9)
              </span>
            </div>
            {renderPhotoGrid('equipment')}
          </div>

          {/* 細節照片 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                細節照片
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                建議：1920×1080px (16:9)
              </span>
            </div>
            {renderPhotoGrid('details')}
          </div>
        </div>
      </div>
    </div>
  )
} 