'use client'

import React, { useState } from 'react'
import { useMembers } from '../../../lib/hooks/useMembers'
import { useAuth } from '../../../lib/hooks/useAuth'
import { Member } from '../../../lib/types'
import { Button } from '../../../lib/ui/Button'
import MemberDetail from './MemberDetail'
import MemberCreateForm from './MemberCreateForm'
import MemberEditForm from './MemberEditForm'

type View = 'list' | 'detail' | 'create' | 'edit'

// 帶操作的犬隻列表包裝組件
function MembersListWithActions({ 
  members,
  loading,
  error,
  onViewDetail, 
  onEdit, 
  onDelete 
}: {
  members: Member[]
  loading: boolean
  error: Error | null
  onViewDetail: (member: Member) => void
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">載入犬隻中...</span>
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
        {members.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暫無犬隻</h3>
            <p className="text-gray-600">還沒有新增任何犬隻</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* 狗狗照片 */}
                <div className="mb-4">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 基本資訊 */}
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.breed}</p>
                </div>

                {/* 操作按鈕 */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetail(member)}
                  >
                    查看
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(member)}
                  >
                    編輯
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(member)}
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

interface MembersManagerProps {
  initialView?: View
}

export default function MembersManager({ initialView = 'list' }: MembersManagerProps) {
  // 統一使用一個 useMembers hook 實例
  const { 
    members, 
    loading, 
    error, 
    addMember,
    updateMember,
    removeMember,
    refresh
  } = useMembers()
  
  const { session } = useAuth()
  
  const [currentView, setCurrentView] = useState<View>(initialView)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 處理查看詳情
  const handleViewDetail = (member: Member) => {
    setSelectedMember(member)
    setCurrentView('detail')
  }

  // 處理編輯
  const handleEdit = (member: Member) => {
    setSelectedMember(member)
    setCurrentView('edit')
  }

  // 處理刪除
  const handleDelete = (member: Member) => {
    setSelectedMember(member)
    setShowDeleteConfirm(true)
  }

  // 確認刪除
  const confirmDelete = async () => {
    if (!selectedMember) return
    
    setDeleteLoading(true)
    try {
      const result = await removeMember(selectedMember.id, session?.access_token)
      if (result.success) {
        setCurrentView('list')
        setSelectedMember(null)
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
    setSelectedMember(null)
  }

  // 處理成功操作後的回調
  const handleSuccess = () => {
    setCurrentView('list')
    setSelectedMember(null)
    // 重新整理列表
    refresh()
  }

  // 處理犬隻更新（例如照片上傳）
  const handleMemberUpdated = () => {
    // 重新載入列表資料以顯示最新的頭像
    refresh()
  }

  // 返回列表
  const handleBack = () => {
    setCurrentView('list')
    setSelectedMember(null)
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentView === 'list' && '犬隻管理'}
            {currentView === 'detail' && `${selectedMember?.name} - 詳細資料`}
            {currentView === 'create' && '新增犬隻'}
            {currentView === 'edit' && `編輯 ${selectedMember?.name}`}
          </h1>
        </div>
        
        <div className="flex space-x-3">
          {currentView !== 'list' && (
            <Button variant="outline" onClick={handleBack}>
              返回列表
            </Button>
          )}
          
          {currentView === 'list' && (
            <Button onClick={() => setCurrentView('create')}>
              新增犬隻
            </Button>
          )}
        </div>
      </div>

      {/* 主要內容區域 */}
      {currentView === 'list' && (
        <MembersListWithActions
          members={members}
          loading={loading}
          error={error}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {currentView === 'detail' && selectedMember && (
        <MemberDetail
          memberId={selectedMember.id}
          onEdit={() => setCurrentView('edit')}
          onBack={handleBack}
          onMemberUpdated={handleMemberUpdated}
        />
      )}

      {currentView === 'create' && (
        <MemberCreateForm
          onSuccess={handleSuccess}
          onCancel={handleBack}
        />
      )}

      {currentView === 'edit' && selectedMember && (
        <MemberEditForm
          member={selectedMember}
          onSuccess={handleSuccess}
          onCancel={handleBack}
        />
      )}

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && selectedMember && (
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
                  您確定要刪除犬隻「{selectedMember.name}」嗎？此操作無法復原。
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