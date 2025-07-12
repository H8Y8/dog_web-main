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
  onToggleAvailable,
  onManagePhotos
}: {
  puppies: Puppy[]
  loading: boolean
  error: Error | null
  onViewDetail: (puppy: Puppy) => void
  onEdit: (puppy: Puppy) => void
  onDelete: (puppy: Puppy) => void
  onToggleAvailable: (puppy: Puppy) => void
  onManagePhotos: (puppy: Puppy) => void
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {puppies.map((puppy) => (
              <div key={puppy.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                {/* 幼犬照片 */}
                <div className="mb-3 md:mb-4">
                  {puppy.cover_image ? (
                    <img
                      src={puppy.cover_image}
                      alt={puppy.name}
                      className="w-full h-40 md:h-48 object-cover rounded-lg"
                    />
                  ) : puppy.images && puppy.images.length > 0 ? (
                    <img
                      src={puppy.images[0]}
                      alt={puppy.name}
                      className="w-full h-40 md:h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-40 md:h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 基本資訊 */}
                <div className="space-y-2 mb-3 md:mb-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate flex-1">{puppy.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
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
                  <p className="text-sm text-gray-600 truncate">{puppy.breed}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{puppy.gender === 'male' ? '公' : '母'}</span>
                    <span className="truncate ml-2">{puppy.color}</span>
                  </div>
                  {puppy.price && (
                    <p className="text-base md:text-lg font-semibold text-blue-600">
                      {puppy.currency} ${puppy.price.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* 操作按鈕 */}
                <div className="space-y-2">
                  <div className="flex gap-1 md:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetail(puppy)}
                      className="flex-1 text-xs md:text-sm"
                    >
                      查看
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(puppy)}
                      className="flex-1 text-xs md:text-sm"
                    >
                      編輯
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onManagePhotos(puppy)}
                      className="flex-1 text-xs md:text-sm"
                    >
                      照片
                    </Button>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <Button
                      size="sm"
                      variant={puppy.status === PuppyStatus.AVAILABLE ? "outline" : undefined}
                      onClick={() => onToggleAvailable(puppy)}
                      className={`flex-1 text-xs md:text-sm ${
                        puppy.status === PuppyStatus.AVAILABLE
                          ? 'border-orange-300 text-orange-700 hover:bg-orange-50' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {puppy.status === PuppyStatus.AVAILABLE ? '設為已預約' : '設為可預約'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(puppy)}
                      className="text-xs md:text-sm px-2 md:px-3"
                    >
                      刪除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface PuppiesManagerProps {
  initialView?: View
  selectedId?: string
}

export default function PuppiesManager({ initialView = 'list', selectedId }: PuppiesManagerProps) {
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
  
  const [currentView, setCurrentView] = useState<View>(initialView)
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 當有 selectedId 時，尋找對應的幼犬並顯示詳細頁面
  React.useEffect(() => {
    if (selectedId && puppies.length > 0 && !loading) {
      // 提取真實的 ID（移除可能的前綴）
      const actualId = selectedId.replace(/^(puppy-|puppies-)/, '')
      const puppy = puppies.find(p => p.id === actualId)
      if (puppy) {
        setSelectedPuppy(puppy)
        setCurrentView('detail')
      } else {
        console.warn('Puppy not found with ID:', actualId)
      }
    }
  }, [selectedId, puppies, loading])

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

  // 處理狀態切換
  const handleToggleAvailable = async (puppy: Puppy) => {
    const newStatus = puppy.status === PuppyStatus.AVAILABLE ? PuppyStatus.RESERVED : PuppyStatus.AVAILABLE
    
    try {
      const result = await updatePuppy(puppy.id, { status: newStatus }, session?.access_token)
      if (result.success) {
        refresh()
      } else {
        alert(`狀態更新失敗：${result.error?.message || '未知錯誤'}`)
      }
    } catch (error) {
      alert('狀態更新失敗：網路錯誤')
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
    // 重新整理列表
    refresh()
  }

  // 處理幼犬更新（例如照片上傳）
  const handlePuppyUpdated = () => {
    // 重新載入列表資料以顯示最新的資料
    refresh()
  }

  // 返回列表
  const handleBack = () => {
    setCurrentView('list')
    setSelectedPuppy(null)
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和操作 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
            {currentView === 'list' && '幼犬管理'}
            {currentView === 'detail' && `${selectedPuppy?.name} - 詳細資料`}
            {currentView === 'create' && '新增幼犬'}
            {currentView === 'edit' && `編輯 ${selectedPuppy?.name}`}
            {currentView === 'photos' && `${selectedPuppy?.name} - 照片管理`}
          </h1>
        </div>
        
        <div className="flex space-x-2 sm:space-x-3 flex-shrink-0">
          {currentView !== 'list' && (
            <Button variant="outline" onClick={handleBack} size="sm" className="sm:size-default">
              返回列表
            </Button>
          )}
          
          {currentView === 'list' && (
            <Button onClick={() => setCurrentView('create')} size="sm" className="sm:size-default">
              新增幼犬
            </Button>
          )}
        </div>
      </div>

      {/* 主要內容區域 */}
      {currentView === 'list' && (
        <PuppiesListWithActions
          puppies={puppies}
          loading={loading}
          error={error}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleAvailable={handleToggleAvailable}
          onManagePhotos={handleManagePhotos}
        />
      )}

      {currentView === 'detail' && selectedPuppy && (
        <PuppyDetail
          puppy={selectedPuppy}
          onEdit={() => setCurrentView('edit')}
          onDelete={() => handleDelete(selectedPuppy)}
          onBack={handleBack}
          onPuppyUpdated={handlePuppyUpdated}
        />
      )}

      {currentView === 'create' && (
        <PuppyCreateForm
          onSuccess={handleSuccess}
          onCancel={handleBack}
        />
      )}

      {currentView === 'edit' && selectedPuppy && (
        <PuppyEditForm
          puppy={selectedPuppy}
          onSuccess={handleSuccess}
          onCancel={handleBack}
        />
      )}

      {currentView === 'photos' && selectedPuppy && (
        <PuppyPhotoManager
          puppy={selectedPuppy}
          onPuppyUpdated={(updatedPuppy) => {
            // 更新幼犬資料並保持在照片管理頁面
            setSelectedPuppy(updatedPuppy)
            refresh()
          }}
        />
      )}

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && selectedPuppy && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-7-11l7 7 7-7h0l-7 7h0l-7-7z"/>
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">確認刪除</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  您確定要刪除幼犬「{selectedPuppy.name}」嗎？此操作無法復原。
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={cancelDelete}
                    disabled={deleteLoading}
                  >
                    取消
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? '刪除中...' : '確認刪除'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 