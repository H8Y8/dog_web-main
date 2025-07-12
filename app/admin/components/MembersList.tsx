'use client'

import React, { useState } from 'react'
import { useMembers } from '../../../lib/hooks/useMembers'
import { MemberRole, MemberStatus, ROLE_LABELS, STATUS_LABELS } from '../../../lib/types'
import { Button } from '../../../lib/ui/Button'

interface MembersListProps {
  onSelectMember?: (memberId: string) => void
  onCreateNew?: () => void
}

export default function MembersList({ onSelectMember, onCreateNew }: MembersListProps) {
  const [selectedRole, setSelectedRole] = useState<MemberRole | ''>('')
  const [selectedStatus, setSelectedStatus] = useState<MemberStatus | ''>('')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { members, loading, error, refresh } = useMembers({
    role: selectedRole || undefined,
    status: selectedStatus || undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  // 搜尋篩選
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.color.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 計算年齡
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMs = today.getTime() - birth.getTime()
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25))
    return ageInYears
  }

  // 重置篩選
  const resetFilters = () => {
    setSelectedRole('')
    setSelectedStatus('')
    setSearchTerm('')
  }

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
          <Button onClick={() => refresh()} variant="outline">
            重新載入
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 標題和新增按鈕 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">犬隻管理</h2>
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              新增犬隻
            </Button>
          )}
        </div>
      </div>

      {/* 篩選和搜尋 */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜尋 */}
          <div>
            <input
              type="text"
              placeholder="搜尋名字、品種、毛色..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* 角色篩選 */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as MemberRole | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有角色</option>
              {Object.values(MemberRole).map(role => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>

          {/* 狀態篩選 */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as MemberStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有狀態</option>
              {Object.values(MemberStatus).map(status => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {/* 重置按鈕 */}
          <div>
            <Button 
              onClick={resetFilters} 
              variant="outline" 
              fullWidth
            >
              重置篩選
            </Button>
          </div>
        </div>
      </div>

      {/* 犬隻列表 */}
      <div className="px-6 py-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暫無犬隻</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedRole || selectedStatus ? '沒有符合篩選條件的犬隻' : '還沒有新增任何犬隻'}
            </p>
            {onCreateNew && (
              <Button onClick={onCreateNew} variant="outline">
                新增第一隻犬隻
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectMember?.(member.id)}
              >
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
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{member.breed}</span>
                    <span className="mx-2">•</span>
                    <span>{calculateAge(member.birth_date)} 歲</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <span>毛色：{member.color}</span>
                  </div>

                  {/* 角色和狀態標籤 */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      member.role === MemberRole.BREEDING_MALE || member.role === MemberRole.BREEDING_FEMALE
                        ? 'bg-blue-100 text-blue-800'
                        : member.role === MemberRole.CHAMPION
                        ? 'bg-yellow-100 text-yellow-800'
                        : member.role === MemberRole.RETIRED
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ROLE_LABELS[member.role]}
                    </span>
                    
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      member.status === MemberStatus.ACTIVE
                        ? 'bg-green-100 text-green-800'
                        : member.status === MemberStatus.RETIRED
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {STATUS_LABELS[member.status]}
                    </span>
                  </div>

                  {/* 性格特點 */}
                  {member.personality_traits && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">性格：</span>
                      {member.personality_traits}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 統計資訊 */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          總共 {members.length} 隻犬隻
          {(searchTerm || selectedRole || selectedStatus) && 
            ` • 顯示 ${filteredMembers.length} 隻符合篩選條件的犬隻`
          }
        </div>
      </div>
    </div>
  )
} 