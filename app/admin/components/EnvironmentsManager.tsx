'use client'

import React, { useState } from 'react'
import { useEnvironments } from '../../../lib/hooks/useEnvironments'
import { useAuth } from '../../../lib/hooks/useAuth'
import { Environment, EnvironmentType, ENVIRONMENT_TYPE_LABELS, ENVIRONMENT_TYPE_COLORS, ENVIRONMENT_TYPE_ICONS } from '../../../lib/types/environment'
import { Button } from '../../../lib/ui/Button'
import EnvironmentDetail from './EnvironmentDetail'
import EnvironmentCreateForm from './EnvironmentCreateForm'
import EnvironmentEditForm from './EnvironmentEditForm'

type View = 'list' | 'detail' | 'create' | 'edit'

// 帶操作的環境設施列表包裝組件
function EnvironmentsListWithActions({ 
  environments,
  loading,
  error,
  onViewDetail, 
  onEdit, 
  onDelete 
}: {
  environments: Environment[]
  loading: boolean
  error: Error | null
  onViewDetail: (environment: Environment) => void
  onEdit: (environment: Environment) => void
  onDelete: (environment: Environment) => void
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">載入環境設施中...</span>
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
        {environments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暫無環境設施</h3>
            <p className="text-gray-600">還沒有新增任何環境設施</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {environments.map((environment) => (
              <div key={environment.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                {/* 環境設施照片 */}
                <div className="mb-4">
                  {(() => {
                    // 優先顯示封面照片，如果沒有則顯示第一張環境照片
                    const displayImage = environment.cover_image || 
                                      (environment.images && environment.images.length > 0 ? environment.images[0] : null)
                    
                    return displayImage ? (
                      <img
                        src={displayImage}
                        alt={environment.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">
                            {ENVIRONMENT_TYPE_ICONS[environment.type] || '📍'}
                          </div>
                          <span className="text-gray-400 text-sm">暫無照片</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* 基本資訊 */}
                <div className="space-y-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{environment.name}</h3>
                  
                  {/* 環境類型標籤 */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{ENVIRONMENT_TYPE_ICONS[environment.type]}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ENVIRONMENT_TYPE_COLORS[environment.type]}`}>
                      {ENVIRONMENT_TYPE_LABELS[environment.type]}
                    </span>
                  </div>

                  {/* 描述 */}
                  {environment.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {environment.description}
                    </p>
                  )}

                  {/* 特色設施 */}
                  {environment.features && environment.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {environment.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {feature}
                        </span>
                      ))}
                      {environment.features.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                          +{environment.features.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 操作按鈕 */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetail(environment)}
                  >
                    查看
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(environment)}
                  >
                    編輯
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(environment)}
                  >
                    刪除
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

interface EnvironmentsManagerProps {
  initialView?: View
  selectedId?: string
}

export default function EnvironmentsManager({ initialView = 'list', selectedId }: EnvironmentsManagerProps) {
  // 統一使用一個 useEnvironments hook 實例
  const { 
    environments, 
    loading, 
    error, 
    addEnvironment,
    updateEnvironment,
    removeEnvironment,
    refresh
  } = useEnvironments()
  
  const { session } = useAuth()
  
  const [currentView, setCurrentView] = useState<View>(initialView)
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 當有 selectedId 時，尋找對應的環境設施並顯示詳細頁面
  React.useEffect(() => {
    if (selectedId && environments.length > 0 && !loading) {
      // 提取真實的 ID（移除可能的前綴）
      const actualId = selectedId.replace(/^(environment-|environments-)/, '')
      const environment = environments.find(e => e.id === actualId)
      if (environment) {
        setSelectedEnvironment(environment)
        setCurrentView('detail')
      } else {
        console.warn('Environment not found with ID:', actualId)
      }
    }
  }, [selectedId, environments, loading])

  // 處理查看詳情
  const handleViewDetail = (environment: Environment) => {
    setSelectedEnvironment(environment)
    setCurrentView('detail')
  }

  // 處理編輯
  const handleEdit = (environment: Environment) => {
    setSelectedEnvironment(environment)
    setCurrentView('edit')
  }

  // 處理刪除
  const handleDelete = (environment: Environment) => {
    setSelectedEnvironment(environment)
    setShowDeleteConfirm(true)
  }

  // 確認刪除
  const confirmDelete = async () => {
    if (!selectedEnvironment) return
    
    setDeleteLoading(true)
    try {
      const result = await removeEnvironment(selectedEnvironment.id, session?.access_token)
      if (result.success) {
        setCurrentView('list')
        setSelectedEnvironment(null)
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
    setSelectedEnvironment(null)
  }

  // 處理成功操作後的回調
  const handleSuccess = () => {
    setCurrentView('list')
    setSelectedEnvironment(null)
    refresh()
  }

  // 處理環境設施更新後的回調
  const handleEnvironmentUpdated = () => {
    setCurrentView('list')
    setSelectedEnvironment(null)
    refresh()
  }

  // 處理返回列表
  const handleBack = () => {
    setCurrentView('list')
    setSelectedEnvironment(null)
  }

  // 根據當前視圖渲染內容
  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">環境設施管理</h1>
              <Button onClick={() => setCurrentView('create')} size="sm" className="sm:size-default self-start sm:self-auto">
                新增環境設施
              </Button>
            </div>
            
            <EnvironmentsListWithActions
              environments={environments}
              loading={loading}
              error={error}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )

      case 'create':
        return (
          <EnvironmentCreateForm
            onSuccess={handleSuccess}
            onCancel={handleBack}
          />
        )

      case 'detail':
        return selectedEnvironment ? (
          <EnvironmentDetail
            environment={selectedEnvironment}
            onBack={handleBack}
            onEdit={() => handleEdit(selectedEnvironment)}
            onDelete={() => handleDelete(selectedEnvironment)}
            onUpdate={(updatedEnvironment: Environment) => {
              setSelectedEnvironment(updatedEnvironment)
              refresh()
            }}
            onError={(error: string) => {
              alert(`操作失敗：${error}`)
            }}
          />
        ) : null

      case 'edit':
        return selectedEnvironment ? (
          <EnvironmentEditForm
            environment={selectedEnvironment}
            onSuccess={handleEnvironmentUpdated}
            onCancel={handleBack}
          />
        ) : null

      default:
        return null
    }
  }

  return (
    <>
      {renderContent()}

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && selectedEnvironment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">確認刪除</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                確定要刪除環境設施「{selectedEnvironment.name}」嗎？
              </p>
              <p className="text-sm text-gray-500 mt-2">
                此操作無法復原。
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1"
              >
                {deleteLoading ? '刪除中...' : '確認刪除'}
              </Button>
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={deleteLoading}
                className="flex-1"
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 