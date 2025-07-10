'use client'

import React, { useState } from 'react'
import { Environment, ENVIRONMENT_TYPE_LABELS, ENVIRONMENT_TYPE_COLORS } from '../../../lib/types/environment'
import { Button } from '../../../lib/ui/Button'
import EnvironmentPhotoManager from './EnvironmentPhotoManager'

interface EnvironmentDetailProps {
  environment: Environment
  onEdit?: () => void
  onDelete?: () => void
  onBack?: () => void
  onUpdate?: (updatedEnvironment: Environment) => void
  onError?: (error: string) => void
}

type TabType = 'info' | 'photos'

export default function EnvironmentDetail({ 
  environment, 
  onEdit, 
  onDelete, 
  onBack, 
  onUpdate, 
  onError 
}: EnvironmentDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('info')
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* 頁首 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回列表
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{environment.name}</h1>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ENVIRONMENT_TYPE_COLORS[environment.type]}`}>
                  {ENVIRONMENT_TYPE_LABELS[environment.type]}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                編輯
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={onDelete}
              >
                刪除
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 頁籤導航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            基本資訊
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'photos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            照片管理
          </button>
        </nav>
      </div>

      {/* 頁籤內容 */}
      <div className="p-6">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 基本資訊 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">基本資訊</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">環境設施名稱</dt>
                    <dd className="mt-1 text-sm text-gray-900">{environment.name}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">環境類型</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ENVIRONMENT_TYPE_COLORS[environment.type]}`}>
                        {ENVIRONMENT_TYPE_LABELS[environment.type]}
                      </span>
                    </dd>
                  </div>

                  {environment.description && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">描述</dt>
                      <dd className="mt-1 text-sm text-gray-900">{environment.description}</dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-gray-500">建立時間</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(environment.created_at).toLocaleString('zh-TW')}
                    </dd>
                  </div>

                  {environment.updated_at !== environment.created_at && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">最後更新</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(environment.updated_at).toLocaleString('zh-TW')}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* 特色設施 */}
              {environment.features && environment.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">特色設施</h3>
                  <div className="flex flex-wrap gap-2">
                    {environment.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 照片預覽 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">照片預覽</h3>
              {environment.cover_image || (environment.images && environment.images.length > 0) ? (
                <div className="space-y-4">
                  {/* 封面照片 */}
                  {environment.cover_image && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">封面照片</p>
                      <img
                        src={environment.cover_image}
                        alt={`${environment.name} - 封面`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-image.jpg'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* 其他照片 */}
                  {environment.images && environment.images.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">環境照片</p>
                      <div className="grid grid-cols-2 gap-2">
                        {environment.images.slice(0, 4).map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <img
                              src={imageUrl}
                              alt={`${environment.name} - 圖片 ${index + 1}`}
                              className="w-full h-24 object-cover rounded border border-gray-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder-image.jpg'
                              }}
                            />
                          </div>
                        ))}
                        {environment.images.length > 4 && (
                          <div className="flex items-center justify-center bg-gray-100 rounded text-gray-500 text-xs">
                            +{environment.images.length - 4} 張
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setActiveTab('photos')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    查看所有照片 →
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">尚未上傳照片</p>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    前往上傳 →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <EnvironmentPhotoManager
            environment={environment}
            onUpdate={onUpdate}
            onError={onError}
          />
        )}
      </div>
    </div>
  )
} 