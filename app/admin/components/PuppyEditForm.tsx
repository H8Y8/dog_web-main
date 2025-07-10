'use client'

import React, { useState, useEffect } from 'react'
import { usePuppies } from '../../../lib/hooks/usePuppies'
import { useAuth } from '../../../lib/hooks/useAuth'
import { Puppy, UpdatePuppyInput, PuppyGender, PuppyBreed, PuppyStatus, PuppyColor } from '../../../lib/types/puppy'
import { Button } from '../../../lib/ui/Button'
import { PuppyValidator, formatValidationErrors, getFieldLabel } from '../../../lib/validation/puppy'

interface PuppyEditFormProps {
  puppy: Puppy
  onSuccess: () => void
  onCancel: () => void
}

export default function PuppyEditForm({ puppy, onSuccess, onCancel }: PuppyEditFormProps) {
  const { updatePuppy } = usePuppies()
  const { session } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<UpdatePuppyInput>({
    name: puppy.name,
    breed: puppy.breed,
    birth_date: puppy.birth_date,
    gender: puppy.gender,
    color: puppy.color,
    description: puppy.description || '',
    personality_traits: puppy.personality_traits || '',
    status: puppy.status,
    price: puppy.price,
    currency: puppy.currency || 'TWD',
    microchip_id: puppy.microchip_id || '',
    current_weight: puppy.current_weight,
    expected_adult_weight: puppy.expected_adult_weight
  })

  const handleInputChange = <K extends keyof UpdatePuppyInput>(
    field: K, 
    value: UpdatePuppyInput[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除該欄位的錯誤
    if (validationErrors[field as string]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }
  }

  const getFieldError = (field: string) => {
    return validationErrors[field]
  }

  const getInputClassName = (field: string, baseClassName: string) => {
    const hasError = getFieldError(field)
    return hasError 
      ? `${baseClassName} border-red-300 focus:ring-red-500 focus:border-red-500`
      : baseClassName
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors({})
    setLoading(true)

    try {
      // 清理空值並只包含有變更的字段
      const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
        const originalValue = (puppy as any)[key]
        
        // 只包含有變更的字段
        if (value !== originalValue && value !== '' && value !== undefined && value !== null) {
          (acc as any)[key] = value
        }
        return acc
      }, {} as UpdatePuppyInput)

      // 如果沒有任何變更，直接返回成功
      if (Object.keys(cleanedData).length === 0) {
        onSuccess()
        return
      }

      // 為業務規則驗證準備完整的資料（結合原始資料和變更）
      const completeDataForValidation = {
        ...puppy,  // 原始資料
        ...cleanedData  // 變更的資料
      }

      // 驗證表單資料
      const validation = PuppyValidator.validateUpdateInput(cleanedData)
      const businessValidation = PuppyValidator.validateBusinessRules(completeDataForValidation)
      
      const combinedValidation = {
        isValid: validation.isValid && businessValidation.isValid,
        errors: [...validation.errors, ...businessValidation.errors]
      }

      if (!combinedValidation.isValid) {
        setValidationErrors(formatValidationErrors(combinedValidation.errors))
        setLoading(false)
        return
      }

      const result = await updatePuppy(puppy.id, cleanedData, session?.access_token)
      
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error?.message || '更新失敗')
      }
    } catch (err) {
      setError('更新失敗：網路錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 標題區域 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">編輯幼犬</h2>
            <p className="text-gray-600">編輯 {puppy.name} 的資訊</p>
          </div>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            取消
          </Button>
        </div>
      </div>

      {/* 表單內容 */}
      <div className="p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本資訊 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">基本資訊</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  名稱 *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={getInputClassName('name', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                  placeholder="輸入幼犬名稱"
                />
                {getFieldError('name') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                )}
              </div>

              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
                  品種 *
                </label>
                <select
                  id="breed"
                  required
                  value={formData.breed}
                  onChange={(e) => handleInputChange('breed', e.target.value as PuppyBreed)}
                  className={getInputClassName('breed', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                >
                  <option value={PuppyBreed.SCOTTISH_TERRIER}>蘇格蘭梗</option>
                  <option value={PuppyBreed.WEST_HIGHLAND_WHITE}>西高地白梗</option>
                  <option value={PuppyBreed.CAIRN_TERRIER}>凱恩梗</option>
                  <option value={PuppyBreed.SKYE_TERRIER}>斯凱梗</option>
                  <option value={PuppyBreed.MIXED}>混血</option>
                </select>
                {getFieldError('breed') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('breed')}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  性別 *
                </label>
                <select
                  id="gender"
                  required
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as PuppyGender)}
                  className={getInputClassName('gender', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                >
                  <option value={PuppyGender.MALE}>公</option>
                  <option value={PuppyGender.FEMALE}>母</option>
                </select>
                {getFieldError('gender') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('gender')}</p>
                )}
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  毛色 *
                </label>
                <select
                  id="color"
                  required
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value as PuppyColor)}
                  className={getInputClassName('color', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                >
                  <option value="black">黑色</option>
                  <option value="wheaten">小麥色</option>
                  <option value="brindle">虎斑</option>
                  <option value="red">紅色</option>
                  <option value="silver">銀色</option>
                  <option value="cream">奶油色</option>
                  <option value="mixed">混色</option>
                </select>
                {getFieldError('color') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('color')}</p>
                )}
              </div>

              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                  出生日期 *
                </label>
                <input
                  type="date"
                  id="birth_date"
                  required
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  className={getInputClassName('birth_date', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                />
                {getFieldError('birth_date') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('birth_date')}</p>
                )}
              </div>
            </div>

            {/* 狀態與價格 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">狀態與價格</h3>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  狀態
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as PuppyStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={PuppyStatus.AVAILABLE}>可預約</option>
                  <option value={PuppyStatus.RESERVED}>已預約</option>
                  <option value={PuppyStatus.SOLD}>已售出</option>
                  <option value={PuppyStatus.NOT_FOR_SALE}>非售品</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  價格 (NT$)
                </label>
                <input
                  type="number"
                  id="price"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={getInputClassName('price', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                  placeholder="輸入價格"
                />
                {getFieldError('price') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('price')}</p>
                )}
              </div>

              <div>
                <label htmlFor="microchip_id" className="block text-sm font-medium text-gray-700 mb-2">
                  晶片號碼
                </label>
                <input
                  type="text"
                  id="microchip_id"
                  value={formData.microchip_id}
                  onChange={(e) => handleInputChange('microchip_id', e.target.value)}
                  className={getInputClassName('microchip_id', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                  placeholder="輸入晶片號碼（15位數字）"
                />
                {getFieldError('microchip_id') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('microchip_id')}</p>
                )}
              </div>
            </div>
          </div>

          {/* 體重資訊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">體重資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="current_weight" className="block text-sm font-medium text-gray-700 mb-2">
                  當前體重 (g)
                </label>
                <input
                  type="number"
                  id="current_weight"
                  min="0"
                  value={formData.current_weight || ''}
                  onChange={(e) => handleInputChange('current_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={getInputClassName('current_weight', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                  placeholder="輸入當前體重"
                />
                {getFieldError('current_weight') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('current_weight')}</p>
                )}
              </div>

              <div>
                <label htmlFor="expected_adult_weight" className="block text-sm font-medium text-gray-700 mb-2">
                  預期成犬體重 (kg)
                </label>
                <input
                  type="number"
                  id="expected_adult_weight"
                  min="0"
                  step="0.1"
                  value={formData.expected_adult_weight || ''}
                  onChange={(e) => handleInputChange('expected_adult_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={getInputClassName('expected_adult_weight', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                  placeholder="輸入預期成犬體重"
                />
                {getFieldError('expected_adult_weight') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('expected_adult_weight')}</p>
                )}
              </div>
            </div>
          </div>

          {/* 描述資訊 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={getInputClassName('description', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                placeholder="輸入幼犬描述..."
              />
              {getFieldError('description') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
              )}
            </div>

            <div>
              <label htmlFor="personality_traits" className="block text-sm font-medium text-gray-700 mb-2">
                性格特徵
              </label>
              <textarea
                id="personality_traits"
                rows={3}
                value={formData.personality_traits}
                onChange={(e) => handleInputChange('personality_traits', e.target.value)}
                className={getInputClassName('personality_traits', "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent")}
                placeholder="描述幼犬的性格特徵..."
              />
              {getFieldError('personality_traits') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('personality_traits')}</p>
              )}
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? '更新中...' : '更新幼犬'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 