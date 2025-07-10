'use client'

import React, { useState, useCallback } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import PuppyPhotoUpload from './PuppyPhotoUpload'
import { 
  uploadPuppyPhoto, 
  deletePuppyPhoto, 
  uploadMultiplePuppyPhotos,
  PuppyPhotoType 
} from '@/lib/api/puppyPhotos'
import { getAccessToken } from '@/lib/api/photos'
import { Puppy } from '@/lib/types/puppy'

interface PuppyPhotoManagerProps {
  /** 幼犬資料 */
  puppy: Puppy
  /** 幼犬資料更新後的回調 */
  onPuppyUpdated?: (updatedPuppy: Puppy) => void
  /** 自定義CSS類名 */
  className?: string
}

export default function PuppyPhotoManager({
  puppy,
  onPuppyUpdated,
  className = ''
}: PuppyPhotoManagerProps) {
  const { user, loading: authLoading } = useAuth()
  const [uploading, setUploading] = useState<Record<PuppyPhotoType, boolean>>({
    cover: false,
    album: false,
    pedigree: false,
    health_check: false
  })
  const [uploadProgress, setUploadProgress] = useState<Record<PuppyPhotoType, number>>({
    cover: 0,
    album: 0,
    pedigree: 0,
    health_check: 0
  })

  // 處理檔案壓縮完成後的上傳
  const handleFilesCompressed = useCallback(async (files: File[], photoType: PuppyPhotoType) => {
    if (!user || !puppy.id) {
      alert('請先登入')
      return
    }

    setUploading(prev => ({ ...prev, [photoType]: true }))
    setUploadProgress(prev => ({ ...prev, [photoType]: 0 }))

    try {
      const accessToken = await getAccessToken()
      
      if (files.length === 1) {
        // 單檔上傳 (適用於 cover)
        const result = await uploadPuppyPhoto(puppy.id, files[0], photoType, accessToken || undefined)
        
        if (result.success && result.data) {
          // 更新本地幼犬資料
          const updatedPuppy = result.data.puppy
          if (onPuppyUpdated) {
            onPuppyUpdated(updatedPuppy)
          }
          
          alert('照片上傳成功！')
        } else {
          alert(`上傳失敗: ${result.error}`)
        }
      } else {
        // 多檔上傳 (適用於 album, pedigree, health_check)
        const results = await uploadMultiplePuppyPhotos(
          puppy.id,
          files,
          photoType,
          accessToken || undefined,
          (current, total, fileName) => {
            setUploadProgress(prev => ({ 
              ...prev, 
              [photoType]: (current / total) * 100 
            }))
          }
        )

        const successCount = results.filter(r => r.success).length
        const failCount = results.length - successCount

        if (failCount === 0) {
          alert(`所有 ${files.length} 張照片上傳成功！`)
        } else {
          alert(`${successCount} 張照片上傳成功，${failCount} 張失敗`)
        }

        // 取最後一個成功的結果來更新幼犬資料
        const lastSuccess = results.reverse().find(r => r.success)
        if (lastSuccess && lastSuccess.data && onPuppyUpdated) {
          onPuppyUpdated(lastSuccess.data.puppy)
        }
      }

    } catch (error) {
      console.error('Upload error:', error)
      alert('上傳過程中發生錯誤')
    } finally {
      setUploading(prev => ({ ...prev, [photoType]: false }))
      setUploadProgress(prev => ({ ...prev, [photoType]: 0 }))
    }
  }, [user, puppy.id, onPuppyUpdated])

  // 處理刪除現有照片
  const handleDeleteExisting = useCallback(async (photoUrl: string, photoType: PuppyPhotoType) => {
    if (!user || !puppy.id) {
      alert('請先登入')
      return
    }

    if (!confirm('確定要刪除這張照片嗎？')) {
      return
    }

    try {
      const accessToken = await getAccessToken()
      const result = await deletePuppyPhoto(puppy.id, photoUrl, photoType, accessToken || undefined)
      
      if (result.success && result.data) {
        // 更新本地幼犬資料
        const updatedPuppy = result.data.puppy
        if (onPuppyUpdated) {
          onPuppyUpdated(updatedPuppy)
        }
        
        alert('照片刪除成功！')
      } else {
        alert(`刪除失敗: ${result.error}`)
      }

    } catch (error) {
      console.error('Delete error:', error)
      alert('刪除過程中發生錯誤')
    }
  }, [user, puppy.id, onPuppyUpdated])

  // 如果用戶未登入，顯示登入提示
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-gray-600">檢查登入狀態...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">請先登入才能管理照片</p>
      </div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          照片管理 - {puppy.name}
        </h2>

        {/* 主要照片 */}
        <div className="mb-8">
          <PuppyPhotoUpload
            photoType="cover"
            existingPhotos={puppy.cover_image ? [puppy.cover_image] : []}
            onFilesCompressed={handleFilesCompressed}
            onDeleteExisting={handleDeleteExisting}
            disabled={uploading.cover}
          />
          {uploading.cover && (
            <div className="mt-2">
              <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                上傳中... {Math.round(uploadProgress.cover)}%
              </div>
            </div>
          )}
        </div>

        {/* 相簿照片 */}
        <div className="mb-8">
          <PuppyPhotoUpload
            photoType="album"
            existingPhotos={puppy.images || []}
            onFilesCompressed={handleFilesCompressed}
            onDeleteExisting={handleDeleteExisting}
            disabled={uploading.album}
          />
          {uploading.album && (
            <div className="mt-2">
              <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                上傳中... {Math.round(uploadProgress.album)}%
              </div>
            </div>
          )}
        </div>

        {/* 血統證書 */}
        <div className="mb-8">
          <PuppyPhotoUpload
            photoType="pedigree"
            existingPhotos={puppy.pedigree_documents || []}
            onFilesCompressed={handleFilesCompressed}
            onDeleteExisting={handleDeleteExisting}
            disabled={uploading.pedigree}
          />
          {uploading.pedigree && (
            <div className="mt-2">
              <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                上傳中... {Math.round(uploadProgress.pedigree)}%
              </div>
            </div>
          )}
        </div>

        {/* 健康證明 */}
        <div className="mb-8">
          <PuppyPhotoUpload
            photoType="health_check"
            existingPhotos={puppy.health_certificates || []}
            onFilesCompressed={handleFilesCompressed}
            onDeleteExisting={handleDeleteExisting}
            disabled={uploading.health_check}
          />
          {uploading.health_check && (
            <div className="mt-2">
              <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                上傳中... {Math.round(uploadProgress.health_check)}%
              </div>
            </div>
          )}
        </div>

        {/* 使用說明 */}
        <div className="bg-gray-50 rounded-lg p-4 mt-8">
          <h4 className="text-sm font-medium text-gray-900 mb-2">使用說明</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 照片會自動壓縮以節省儲存空間和提高載入速度</li>
            <li>• 主要照片建議使用清晰的幼犬正面照片，解析度 800x600px</li>
            <li>• 血統證書和健康證明文件請確保文字清晰可讀</li>
            <li>• 支援 JPG、PNG、WebP、GIF 格式，最大檔案大小 5MB</li>
            <li>• 相簿照片可上傳多張，展示幼犬的日常活動和成長過程</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 