'use client'

import React, { useState } from 'react'
import { usePuppies } from '../../../lib/hooks/usePuppies'
import { useAuth } from '../../../lib/hooks/useAuth'
import { CreatePuppyInput, PuppyGender, PuppyBreed, PuppyStatus, PuppyColor } from '../../../lib/types/puppy'
import { Button } from '../../../lib/ui/Button'
import { PuppyValidator, formatValidationErrors } from '../../../lib/validation/puppy'

interface PuppyCreateFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function PuppyCreateForm({ onSuccess, onCancel }: PuppyCreateFormProps) {
  const { addPuppy } = usePuppies()
  const { session } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<CreatePuppyInput>({
    name: '',
    breed: PuppyBreed.SCOTTISH_TERRIER,
    birth_date: '',
    gender: PuppyGender.MALE,
    color: 'black',
    description: '',
    personality_traits: '',
    status: PuppyStatus.AVAILABLE,
    price: undefined,
    currency: 'TWD',
    microchip_id: '',
    birth_weight: undefined,
    expected_adult_weight: undefined
  })

  const handleInputChange = <K extends keyof CreatePuppyInput>(
    field: K, 
    value: CreatePuppyInput[K]
  ) => {
    // 更新表單資料
    const newFormData = {
      ...formData,
      [field]: value
    }
    setFormData(newFormData)
    
    // 清除該欄位的錯誤訊息
    if (fieldErrors[field as string]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }
    
    // 即時驗證單一欄位（僅針對必填欄位）
    if (['name', 'breed', 'birth_date', 'gender', 'color'].includes(field as string)) {
      const validation = PuppyValidator.validateCreateInput(newFormData)
      const fieldError = validation.errors.find(err => err.field === field)
      
      if (fieldError) {
        setFieldErrors(prev => ({
          ...prev,
          [field as string]: fieldError.message
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)

    try {
      // 清理空值
      const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          (acc as any)[key] = value
        }
        return acc
      }, {} as CreatePuppyInput)

      // 完整驗證
      const validation = PuppyValidator.validateComplete(cleanedData)
      
      if (!validation.isValid) {
        const formattedErrors = formatValidationErrors(validation.errors)
        setFieldErrors(formattedErrors)
        setError('請修正表單中的錯誤後再提交')
        return
      }

      const result = await addPuppy(cleanedData, session?.access_token)
      
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error?.message || '創建失敗')
      }
    } catch (err) {
      setError('創建失敗：網路錯誤')
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
            <h2 className="text-2xl font-bold text-gray-900">新增幼犬</h2>
            <p className="text-gray-600">填寫幼犬基本資訊</p>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    fieldErrors.name 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="輸入幼犬名稱"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    fieldErrors.breed 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value={PuppyBreed.SCOTTISH_TERRIER}>蘇格蘭梗</option>
                  <option value={PuppyBreed.WEST_HIGHLAND_WHITE}>西高地白梗</option>
                  <option value={PuppyBreed.CAIRN_TERRIER}>凱恩梗</option>
                  <option value={PuppyBreed.SKYE_TERRIER}>斯凱梗</option>
                  <option value={PuppyBreed.MIXED}>混血</option>
                </select>
                {fieldErrors.breed && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.breed}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={PuppyGender.MALE}>公</option>
                  <option value={PuppyGender.FEMALE}>母</option>
                </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="black">黑色</option>
                  <option value="wheaten">小麥色</option>
                  <option value="brindle">虎斑</option>
                  <option value="red">紅色</option>
                  <option value="silver">銀色</option>
                  <option value="cream">奶油色</option>
                  <option value="mixed">混色</option>
                </select>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    fieldErrors.birth_date 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.birth_date && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.birth_date}</p>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    fieldErrors.price 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="輸入價格"
                />
                {fieldErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    fieldErrors.microchip_id 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="輸入晶片號碼 (15位數字)"
                  maxLength={15}
                />
                {fieldErrors.microchip_id && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.microchip_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* 體重資訊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">體重資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="birth_weight" className="block text-sm font-medium text-gray-700 mb-2">
                  出生體重 (g)
                </label>
                <input
                  type="number"
                  id="birth_weight"
                  min="0"
                  value={formData.birth_weight || ''}
                  onChange={(e) => handleInputChange('birth_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="輸入出生體重"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="輸入預期成犬體重"
                />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="輸入幼犬描述..."
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="描述幼犬的性格特徵..."
              />
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
              {loading ? '創建中...' : '創建幼犬'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 