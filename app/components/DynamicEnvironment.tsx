'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Environment, 
  EnvironmentType, 
  ENVIRONMENT_TYPE_LABELS, 
  ENVIRONMENT_TYPE_COLORS,
  ENVIRONMENT_TYPE_ICONS
} from '../../lib/types/environment'
import { FadeIn, FadeUp } from './MotionWrapper'

// Carousel 組件
interface CarouselProps {
  images: string[]
  environmentName: string
}

function ImageCarousel({ images, environmentName }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* 主圖 */}
      <div className="relative overflow-clip rounded-xl shadow-lg">
        <Image
          src={images[currentIndex]}
          alt={`${environmentName} - 圖片 ${currentIndex + 1}`}
          width={1920}
          height={1080}
          className="w-full aspect-video object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-image.jpg'
          }}
        />
        
        {/* 左右控制按鈕 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="上一張圖片"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="下一張圖片"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 指示器 */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`圖片 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Loading Skeleton
function EnvironmentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
      </div>
      <div className="aspect-video bg-gray-300 rounded-xl mb-8"></div>
      <div className="bg-white rounded-xl p-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 主要組件
const DynamicEnvironment = () => {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<EnvironmentType | 'all'>('all')

  // 獲取環境數據
  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/environments')
        if (!response.ok) {
          throw new Error('Failed to fetch environments')
        }
        
        const result = await response.json()
        if (result.success) {
          setEnvironments(result.data.environments || [])
        } else {
          throw new Error(result.error || '獲取環境資料失敗')
        }
      } catch (err) {
        console.error('Error fetching environments:', err)
        setError(err instanceof Error ? err.message : '載入環境資料時發生錯誤')
      } finally {
        setLoading(false)
      }
    }

    fetchEnvironments()
  }, [])

  // 獲取可用的環境類型
  const availableTypes = Array.from(new Set(environments.map(env => env.type)))

  // 篩選環境
  const filteredEnvironments = selectedType === 'all' 
    ? environments 
    : environments.filter(env => env.type === selectedType)

  // 合併所有照片（封面 + 一般照片 + 設備照片 + 細節照片）
  const getAllImages = (environment: Environment): string[] => {
    const images: string[] = []
    
    if (environment.cover_image) {
      images.push(environment.cover_image)
    }
    
    if (environment.images) {
      images.push(...environment.images)
    }
    
    if (environment.equipment_images) {
      images.push(...environment.equipment_images)
    }
    
    if (environment.detail_images) {
      images.push(...environment.detail_images)
    }
    
    return images
  }

  if (loading) {
    return (
      <section className="relative py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-300 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-128 mx-auto animate-pulse"></div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-20">
              <EnvironmentSkeleton />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-800 mb-2">載入失敗</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                重新載入
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (environments.length === 0) {
    return (
      <section className="relative py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-4 0H3m2-14h14M3 7h18M9 11h6" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">暫無環境資料</h3>
              <p className="text-gray-600">目前還沒有環境設施資料，請稍後再來查看。</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-0 bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-earth-200/5 to-earth-300/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              {/* 標題上方的裝飾線 */}
              <div className="flex items-center justify-center mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-earth-400 to-transparent w-24"></div>
                <div className="mx-4 w-2 h-2 bg-earth-400 rounded-full"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-earth-400 to-transparent w-24"></div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-earth-900 mb-6 tracking-tight">
                環境
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-earth-600 to-earth-700">
                  介紹
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-earth-800/80 leading-relaxed mb-8">
                為蘇格蘭㹴提供最專業、最舒適的生活與訓練環境
              </p>
              
              {/* 統計信息 */}
              <div className="flex items-center justify-center space-x-8 text-earth-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-earth-800">{environments.length || '多種'}</div>
                  <div className="text-sm">環境設施</div>
                </div>
                <div className="w-px h-12 bg-earth-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-earth-800">100%</div>
                  <div className="text-sm">安全保障</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 類型篩選 */}
        <FadeIn delay={0.3} className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedType === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-earth-700 hover:bg-earth-100 shadow'
            }`}
          >
            全部環境
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                selectedType === type
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-earth-700 hover:bg-earth-100 shadow'
              }`}
            >
              <span className="text-lg">{ENVIRONMENT_TYPE_ICONS[type]}</span>
              <span>{ENVIRONMENT_TYPE_LABELS[type]}</span>
            </button>
          ))}
        </FadeIn>

        {/* 環境區域展示 */}
        <div className="space-y-20">
          {filteredEnvironments.map((environment, index) => {
            const allImages = getAllImages(environment)
            
            return (
              <div key={environment.id} className={`${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* 區域標題和描述 */}
                <FadeIn className="text-center mb-12">
                  <div className="flex items-center justify-center mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-3 ${ENVIRONMENT_TYPE_COLORS[environment.type]}`}>
                      <span className="mr-1">{ENVIRONMENT_TYPE_ICONS[environment.type]}</span>
                      {ENVIRONMENT_TYPE_LABELS[environment.type]}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-earth-900 mb-4">{environment.name}</h3>
                  {environment.description && (
                    <p className="text-lg text-earth-700 max-w-3xl mx-auto">{environment.description}</p>
                  )}
                </FadeIn>

                {/* 圖片輪播 */}
                <FadeIn delay={0.1} className="mb-8">
                  <ImageCarousel images={allImages} environmentName={environment.name} />
                </FadeIn>

                {/* 特色功能 */}
                {environment.features && environment.features.length > 0 && (
                  <FadeIn delay={0.3} className="bg-white rounded-xl p-8 shadow-lg">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {environment.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <svg className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-earth-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                )}
              </div>
            )
          })}
        </div>

        {/* 底部總結 */}
        <FadeIn className="bg-primary-600 rounded-2xl p-8 text-center text-white mt-20">
          <h3 className="text-3xl font-bold mb-4">專業認證的犬舍環境</h3>
          <p className="text-xl mb-6">
            我們致力於為每隻蘇格蘭㹴提供最優質的生活環境，從專業訓練到舒適住宿，每個細節都體現我們的專業與用心
          </p>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">全天候監護</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">專業</div>
              <div className="text-primary-100">認證設備</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-primary-100">安全保障</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">用心</div>
              <div className="text-primary-100">專業服務</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default DynamicEnvironment 