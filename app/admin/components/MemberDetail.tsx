'use client'

import React, { useState } from 'react'
import { useMember } from '../../../lib/hooks/useMembers'
import { ROLE_LABELS, STATUS_LABELS, GENDER_LABELS, MemberRole, MemberStatus } from '../../../lib/types'
import { Button } from '../../../lib/ui/Button'
import MemberPhotoManager from './MemberPhotoManager'

interface MemberDetailProps {
  memberId: string
  onEdit?: () => void
  onDelete?: () => void
  onBack?: () => void
  onMemberUpdated?: () => void
}

export default function MemberDetail({ memberId, onEdit, onDelete, onBack, onMemberUpdated }: MemberDetailProps) {
  const { member, loading, error, refresh } = useMember(memberId)
  const [activeTab, setActiveTab] = useState<'details' | 'photos'>('details')
  const [currentMember, setCurrentMember] = useState(member)

  // 同步 member 狀態
  React.useEffect(() => {
    if (member) {
      setCurrentMember(member)
    }
  }, [member])

  // 處理犬隻更新
  const handleMemberUpdated = (updatedMember: any) => {
    setCurrentMember(updatedMember)
    refresh() // 重新獲取最新數據
    // 通知父組件（MembersManager）重新載入列表
    if (onMemberUpdated) {
      onMemberUpdated()
    }
  }

  // 計算年齡
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMs = today.getTime() - birth.getTime()
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25))
    const ageInMonths = Math.floor((ageInMs / (1000 * 60 * 60 * 24 * 30.44)) % 12)
    
    if (ageInYears > 0) {
      return `${ageInYears} 歲 ${ageInMonths} 個月`
    } else {
      return `${ageInMonths} 個月`
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">載入狗隻資料中...</span>
        </div>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">載入失敗</h3>
          <p className="text-gray-600 mb-4">{error?.message || '找不到此犬隻'}</p>
          <div className="space-x-4">
            <Button onClick={() => refresh()} variant="outline">
              重新載入
            </Button>
            {onBack && (
              <Button onClick={onBack} variant="secondary">
                返回列表
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 標題列 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
          </div>
          
          <div className="flex space-x-2">
            {onEdit && (
              <Button onClick={onEdit} variant="outline">
                編輯
              </Button>
            )}
            {onDelete && (
              <Button onClick={onDelete} variant="danger">
                刪除
              </Button>
            )}
          </div>
        </div>

        {/* 標籤頁導航 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              基本資料
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'photos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              照片管理
            </button>
          </nav>
        </div>
      </div>

      <div className="p-6">
        {/* 基本資料標籤頁 */}
        {activeTab === 'details' && currentMember && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左側：照片和基本資訊 */}
              <div className="lg:col-span-1">
                {/* 照片 */}
                <div className="mb-6">
                  {currentMember?.avatar_url ? (
                    <img
                      src={currentMember.avatar_url}
                      alt={currentMember.name}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 角色和狀態標籤 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    currentMember.role === MemberRole.BREEDING_MALE || currentMember.role === MemberRole.BREEDING_FEMALE
                      ? 'bg-blue-100 text-blue-800'
                      : currentMember.role === MemberRole.CHAMPION
                      ? 'bg-yellow-100 text-yellow-800'
                      : currentMember.role === MemberRole.RETIRED
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {ROLE_LABELS[currentMember.role]}
                  </span>
                  
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    currentMember.status === MemberStatus.ACTIVE
                      ? 'bg-green-100 text-green-800'
                      : currentMember.status === MemberStatus.RETIRED
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {STATUS_LABELS[currentMember.status]}
                  </span>
                </div>
              </div>

              {/* 右側：詳細資訊 */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 基本資訊 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      基本資訊
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">品種</label>
                      <p className="mt-1 text-sm text-gray-900">{member.breed}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">性別</label>
                      <p className="mt-1 text-sm text-gray-900">{GENDER_LABELS[member.gender]}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">毛色</label>
                      <p className="mt-1 text-sm text-gray-900">{member.color}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">生日</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(member.birth_date)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">年齡</label>
                      <p className="mt-1 text-sm text-gray-900">{calculateAge(member.birth_date)}</p>
                    </div>
                  </div>

                  {/* 性格和描述 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      特性資訊
                    </h3>

                    {member.personality_traits && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">性格特點</label>
                        <p className="mt-1 text-sm text-gray-900">{member.personality_traits}</p>
                      </div>
                    )}

                    {member.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">描述</label>
                        <p className="mt-1 text-sm text-gray-900 leading-relaxed">{member.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 血統資訊 */}
                {member.pedigree_info && Object.keys(member.pedigree_info).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      血統資訊
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(member.pedigree_info).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700">{key}</label>
                          <p className="mt-1 text-sm text-gray-900">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 健康記錄 */}
                {member.health_records && Object.keys(member.health_records).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      健康記錄
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(member.health_records).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700">{key}</label>
                          <p className="mt-1 text-sm text-gray-900">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 成就記錄 */}
                {member.achievements && member.achievements.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      成就記錄
                    </h3>
                    <div className="space-y-3">
                      {member.achievements.map((achievement, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-yellow-800">{achievement.title}</h4>
                              {achievement.description && (
                                <p className="text-sm text-yellow-700 mt-1">{achievement.description}</p>
                              )}
                              {achievement.date && (
                                <p className="text-xs text-yellow-600 mt-1">獲得日期：{formatDate(achievement.date)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 時間戳記 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">建立時間：</span>
                  {formatDate(member.created_at)}
                </div>
                <div>
                  <span className="font-medium">最後更新：</span>
                  {formatDate(member.updated_at)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 照片管理標籤頁 */}
        {activeTab === 'photos' && currentMember && (
          <MemberPhotoManager
            member={currentMember}
            onMemberUpdated={handleMemberUpdated}
          />
        )}
      </div>
    </div>
  )
} 