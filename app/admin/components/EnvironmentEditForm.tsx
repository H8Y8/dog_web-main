'use client'

import React, { useState, useEffect } from 'react'
import { Environment, UpdateEnvironmentInput, EnvironmentType, ENVIRONMENT_TYPE_LABELS } from '../../../lib/types/environment'
import { useEnvironments } from '../../../lib/hooks/useEnvironments'
import { useAuth } from '../../../lib/hooks/useAuth'
import { Button } from '../../../lib/ui/Button'

interface EnvironmentEditFormProps {
  environment: Environment
  onSuccess?: (environment: Environment) => void
  onCancel?: () => void
}

export default function EnvironmentEditForm({ environment, onSuccess, onCancel }: EnvironmentEditFormProps) {
  const { updateEnvironment } = useEnvironments()
  const { session } = useAuth()
  
  const [formData, setFormData] = useState<UpdateEnvironmentInput>({
    name: environment.name,
    type: environment.type,
    description: environment.description || '',
    features: environment.features || []
  })
  
  const [featuresInput, setFeaturesInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // 處理表單欄位變更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除對應欄位的錯誤
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  // 處理特色設施變更
  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturesInput(e.target.value)
  }

  // 新增特色設施
  const addFeature = () => {
    const feature = featuresInput.trim()
    if (feature && !(formData.features || []).includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), feature]
      }))
      setFeaturesInput('')
    }
  }

  // 移除特色設施
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }))
  }

  // 表單驗證
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = '請輸入環境設施名稱'
    }
    
    if (!formData.type) {
      newErrors.type = '請選擇環境類型'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const result = await updateEnvironment(environment.id, formData, session?.access_token)
      
      if (result.success && result.data) {
        onSuccess?.(result.data)
      } else {
        setSubmitError(result.error?.message || '更新環境設施失敗')
      }
    } catch (error) {
      setSubmitError('網路錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">編輯環境設施</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 環境設施名稱 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              環境設施名稱 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例：舒適住宿區、專業訓練教室"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* 環境類型 */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              環境類型 *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {Object.entries(ENVIRONMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>
        </div>

        {/* 描述 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            描述
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="描述環境設施的特色、功能或其他重要資訊..."
          />
        </div>

        {/* 特色設施 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            特色設施
          </label>
          
          {/* 新增特色設施 */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={featuresInput}
              onChange={handleFeaturesChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入特色設施，例：冷暖氣、監視系統..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addFeature()
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={addFeature}
              disabled={!featuresInput.trim()}
            >
              新增
            </Button>
          </div>

          {/* 已新增的特色設施 */}
          {formData.features && formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 提交按鈕 */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              取消
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? '更新中...' : '更新環境設施'}
          </Button>
        </div>
      </form>
    </div>
  )
} 