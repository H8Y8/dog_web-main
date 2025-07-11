'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Puppy, PuppyStatus, PuppyBreed, PuppyGender } from '../../../lib/types/puppy'
import { cn } from '../../../lib/ui/utils'

export default function PuppyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [puppy, setPuppy] = useState<Puppy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 獲取幼犬詳細資料
  useEffect(() => {
    if (!params.id) return

    const fetchPuppy = async () => {
      try {
        const response = await fetch(`/api/puppies/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('找不到此幼犬資料')
          }
          throw new Error(`HTTP ${response.status}: 獲取幼犬詳細資料失敗`)
        }
        
        const response_data = await response.json()
        // 解構API響應中的data字段
        if (response_data.success && response_data.data) {
          setPuppy(response_data.data)
        } else {
          throw new Error('API響應格式錯誤')
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching puppy:', err)
        setError(err instanceof Error ? err.message : '獲取幼犬詳細資料失敗')
      } finally {
        setLoading(false)
      }
    }

    fetchPuppy()
  }, [params.id])

  // 格式化年齡
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - birth.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)

    if (diffDays < 30) return `${diffWeeks} 週大`
    if (diffDays < 365) return `${diffMonths} 個月大`
    return `${Math.floor(diffDays / 365)} 歲`
  }

  // 格式化價格
  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return '價格面議'
    const formattedPrice = new Intl.NumberFormat('zh-TW').format(price)
    return `${currency || 'TWD'} $${formattedPrice}`
  }

  // 獲取狀態顯示
  const getStatusDisplay = (status: PuppyStatus) => {
    const statusMap = {
      [PuppyStatus.AVAILABLE]: { text: '可預約', class: 'bg-green-100 text-green-800', icon: '✓' },
      [PuppyStatus.RESERVED]: { text: '已預訂', class: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      [PuppyStatus.SOLD]: { text: '已售出', class: 'bg-gray-100 text-gray-800', icon: '✗' },
      [PuppyStatus.NOT_FOR_SALE]: { text: '非賣品', class: 'bg-blue-100 text-blue-800', icon: '🏠' }
    }
    return statusMap[status] || statusMap[PuppyStatus.AVAILABLE]
  }

  // 獲取品種顯示名稱
  const getBreedDisplay = (breed: PuppyBreed) => {
    const breedMap = {
      [PuppyBreed.SCOTTISH_TERRIER]: '蘇格蘭㹴',
      [PuppyBreed.WEST_HIGHLAND_WHITE]: '西高地白㹴',
      [PuppyBreed.CAIRN_TERRIER]: '凱恩㹴',
      [PuppyBreed.SKYE_TERRIER]: '斯凱㹴',
      [PuppyBreed.MIXED]: '混血'
    }
    return breedMap[breed] || breed
  }

  // 格式化體重
  const formatWeight = (weight?: number, unit: string = 'g') => {
    if (!weight) return '-'
    if (unit === 'kg') {
      return `${weight} 公斤`
    }
    return `${weight} 公克`
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
      <div className="min-h-screen bg-earth-50 flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-400 rounded-full animate-spin" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-amber-700 font-medium">載入幼犬詳細資料中...</p>
        </div>
      </div>
    )
  }

  if (error || !puppy) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center pt-32">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-900 mb-2">載入失敗</h3>
          <p className="text-amber-700 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              返回
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              重新載入
            </button>
          </div>
        </div>
      </div>
    )
  }

  const status = getStatusDisplay(puppy.status)
  
  // 構建圖片陣列：優先顯示主要照片，然後是相簿照片
  const images = []
  if (puppy.cover_image) {
    images.push(puppy.cover_image)
  }
  if (puppy.images && puppy.images.length > 0) {
    // 避免重複顯示同一張照片
    const albumImages = puppy.images.filter(img => img !== puppy.cover_image)
    images.push(...albumImages)
  }

  return (
    <div className="min-h-screen bg-earth-50">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-earth-200/20 to-earth-300/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-earth-200/20 to-earth-300/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* 導航 */}
      <nav className="relative pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/puppies"
            className="inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回幼犬列表
          </Link>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* 左側：圖片區域 */}
            <div className="space-y-6">
              {/* 主圖 */}
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 shadow-2xl">
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={puppy.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-24 h-24 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 狀態標籤 */}
                <div className="absolute top-6 left-6">
                  <span className={cn("px-4 py-2 rounded-full text-sm font-medium shadow-lg", status.class)}>
                    {status.icon} {status.text}
                  </span>
                </div>
              </div>

              {/* 縮圖 */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300",
                        currentImageIndex === index
                          ? "border-amber-500 shadow-lg scale-105"
                          : "border-amber-200 hover:border-amber-400 hover:shadow-md"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${puppy.name} - 圖片 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 右側：詳細資訊 */}
            <div className="space-y-8">
              {/* 基本資訊卡片 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-amber-900 mb-2">{puppy.name}</h1>
                    <p className="text-xl text-amber-700">{calculateAge(puppy.birth_date)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-900 mb-1">
                      {formatPrice(puppy.price, puppy.currency)}
                    </div>
                  </div>
                </div>

                {/* 基本資訊網格 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-medium text-amber-600 block mb-1">品種</label>
                    <div className="text-amber-900 font-semibold">{getBreedDisplay(puppy.breed)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-600 block mb-1">性別</label>
                    <div className="text-amber-900 font-semibold">
                      {puppy.gender === PuppyGender.MALE ? '公犬 ♂' : '母犬 ♀'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-600 block mb-1">毛色</label>
                    <div className="text-amber-900 font-semibold capitalize">{puppy.color}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-600 block mb-1">出生日期</label>
                    <div className="text-amber-900 font-semibold">{formatDate(puppy.birth_date)}</div>
                  </div>
                </div>

                {/* 聯繫按鈕 */}
                {puppy.status === PuppyStatus.AVAILABLE && (
                  <div className="flex gap-4">
                    <button className="flex-1 bg-amber-500 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl">
                      💬 聯繫我們
                    </button>
                    <button className="flex-1 bg-green-500 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl">
                      📅 預約參觀
                    </button>
                  </div>
                )}
              </div>

              {/* 描述卡片 */}
              {puppy.description && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">關於 {puppy.name}</h3>
                  <p className="text-amber-700 leading-relaxed whitespace-pre-wrap">{puppy.description}</p>
                </div>
              )}

              {/* 性格特徵卡片 */}
              {puppy.personality_traits && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">性格特徵</h3>
                  <p className="text-amber-700 leading-relaxed whitespace-pre-wrap">{puppy.personality_traits}</p>
                </div>
              )}

              {/* 健康資訊卡片 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
                <h3 className="text-xl font-bold text-amber-900 mb-4">健康資訊</h3>
                <div className="grid grid-cols-1 gap-4">
                  {puppy.microchip_id && (
                    <div className="flex justify-between items-center py-2 border-b border-amber-100">
                      <span className="text-amber-600 font-medium">晶片號碼</span>
                      <span className="text-amber-900 font-mono">{puppy.microchip_id}</span>
                    </div>
                  )}
                  {puppy.birth_weight && (
                    <div className="flex justify-between items-center py-2 border-b border-amber-100">
                      <span className="text-amber-600 font-medium">出生體重</span>
                      <span className="text-amber-900">{formatWeight(puppy.birth_weight)}</span>
                    </div>
                  )}
                  {puppy.current_weight && (
                    <div className="flex justify-between items-center py-2 border-b border-amber-100">
                      <span className="text-amber-600 font-medium">目前體重</span>
                      <span className="text-amber-900">{formatWeight(puppy.current_weight)}</span>
                    </div>
                  )}
                  {puppy.expected_adult_weight && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-amber-600 font-medium">預期成犬體重</span>
                      <span className="text-amber-900">{formatWeight(puppy.expected_adult_weight, 'kg')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 血統資訊卡片 */}
              {puppy.pedigree_info && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">血統資訊</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {puppy.pedigree_info.sire_name && (
                      <div className="flex justify-between items-center py-2 border-b border-amber-100">
                        <span className="text-amber-600 font-medium">父犬</span>
                        <span className="text-amber-900">{puppy.pedigree_info.sire_name}</span>
                      </div>
                    )}
                    {puppy.pedigree_info.dam_name && (
                      <div className="flex justify-between items-center py-2 border-b border-amber-100">
                        <span className="text-amber-600 font-medium">母犬</span>
                        <span className="text-amber-900">{puppy.pedigree_info.dam_name}</span>
                      </div>
                    )}
                    {puppy.pedigree_info.registration_number && (
                      <div className="flex justify-between items-center py-2 border-b border-amber-100">
                        <span className="text-amber-600 font-medium">註冊號碼</span>
                        <span className="text-amber-900 font-mono">{puppy.pedigree_info.registration_number}</span>
                      </div>
                    )}
                    {puppy.pedigree_info.kennel_name && (
                      <div className="flex justify-between items-center py-2 border-b border-amber-100">
                        <span className="text-amber-600 font-medium">犬舍</span>
                        <span className="text-amber-900">{puppy.pedigree_info.kennel_name}</span>
                      </div>
                    )}
                    {puppy.pedigree_info.champion_bloodline && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-amber-600 font-medium">冠軍血統</span>
                        <span className="text-green-600 font-semibold">✓ 是</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 血統證書文件卡片 */}
              {puppy.pedigree_documents && puppy.pedigree_documents.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">血統證書</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {puppy.pedigree_documents.map((doc, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg bg-amber-50 hover:shadow-xl transition-all duration-300">
                        <img
                          src={doc}
                          alt={`血統證書 ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 text-white">
                            <p className="font-semibold">血統證書 {index + 1}</p>
                            <p className="text-sm opacity-90">點擊查看大圖</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => window.open(doc, '_blank')}
                          className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 健康證明文件卡片 */}
              {puppy.health_certificates && puppy.health_certificates.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">健康證明</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {puppy.health_certificates.map((cert, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg bg-green-50 hover:shadow-xl transition-all duration-300">
                        <img
                          src={cert}
                          alt={`健康證明 ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 text-white">
                            <p className="font-semibold">健康證明 {index + 1}</p>
                            <p className="text-sm opacity-90">點擊查看大圖</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => window.open(cert, '_blank')}
                          className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                        >
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 