'use client'

import React, { useState } from 'react'
import { usePuppies } from '../../../lib/hooks/usePuppies'
import { useAuth } from '../../../lib/hooks/useAuth'
import { Puppy, PuppyStatus } from '../../../lib/types/puppy'
import { Button } from '../../../lib/ui/Button'
import PuppyDetail from './PuppyDetail'
import PuppyCreateForm from './PuppyCreateForm'
import PuppyEditForm from './PuppyEditForm'
import PuppyPhotoManager from './PuppyPhotoManager'

type View = 'list' | 'detail' | 'create' | 'edit' | 'photos'

// 帶操作的幼犬列表包裝組件
function PuppiesListWithActions({ 
  puppies,
  loading,
  error,
  onViewDetail, 
  onEdit, 
  onDelete,
  onToggleAvailable 
}: {
  puppies: Puppy[]
  loading: boolean
  error: Error | null
  onViewDetail: (puppy: Puppy) => void
  onEdit: (puppy: Puppy) => void
  onDelete: (puppy: Puppy) => void
  onToggleAvailable: (puppy: Puppy) => void
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">載入幼犬資料中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">載入失敗</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>
            重新載入
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {puppies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暫無幼犬資料</h3>
            <p className="text-gray-600">還沒有新增任何幼犬資料</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {puppies.map((puppy) => (
              <div key={puppy.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* 幼犬照片 */}
                <div className="mb-4">
                  {puppy.cover_image ? (
                    <img
                      src={puppy.cover_image}
                      alt={puppy.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : puppy.images && puppy.images.length > 0 ? (
                    <img
                      src={puppy.images[0]}
                      alt={puppy.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 基本資訊 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{puppy.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      puppy.status === PuppyStatus.AVAILABLE
                        ? 'bg-green-100 text-green-800' 
                        : puppy.status === PuppyStatus.RESERVED
                        ? 'bg-yellow-100 text-yellow-800'
                        : puppy.status === PuppyStatus.SOLD
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {puppy.status === PuppyStatus.AVAILABLE && '可預約'}
                      {puppy.status === PuppyStatus.RESERVED && '已預約'}
                      {puppy.status === PuppyStatus.SOLD && '已售出'}
                      {puppy.status === PuppyStatus.NOT_FOR_SALE && '非售品'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{puppy.breed}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{puppy.gender === 'male' ? '公' : '母'}</span>
                    <span>{puppy.color}</span>
                  </div>
                  {puppy.price && (
                    <p className="text-lg font-semibold text-blue-600">
                      NT$ {puppy.price.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* 操作按鈕 */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetail(puppy)}
                    >
                      查看
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(puppy)}
                    >
                      編輯
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(puppy)}
                    >
                      刪除
                    </Button>
                  </div>
                  
                  {/* 狀態切換 */}
                                      <Button
                      size="sm"
                      variant={puppy.status === PuppyStatus.AVAILABLE ? "outline" : undefined}
                      onClick={() => onToggleAvailable(puppy)}
                      className={`w-full ${
                        puppy.status === PuppyStatus.AVAILABLE
                          ? 'border-orange-300 text-orange-700 hover:bg-orange-50' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {puppy.status === PuppyStatus.AVAILABLE ? '設為已預約' : '設為可預約'}
                    </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PuppiesManager() {
  // 統一使用一個 usePuppies hook 實例
  const { 
    puppies, 
    loading, 
    error, 
    addPuppy,
    updatePuppy,
    removePuppy,
    refresh
  } = usePuppies()
  
  const { session } = useAuth()
  
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 處理查看詳情
  const handleViewDetail = (puppy: Puppy) => {
    setSelectedPuppy(puppy)
    setCurrentView('detail')
  }

  // 處理編輯
  const handleEdit = (puppy: Puppy) => {
    setSelectedPuppy(puppy)
    setCurrentView('edit')
  }

  // 處理照片管理
  const handleManagePhotos = (puppy: Puppy) => {
    setSelectedPuppy(puppy)
    setCurrentView('photos')
  }

  // 處理刪除
  const handleDelete = (puppy: Puppy) => {
    setSelectedPuppy(puppy)
    setShowDeleteConfirm(true)
  }

  // 處理狀態切換（可預約 ↔ 已預約）
  const handleToggleAvailable = async (puppy: Puppy) => {
    try {
      const newStatus = puppy.status === PuppyStatus.AVAILABLE ? PuppyStatus.RESERVED : PuppyStatus.AVAILABLE
      const result = await updatePuppy(puppy.id, { status: newStatus }, session?.access_token)
      if (result.success) {
        refresh()
      } else {
        alert(`切換失敗：${result.error?.message || '未知錯誤'}`)
      }
    } catch (error) {
      alert('切換失敗：網路錯誤')
    }
  }

  // 確認刪除
  const confirmDelete = async () => {
    if (!selectedPuppy) return
    
    setDeleteLoading(true)
    try {
      const result = await removePuppy(selectedPuppy.id, session?.access_token)
      if (result.success) {
        setCurrentView('list')
        setSelectedPuppy(null)
        setShowDeleteConfirm(false)
      } else {
        alert(`刪除失敗：${result.error?.message || '未知錯誤'}`)
      }
    } catch (error) {
      alert('刪除失敗：網路錯誤')
    } finally {
      setDeleteLoading(false)
    }
  }

  // 取消刪除
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setSelectedPuppy(null)
  }

  // 處理成功操作後的回調
  const handleSuccess = () => {
    setCurrentView('list')
    setSelectedPuppy(null)
    refresh()
  }

  // 處理幼犬更新後的回調
  const handlePuppyUpdated = () => {
    setCurrentView('list')
    setSelectedPuppy(null)
    refresh()
  }

  // 處理返回列表
  const handleBack = () => {
    setCurrentView('list')
    setSelectedPuppy(null)
  }

  // 根據當前視圖渲染不同內容
  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <div className="space-y-6">
            {/* 頁面標題和操作 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">幼犬管理</h2>
                <p className="text-gray-600">管理犬舍的幼犬資訊</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={refresh}
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新整理
                </Button>
                <Button
                  onClick={() => setCurrentView('create')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  新增幼犬
                </Button>
              </div>
            </div>

            {/* 幼犬列表 */}
            <PuppiesListWithActions
              puppies={puppies}
              loading={loading}
              error={error}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleAvailable={handleToggleAvailable}
            />
          </div>
        )

      case 'detail':
        return selectedPuppy && (
          <PuppyDetail
            puppy={selectedPuppy}
            onBack={handleBack}
            onEdit={() => setCurrentView('edit')}
            onManagePhotos={() => handleManagePhotos(selectedPuppy)}
          />
        )

      case 'create':
        return (
          <PuppyCreateForm
            onSuccess={handleSuccess}
            onCancel={handleBack}
          />
        )

      case 'edit':
        return selectedPuppy && (
          <PuppyEditForm
            puppy={selectedPuppy}
            onSuccess={handlePuppyUpdated}
            onCancel={handleBack}
          />
        )

      case 'photos':
        return selectedPuppy && (
          <div className="space-y-6">
            {/* 頁面標題和返回按鈕 */}
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={handleBack}
                className="mr-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回詳情
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">照片管理</h2>
                <p className="text-gray-600">{selectedPuppy.name} 的照片管理</p>
              </div>
            </div>
            
            {/* 照片管理組件 */}
            <PuppyPhotoManager
              puppy={selectedPuppy}
              onPuppyUpdated={(updatedPuppy) => {
                // 更新幼犬資料並保持在照片管理頁面
                setSelectedPuppy(updatedPuppy)
                refresh()
              }}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {renderContent()}

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && selectedPuppy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">確認刪除</h3>
                <p className="text-sm text-gray-500">此操作無法復原</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              確定要刪除幼犬「{selectedPuppy.name}」嗎？刪除後將無法復原。
            </p>
            
            <div className="flex space-x-3 justify-end">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={deleteLoading}
              >
                取消
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? '刪除中...' : '確認刪除'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 