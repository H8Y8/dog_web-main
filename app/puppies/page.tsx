'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Puppy, PuppyStatus, PuppyBreed } from '../../lib/types/puppy'
import { cn } from '../../lib/ui/utils'
import { FadeIn, FadeUp } from '../components/MotionWrapper'

export default function PuppiesPage() {
  const [puppies, setPuppies] = useState<Puppy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  // 獲取幼犬列表
  const fetchPuppies = useCallback(async (page: number = 1, status?: string) => {
    try {
      setLoading(page === 1)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sort: 'created_at',
        order: 'desc'
      })
      
      if (status && status !== 'all') {
        params.append('status', status)
      }
      
      const response = await fetch(`/api/puppies?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 獲取幼犬資料失敗`)
      }
      
      const data = await response.json()
      
      // 解構API響應中的data字段
      const { puppies = [], pagination: paginationData } = data.data || {}
      
      if (page === 1) {
        setPuppies(puppies)
      } else {
        setPuppies(prev => [...prev, ...puppies])
      }
      
      setPagination(paginationData || { page: 1, limit: 12, total: 0, totalPages: 0 })
      setError(null)
    } catch (err) {
      console.error('Error fetching puppies:', err)
      setError(err instanceof Error ? err.message : '獲取幼犬資料失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }, [pagination.limit])

  // 載入頁面時獲取幼犬
  useEffect(() => {
    fetchPuppies(1, activeFilter)
  }, [activeFilter])

  // 載入更多幼犬
  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !loading) {
      fetchPuppies(pagination.page + 1, activeFilter)
    }
  }

  // 處理篩選
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setPuppies([])
  }

  // 格式化年齡
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - birth.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)

    if (diffDays < 30) return `${diffWeeks} 週`
    if (diffDays < 365) return `${diffMonths} 個月`
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
      [PuppyStatus.AVAILABLE]: { text: '可預約', class: 'bg-green-100 text-green-800' },
      [PuppyStatus.RESERVED]: { text: '已預訂', class: 'bg-yellow-100 text-yellow-800' },
      [PuppyStatus.SOLD]: { text: '已售出', class: 'bg-gray-100 text-gray-800' },
      [PuppyStatus.NOT_FOR_SALE]: { text: '非賣品', class: 'bg-blue-100 text-blue-800' }
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

  const filters = [
    { id: 'all', label: '全部', count: pagination.total },
    { id: 'available', label: '可預約', count: 0 },
    { id: 'reserved', label: '已預訂', count: 0 },
    { id: 'sold', label: '已售出', count: 0 }
  ]

  return (
    <div className="min-h-screen bg-earth-50">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-clip pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-earth-200/20 to-earth-300/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-earth-200/20 to-earth-300/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-clip">
        <div className="absolute inset-0 bg-gradient-to-r from-earth-200/5 to-earth-300/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* 標題上方的裝飾線 */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24"></div>
              <div className="mx-4 w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-6 tracking-tight">
              新生
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                幼犬
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-amber-800/80 leading-relaxed mb-8">
              純種蘇格蘭㹴幼犬，健康活潑，等待溫暖的家庭
            </p>
            
            {/* 統計信息 */}
            <div className="flex items-center justify-center space-x-8 text-amber-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-800">{pagination.total}</div>
                <div className="text-sm">隻幼犬</div>
              </div>
              <div className="w-px h-12 bg-amber-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-800">100%</div>
                <div className="text-sm">健康保證</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 篩選區域 */}
      <section className="relative pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-amber-100 p-6 mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={cn(
                    "px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-sm",
                    activeFilter === filter.id
                      ? "bg-amber-500 text-white shadow-lg scale-105"
                      : "bg-white text-amber-700 hover:bg-amber-50 hover:shadow-md"
                  )}
                >
                  {filter.label}
                  {filter.id === 'all' && pagination.total > 0 && (
                    <span className="ml-2 text-sm opacity-75">({pagination.total})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 主要內容區域 */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 錯誤狀態 */}
          {error && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-red-100 p-8 mb-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">載入失敗</h3>
              <p className="text-amber-700 mb-6">{error}</p>
              <button
                onClick={() => fetchPuppies(1, activeFilter)}
                className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                重新載入
              </button>
            </div>
          )}

          {/* 載入狀態 */}
          {loading && puppies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-400 rounded-full animate-spin" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-amber-700 font-medium">載入可愛幼犬中...</p>
            </div>
          )}

          {/* 空狀態 */}
          {!loading && puppies.length === 0 && !error && (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                {activeFilter === 'all' ? '目前還沒有幼犬' : '沒有符合條件的幼犬'}
              </h3>
              <p className="text-amber-700">請稍後再來看看，或聯繫我們了解更多資訊</p>
            </div>
          )}

          {/* 幼犬網格 */}
          {puppies.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {puppies.map((puppy, index) => (
                  <FadeIn 
                    key={puppy.id}
                    delay={index * 0.1}
                    duration={0.6}
                  >
                    <PuppyCard 
                      puppy={puppy} 
                      index={index}
                      calculateAge={calculateAge}
                      formatPrice={formatPrice}
                      getStatusDisplay={getStatusDisplay}
                      getBreedDisplay={getBreedDisplay}
                    />
                  </FadeIn>
                ))}
              </div>

              {/* 載入更多按鈕 */}
              {pagination.page < pagination.totalPages && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className={cn(
                      "px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg",
                      loading
                        ? "bg-amber-200 text-amber-500 cursor-not-allowed"
                        : "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-xl transform hover:scale-105"
                    )}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>載入中...</span>
                      </div>
                    ) : (
                      `載入更多 (${pagination.page}/${pagination.totalPages})`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

// 幼犬卡片組件
interface PuppyCardProps {
  puppy: Puppy
  index: number
  calculateAge: (birthDate: string) => string
  formatPrice: (price?: number, currency?: string) => string
  getStatusDisplay: (status: PuppyStatus) => { text: string; class: string }
  getBreedDisplay: (breed: PuppyBreed) => string
}

function PuppyCard({ 
  puppy, 
  index, 
  calculateAge, 
  formatPrice, 
  getStatusDisplay, 
  getBreedDisplay 
}: PuppyCardProps) {
  const status = getStatusDisplay(puppy.status)
  
  return (
    <Link href={`/puppies/${puppy.id}`}>
      <div 
        className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 card-motion border border-amber-100/50 transform hover:scale-105 cursor-pointer"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* 圖片區域 */}
        <div className="relative aspect-square overflow-clip">
          {/* 優先顯示主要照片 (cover_image)，然後才是相簿照片 */}
          {puppy.cover_image ? (
            <img
              src={puppy.cover_image}
              alt={puppy.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : puppy.images && puppy.images.length > 0 ? (
            <img
              src={puppy.images[0]}
              alt={puppy.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          )}
          
          {/* 狀態標籤 */}
          <div className="absolute top-4 left-4">
            <span className={cn("px-3 py-1 rounded-full text-xs font-medium shadow-lg", status.class)}>
              {status.text}
            </span>
          </div>
          
          {/* 愛心圖標 */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* 內容區域 */}
        <div className="p-6">
          {/* 名稱和年齡 */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-1">
              {puppy.name}
            </h3>
            <span className="text-sm text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-lg">
              {calculateAge(puppy.birth_date)}
            </span>
          </div>

          {/* 品種和性別 */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-amber-700 font-medium">{getBreedDisplay(puppy.breed)}</span>
            <span className="text-amber-500">•</span>
            <span className="text-amber-600">{puppy.gender === 'male' ? '公' : '母'}</span>
          </div>

          {/* 描述 */}
          {puppy.description && (
            <p className="text-amber-700 text-sm line-clamp-2 mb-4 leading-relaxed">
              {puppy.description}
            </p>
          )}

          {/* 價格 */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-amber-900">
              {formatPrice(puppy.price, puppy.currency)}
            </span>
            <div className="text-amber-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 