'use client'

import React, { useState, useEffect } from 'react'
import { Member, UpdateMemberInput, MemberRole, MemberStatus, Gender, ROLE_LABELS, STATUS_LABELS, GENDER_LABELS } from '../../../lib/types'
import { useMembers } from '../../../lib/hooks/useMembers'
import { useAuth } from '../../../lib/hooks/useAuth'
import { Button } from '../../../lib/ui/Button'

interface MemberEditFormProps {
  member: Member
  onSuccess?: (member: Member) => void
  onCancel?: () => void
}

export default function MemberEditForm({ member, onSuccess, onCancel }: MemberEditFormProps) {
  const { updateMember } = useMembers()
  const { session } = useAuth()
  
  const [formData, setFormData] = useState<UpdateMemberInput>({
    name: member.name,
    breed: member.breed,
    birth_date: member.birth_date,
    gender: member.gender,
    color: member.color,
    role: member.role,
    status: member.status,
    description: member.description || '',
    personality_traits: member.personality_traits || ''
  })
  
  const [errors, setErrors] = useState<Partial<UpdateMemberInput>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // 當member改變時更新表單資料
  useEffect(() => {
    setFormData({
      name: member.name,
      breed: member.breed,
      birth_date: member.birth_date,
      gender: member.gender,
      color: member.color,
      role: member.role,
      status: member.status,
      description: member.description || '',
      personality_traits: member.personality_traits || ''
    })
  }, [member])

  // 處理表單欄位變更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除對應欄位的錯誤
    if (errors[name as keyof UpdateMemberInput]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // 表單驗證
  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateMemberInput> = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = '請輸入狗狗名字'
    }
    
    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date)
      const today = new Date()
      if (birthDate > today) {
        newErrors.birth_date = '生日不能是未來日期'
      }
    }
    
    if (!formData.color?.trim()) {
      newErrors.color = '請輸入毛色'
    }
    
    if (!formData.breed?.trim()) {
      newErrors.breed = '請輸入品種'
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
      // 只更新有變更的欄位
      const updateData: UpdateMemberInput = {}
      
      Object.keys(formData).forEach(key => {
        const fieldKey = key as keyof UpdateMemberInput
        const newValue = formData[fieldKey]
        const originalValue = member[fieldKey as keyof Member]
        
        if (newValue !== originalValue) {
          // 使用類型斷言來處理類型相容性
          (updateData as any)[fieldKey] = newValue
        }
      })
      
      // 如果沒有任何變更
      if (Object.keys(updateData).length === 0) {
        setSubmitError('沒有偵測到任何變更')
        setLoading(false)
        return
      }
      
      const result = await updateMember(member.id, updateData, session?.access_token)
      
      if (result.success && result.data) {
        onSuccess?.(result.data)
      } else {
        setSubmitError(result.error?.message || '更新犬隻失敗')
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
        <h2 className="text-2xl font-bold text-gray-900">編輯犬隻 - {member.name}</h2>
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
          {/* 狗狗名字 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              狗狗名字 *
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
              placeholder="例：Max、Lady Rose"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* 品種 */}
          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
              品種 *
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.breed ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例：Scottish Terrier"
            />
            {errors.breed && (
              <p className="text-red-500 text-sm mt-1">{errors.breed}</p>
            )}
          </div>

          {/* 生日 */}
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
              生日 *
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.birth_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.birth_date && (
              <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>
            )}
          </div>

          {/* 毛色 */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
              毛色 *
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.color ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例：黑色、小麥色、斑紋"
            />
            {errors.color && (
              <p className="text-red-500 text-sm mt-1">{errors.color}</p>
            )}
          </div>

          {/* 性別 */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              性別 *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(Gender).map(gender => (
                <option key={gender} value={gender}>
                  {GENDER_LABELS[gender]}
                </option>
              ))}
            </select>
          </div>

          {/* 角色 */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              角色 *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(MemberRole).map(role => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>

          {/* 狀態 */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              狀態 *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(MemberStatus).map(status => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 性格特點 */}
        <div>
          <label htmlFor="personality_traits" className="block text-sm font-medium text-gray-700 mb-2">
            性格特點
          </label>
          <input
            type="text"
            id="personality_traits"
            name="personality_traits"
            value={formData.personality_traits || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例：活潑、聰明、溫馴、勇敢"
          />
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
            placeholder="詳細描述這隻狗狗的特色、背景故事等..."
          />
        </div>

        {/* 提交按鈕 */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              取消
            </Button>
          )}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? '更新中...' : '儲存變更'}
          </Button>
        </div>
      </form>
    </div>
  )
} 