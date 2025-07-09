'use client'

import React from 'react'
import { Member, ROLE_LABELS, GENDER_LABELS } from '../../lib/types'

interface DogMemberCardProps {
  member: Member
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function DogMemberCard({ member, onMouseEnter, onMouseLeave }: DogMemberCardProps) {
  // 計算年齡
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMs = today.getTime() - birth.getTime()
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25))
    const ageInMonths = Math.floor((ageInMs / (1000 * 60 * 60 * 24 * 30.44)) % 12)
    
    if (ageInYears > 0) {
      return `${ageInYears} 歲`
    } else {
      return `${ageInMonths} 個月`
    }
  }

  // 處理性格特質（如果存在的話）
  const traits = member.personality_traits ? member.personality_traits.split(',').map(trait => trait.trim()) : []

  return (
    <div
      className="relative group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-102">
        <div className="relative h-80 overflow-hidden">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:saturate-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-earth-900/40 to-transparent 
            transition-opacity duration-500 group-hover:opacity-75"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold group-hover:text-primary-200 transition-colors duration-300">
                {member.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-primary-500/80 backdrop-blur-sm rounded-full text-sm">
                  {GENDER_LABELS[member.gender]}
                </span>
                <span className="px-3 py-1 bg-primary-500/80 backdrop-blur-sm rounded-full text-sm">
                  {calculateAge(member.birth_date)}
                </span>
                <span className="px-3 py-1 bg-primary-500/80 backdrop-blur-sm rounded-full text-sm">
                  {ROLE_LABELS[member.role]}
                </span>
              </div>
            </div>
            {traits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {traits.slice(0, 4).map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-earth-700/50 backdrop-blur-sm rounded-full text-sm 
                      transform transition-transform duration-300 hover:scale-105"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-3">
            <p className="text-earth-600 text-sm">
              <span className="font-medium">品種：</span>{member.breed}
              <span className="mx-2">•</span>
              <span className="font-medium">毛色：</span>{member.color}
            </p>
          </div>
          <p className="text-earth-700 leading-relaxed">
            {member.description || `${member.name} 是我們犬舍的珍貴成員，具有優良的血統和性格。`}
          </p>
          {member.achievements && member.achievements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-earth-900 mb-2">成就</h4>
              <div className="space-y-1">
                {member.achievements.slice(0, 2).map((achievement, index) => (
                  <p key={index} className="text-earth-600 text-sm">
                    • {achievement.title}
                    {achievement.date && (
                      <span className="text-earth-500 ml-2">({new Date(achievement.date).getFullYear()})</span>
                    )}
                  </p>
                ))}
                {member.achievements.length > 2 && (
                  <p className="text-earth-500 text-xs">
                    及其他 {member.achievements.length - 2} 項成就...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 相簿預覽 */}
          {member.album_urls && member.album_urls.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-earth-900 mb-2">相簿</h4>
              <div className="flex gap-2 overflow-x-auto">
                {member.album_urls.slice(0, 3).map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${member.name} 相簿 ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                ))}
                {member.album_urls.length > 3 && (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-500">+{member.album_urls.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 證書預覽 */}
          <div className="mt-4 flex gap-4 text-xs">
            {member.pedigree_urls && member.pedigree_urls.length > 0 && (
              <div className="flex items-center gap-1 text-earth-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>血統證書 {member.pedigree_urls.length}</span>
              </div>
            )}
            {member.health_check_urls && member.health_check_urls.length > 0 && (
              <div className="flex items-center gap-1 text-earth-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>健康證書 {member.health_check_urls.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 裝飾元素 */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-xl 
        transition-all duration-300 group-hover:scale-125 group-hover:bg-primary-500/30"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-earth-500/20 rounded-full blur-xl 
        transition-all duration-300 group-hover:scale-125 group-hover:bg-earth-500/30"></div>
    </div>
  )
} 