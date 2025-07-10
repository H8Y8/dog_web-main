'use client'

import React, { useState } from 'react'
import { Puppy } from '../../../lib/types/puppy'
import { Button } from '../../../lib/ui/Button'
import PuppyPhotoManager from './PuppyPhotoManager'

interface PuppyDetailProps {
  puppy: Puppy
  onBack: () => void
  onEdit: () => void
  onDelete?: () => void
  onPuppyUpdated?: () => void
}

export default function PuppyDetail({ puppy, onBack, onEdit, onDelete, onPuppyUpdated }: PuppyDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'photos'>('details')
  const [currentPuppy, setCurrentPuppy] = useState(puppy)

  // 同步 puppy 狀態
  React.useEffect(() => {
    if (puppy) {
      setCurrentPuppy(puppy)
    }
  }, [puppy])

  // 處理小狗更新
  const handlePuppyUpdated = (updatedPuppy: Puppy) => {
    setCurrentPuppy(updatedPuppy)
    // 通知父組件（PuppiesManager）重新載入列表
    if (onPuppyUpdated) {
      onPuppyUpdated()
    }
  }

  // 計算年齡
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMs = today.getTime() - birth.getTime()
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24))
    const ageInWeeks = Math.floor(ageInDays / 7)
    const ageInMonths = Math.floor(ageInDays / 30.44)
    
    if (ageInDays < 7) {
      return `${ageInDays} 天`
    } else if (ageInWeeks < 8) {
      return `${ageInWeeks} 週`
    } else if (ageInMonths < 12) {
      return `${ageInMonths} 個月`
    } else {
      const ageInYears = Math.floor(ageInMonths / 12)
      const remainingMonths = ageInMonths % 12
      return `${ageInYears} 歲 ${remainingMonths} 個月`
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

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 標題列 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentPuppy.name}</h2>
              <p className="text-gray-600">{currentPuppy.breed} • {currentPuppy.gender === 'male' ? '公' : '母'}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={onEdit} variant="outline">
              編輯
            </Button>
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
        {activeTab === 'details' && currentPuppy && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左側：照片和狀態 */}
              <div className="lg:col-span-1">
                {/* 照片 */}
                <div className="mb-6">
                  {currentPuppy?.cover_image ? (
                    <img
                      src={currentPuppy.cover_image}
                      alt={currentPuppy.name}
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

                {/* 狀態和價格標籤 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    currentPuppy.status === 'available'
                      ? 'bg-green-100 text-green-800' 
                      : currentPuppy.status === 'reserved'
                      ? 'bg-yellow-100 text-yellow-800'
                      : currentPuppy.status === 'sold'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currentPuppy.status === 'available' ? '可預約' : 
                     currentPuppy.status === 'reserved' ? '已預約' : 
                     currentPuppy.status === 'sold' ? '已售出' : 
                     currentPuppy.status === 'not_for_sale' ? '非售品' : 
                     currentPuppy.status}
                  </span>
                  
                  {currentPuppy.price && (
                    <span className="px-3 py-1 text-sm rounded-full font-medium bg-blue-100 text-blue-800">
                      NT$ {currentPuppy.price.toLocaleString()}
                    </span>
                  )}
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
                      <p className="mt-1 text-sm text-gray-900">{currentPuppy.breed}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">性別</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPuppy.gender === 'male' ? '公' : '母'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">毛色</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPuppy.color}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">出生日期</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(currentPuppy.birth_date)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">年齡</label>
                      <p className="mt-1 text-sm text-gray-900">{calculateAge(currentPuppy.birth_date)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">晶片號碼</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPuppy.microchip_id || '未設定'}</p>
                    </div>
                  </div>

                  {/* 特性和描述 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      特性資訊
                    </h3>

                    {currentPuppy.personality_traits && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">性格特點</label>
                        <p className="mt-1 text-sm text-gray-900">{currentPuppy.personality_traits}</p>
                      </div>
                    )}

                    {currentPuppy.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">描述</label>
                        <p className="mt-1 text-sm text-gray-900 leading-relaxed">{currentPuppy.description}</p>
                      </div>
                    )}

                    {currentPuppy.price && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">價格</label>
                        <p className="mt-1 text-lg font-semibold text-blue-600">
                          NT$ {currentPuppy.price.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {currentPuppy.currency && currentPuppy.currency !== 'TWD' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">幣別</label>
                        <p className="mt-1 text-sm text-gray-900">{currentPuppy.currency}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 體重資訊 */}
                {(currentPuppy.birth_weight || currentPuppy.current_weight || currentPuppy.expected_adult_weight) && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      體重資訊
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentPuppy.birth_weight && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">出生體重</label>
                          <p className="mt-1 text-sm text-gray-900">{currentPuppy.birth_weight}g</p>
                        </div>
                      )}
                      {currentPuppy.current_weight && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">目前體重</label>
                          <p className="mt-1 text-sm text-gray-900">{currentPuppy.current_weight}g</p>
                        </div>
                      )}
                      {currentPuppy.expected_adult_weight && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">預期成犬體重</label>
                          <p className="mt-1 text-sm text-gray-900">{currentPuppy.expected_adult_weight}kg</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 疫苗記錄 */}
                {currentPuppy.vaccination_records && currentPuppy.vaccination_records.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      疫苗記錄
                    </h3>
                    <div className="space-y-3">
                      {currentPuppy.vaccination_records.map((record, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-green-800">疫苗類型</label>
                              <p className="mt-1 text-sm text-green-900">{record.vaccine_type}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-green-800">接種日期</label>
                              <p className="mt-1 text-sm text-green-900">{formatDate(record.date)}</p>
                            </div>
                            {record.vet_name && (
                              <div>
                                <label className="block text-sm font-medium text-green-800">獸醫師</label>
                                <p className="mt-1 text-sm text-green-900">{record.vet_name}</p>
                              </div>
                            )}
                            {record.next_due_date && (
                              <div>
                                <label className="block text-sm font-medium text-green-800">下次接種</label>
                                <p className="mt-1 text-sm text-green-900">{formatDate(record.next_due_date)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 健康檢查記錄 */}
                {currentPuppy.health_checks && currentPuppy.health_checks.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      健康檢查記錄
                    </h3>
                    <div className="space-y-3">
                      {currentPuppy.health_checks.map((check, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-blue-800">檢查類型</label>
                              <p className="mt-1 text-sm text-blue-900">{check.type}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-800">檢查日期</label>
                              <p className="mt-1 text-sm text-blue-900">{formatDate(check.date)}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-800">檢查結果</label>
                              <p className="mt-1 text-sm text-blue-900">{check.result}</p>
                            </div>
                            {check.vet_name && (
                              <div>
                                <label className="block text-sm font-medium text-blue-800">獸醫師</label>
                                <p className="mt-1 text-sm text-blue-900">{check.vet_name}</p>
                              </div>
                            )}
                            {check.notes && (
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-blue-800">備註</label>
                                <p className="mt-1 text-sm text-blue-900">{check.notes}</p>
                              </div>
                            )}
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
                  {formatDate(currentPuppy.created_at)}
                </div>
                <div>
                  <span className="font-medium">最後更新：</span>
                  {formatDate(currentPuppy.updated_at)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 照片管理標籤頁 */}
        {activeTab === 'photos' && currentPuppy && (
          <PuppyPhotoManager
            puppy={currentPuppy}
            onPuppyUpdated={handlePuppyUpdated}
          />
        )}
      </div>
    </div>
  )
} 