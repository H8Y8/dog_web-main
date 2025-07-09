'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import PhotoUpload, { PhotoType } from './PhotoUpload'
import { 
  uploadMemberPhoto, 
  deleteMemberPhoto, 
  uploadMultiplePhotos,
  getAccessToken 
} from '@/lib/api/photos'
import { Member } from '@/lib/types'

interface MemberPhotoManagerProps {
  /** 成員資料 */
  member: Member
  /** 成員資料更新後的回調 */
  onMemberUpdated?: (updatedMember: Member) => void
  /** 自定義CSS類名 */
  className?: string
}

export default function MemberPhotoManager({
  member,
  onMemberUpdated,
  className = ''
}: MemberPhotoManagerProps) {
  const { user, loading: authLoading } = useAuth()
  const [uploading, setUploading] = useState<Record<PhotoType, boolean>>({
    avatar: false,
    album: false,
    pedigree: false,
    health_check: false
  })
  const [uploadProgress, setUploadProgress] = useState<Record<PhotoType, number>>({
    avatar: 0,
    album: 0,
    pedigree: 0,
    health_check: 0
  })

  // 處理檔案壓縮完成後的上傳
  const handleFilesCompressed = useCallback(async (files: File[], photoType: PhotoType) => {
    if (!user || !member.id) {
      alert('請先登入')
      return
    }

    setUploading(prev => ({ ...prev, [photoType]: true }))
    setUploadProgress(prev => ({ ...prev, [photoType]: 0 }))

    try {
      const accessToken = await getAccessToken()
      
      if (files.length === 1) {
        // 單檔上傳 (適用於 avatar)
        const result = await uploadMemberPhoto(member.id, files[0], photoType, accessToken || undefined)
        
        if (result.success && result.data) {
          // 更新本地成員資料
          const updatedMember = result.data.member
          if (onMemberUpdated) {
            onMemberUpdated(updatedMember)
          }
          
          alert('照片上傳成功！')
        } else {
          alert(`上傳失敗: ${result.error}`)
        }
      } else {
        // 多檔上傳 (適用於 album, pedigree, health_check)
        const results = await uploadMultiplePhotos(
          member.id,
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

        // 取最後一個成功的結果來更新成員資料
        const lastSuccess = results.reverse().find(r => r.success)
        if (lastSuccess && lastSuccess.data && onMemberUpdated) {
          onMemberUpdated(lastSuccess.data.member)
        }
      }

    } catch (error) {
      console.error('Upload error:', error)
      alert('上傳過程中發生錯誤')
    } finally {
      setUploading(prev => ({ ...prev, [photoType]: false }))
      setUploadProgress(prev => ({ ...prev, [photoType]: 0 }))
    }
  }, [user, member.id, onMemberUpdated])

  // 處理刪除現有照片
  const handleDeleteExisting = useCallback(async (photoUrl: string, photoType: PhotoType) => {
    if (!user || !member.id) {
      alert('請先登入')
      return
    }

    if (!confirm('確定要刪除這張照片嗎？')) {
      return
    }

    try {
      const accessToken = await getAccessToken()
      const result = await deleteMemberPhoto(member.id, photoUrl, photoType, accessToken || undefined)
      
      if (result.success && result.data) {
        // 更新本地成員資料
        const updatedMember = result.data.member
        if (onMemberUpdated) {
          onMemberUpdated(updatedMember)
        }
        
        alert('照片刪除成功！')
      } else {
        alert(`刪除失敗: ${result.error}`)
      }

    } catch (error) {
      console.error('Delete error:', error)
      alert('刪除過程中發生錯誤')
    }
  }, [user, member.id, onMemberUpdated])

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
          照片管理 - {member.name}
        </h2>

        {/* 頭像照片 */}
        <div className="mb-8">
          <PhotoUpload
            photoType="avatar"
            existingPhotos={member.avatar_url ? [member.avatar_url] : []}
            onFilesCompressed={handleFilesCompressed}
            onDeleteExisting={handleDeleteExisting}
            disabled={uploading.avatar}
          />
          {uploading.avatar && (
            <div className="mt-2">
              <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                上傳中... {Math.round(uploadProgress.avatar)}%
              </div>
            </div>
          )}
        </div>

        {/* 相簿照片 */}
        <div className="mb-8">
          <PhotoUpload
            photoType="album"
            existingPhotos={member.album_urls || []}
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
          <PhotoUpload
            photoType="pedigree"
            existingPhotos={member.pedigree_urls || []}
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

        {/* 健康檢查 */}
        <div className="mb-8">
          <PhotoUpload
            photoType="health_check"
            existingPhotos={member.health_check_urls || []}
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
            <li>• 頭像照片建議使用正方形圖片，解析度 800x800px</li>
            <li>• 血統證書和健康檢查文件請確保文字清晰可讀</li>
            <li>• 支援 JPG、PNG、WebP、GIF 格式，最大檔案大小 10MB</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 