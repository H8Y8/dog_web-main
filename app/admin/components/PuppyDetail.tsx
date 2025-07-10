'use client'

import React from 'react'
import { Puppy } from '../../../lib/types/puppy'
import { Button } from '../../../lib/ui/Button'

interface PuppyDetailProps {
  puppy: Puppy
  onBack: () => void
  onEdit: () => void
  onManagePhotos?: () => void
}

export default function PuppyDetail({ puppy, onBack, onEdit, onManagePhotos }: PuppyDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      {/* 標題區域 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="mr-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回列表
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{puppy.name}</h2>
              <p className="text-gray-600">{puppy.breed} • {puppy.gender === 'male' ? '公' : '母'}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {onManagePhotos && (
              <Button variant="outline" onClick={onManagePhotos}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
                管理照片
              </Button>
            )}
            <Button onClick={onEdit}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              編輯
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 照片區域 */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">照片</h3>
            <div className="space-y-4">
              {puppy.cover_image && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">主要照片</p>
                  <img
                    src={puppy.cover_image}
                    alt={`${puppy.name} 主要照片`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {puppy.images && puppy.images.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">其他照片</p>
                  <div className="grid grid-cols-2 gap-2">
                    {puppy.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${puppy.name} 照片 ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {!puppy.cover_image && (!puppy.images || puppy.images.length === 0) && (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">暫無照片</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 詳細資訊 */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本資訊 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本資訊</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">名稱</label>
                    <p className="text-gray-900">{puppy.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">品種</label>
                    <p className="text-gray-900">{puppy.breed}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">性別</label>
                    <p className="text-gray-900">{puppy.gender === 'male' ? '公' : '母'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">毛色</label>
                    <p className="text-gray-900">{puppy.color}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">出生日期</label>
                    <p className="text-gray-900">{new Date(puppy.birth_date).toLocaleDateString('zh-TW')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">晶片號碼</label>
                    <p className="text-gray-900">{puppy.microchip_id || '未設定'}</p>
                  </div>
                </div>
              </div>

              {/* 狀態與價格 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">狀態與價格</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">狀態</label>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      puppy.status === 'available'
                        ? 'bg-green-100 text-green-800' 
                        : puppy.status === 'reserved'
                        ? 'bg-yellow-100 text-yellow-800'
                        : puppy.status === 'sold'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {puppy.status === 'available' ? '可預約' : 
                       puppy.status === 'reserved' ? '已預約' : 
                       puppy.status === 'sold' ? '已售出' : 
                       puppy.status === 'not_for_sale' ? '非售品' : 
                       puppy.status}
                    </span>
                  </div>
                  {puppy.price && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">價格</label>
                      <p className="text-gray-900 text-lg font-semibold text-blue-600">
                        NT$ {puppy.price.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {puppy.currency && puppy.currency !== 'TWD' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">幣別</label>
                      <p className="text-gray-900">{puppy.currency}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 描述 */}
              {puppy.description && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">描述</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{puppy.description}</p>
                </div>
              )}

              {/* 性格特徵 */}
              {puppy.personality_traits && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">性格特徵</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{puppy.personality_traits}</p>
                </div>
              )}

              {/* 體重資訊 */}
              {(puppy.birth_weight || puppy.current_weight || puppy.expected_adult_weight) && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">體重資訊</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {puppy.birth_weight && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">出生體重</label>
                        <p className="text-gray-900">{puppy.birth_weight}g</p>
                      </div>
                    )}
                    {puppy.current_weight && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">目前體重</label>
                        <p className="text-gray-900">{puppy.current_weight}g</p>
                      </div>
                    )}
                    {puppy.expected_adult_weight && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">預期成犬體重</label>
                        <p className="text-gray-900">{puppy.expected_adult_weight}kg</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 時間戳記 */}
              <div className="md:col-span-2 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <label className="block font-medium">建立時間</label>
                    <p>{new Date(puppy.created_at).toLocaleString('zh-TW')}</p>
                  </div>
                  <div>
                    <label className="block font-medium">最後更新</label>
                    <p>{new Date(puppy.updated_at).toLocaleString('zh-TW')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 