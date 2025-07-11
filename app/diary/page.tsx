'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Post } from '../../lib/types'
import { cn } from '../../lib/ui/utils'

export default function DiaryPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  })

  // 獲取文章列表
  const fetchPosts = useCallback(async (page: number = 1) => {
    try {
      setLoading(page === 1)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        published: 'true',
        sort: 'created_at',
        order: 'desc'
      })
      
      const response = await fetch(`/api/posts?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 獲取文章失敗`)
      }
      
      const data = await response.json()
      
      if (page === 1) {
        setPosts(data.data.posts)
      } else {
        setPosts(prev => [...prev, ...data.data.posts])
      }
      
      setPagination(data.data.pagination)
      setError(null)
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err instanceof Error ? err.message : '獲取文章失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }, [pagination.limit])

  // 載入頁面時獲取文章
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 載入更多文章
  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !loading) {
      fetchPosts(pagination.page + 1)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return '剛剛'
    if (diffHours < 24) return `${diffHours} 小時前`
    if (diffDays === 1) return '昨天'
    if (diffDays <= 7) return `${diffDays} 天前`
    
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 提取摘要
  const getExcerpt = (content: string, maxLength: number = 120) => {
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText
  }

  return (
    <div className="min-h-screen bg-earth-50">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-earth-200/20 to-earth-300/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-earth-200/20 to-earth-300/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
              生活
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">
                日誌
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-amber-800/80 leading-relaxed mb-8">
              與蘇格蘭㹴共度的美好時光，每一個溫馨瞬間都值得珍藏
            </p>
            
            {/* 統計信息 */}
            <div className="flex items-center justify-center space-x-8 text-amber-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-800">{pagination.total}</div>
                <div className="text-sm">篇文章</div>
              </div>
              <div className="w-px h-12 bg-amber-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-800">∞</div>
                <div className="text-sm">美好回憶</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
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
                onClick={() => fetchPosts(1)}
                className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                重新載入
              </button>
            </div>
          )}

          {/* 載入狀態 */}
          {loading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-amber-700 font-medium">載入精彩內容中...</p>
            </div>
          )}

          {/* 空狀態 */}
          {!loading && posts.length === 0 && !error && (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">目前還沒有日誌</h3>
              <p className="text-amber-700">精彩內容即將上線，請耐心等候</p>
            </div>
          )}

          {/* 文章網格 */}
          {posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    index={index}
                    formatDate={formatDate}
                    getExcerpt={getExcerpt}
                  />
                ))}
              </div>

              {/* 載入更多按鈕 */}
              {pagination.page < pagination.totalPages && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="group inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-amber-200 rounded-3xl hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 font-medium text-amber-800 hover:text-amber-900 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin mr-3"></div>
                        載入中...
                      </>
                    ) : (
                      <>
                        載入更多文章
                        <svg className="w-5 h-5 ml-2 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </>
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

interface PostCardProps {
  post: Post
  index: number
  formatDate: (dateString: string) => string
  getExcerpt: (content: string, maxLength?: number) => string
}

function PostCard({ post, index, formatDate, getExcerpt }: PostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={`/diary/${post.id}`} className="block">
      <article 
        className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-200 hover:-translate-y-2 hover:bg-white/90 cursor-pointer"
        style={{
          animationDelay: `${index * 100}ms`,
          animation: 'fadeInUp 0.6s ease-out forwards'
        }}
      >
      {/* 文章圖片 */}
      {post.cover_image && !imageError && (
        <div className="relative h-48 bg-gradient-to-br from-amber-100 to-yellow-100 overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
            </div>
          )}
          {/* 日期標籤 */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 text-sm font-medium text-amber-800 shadow-lg">
            {formatDate(post.created_at)}
          </div>
          {/* 漸變覆蓋層 */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      {/* 文章內容 */}
      <div className="p-6">
        {/* 如果沒有圖片，顯示日期 */}
        {(!post.cover_image || imageError) && (
          <div className="flex items-center text-sm text-amber-600 mb-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.created_at)}
          </div>
        )}

        <h2 className="text-xl font-bold text-amber-900 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-amber-800/80 leading-relaxed line-clamp-3 mb-6">
            {post.excerpt}
          </p>
        )}

        {!post.excerpt && post.content && (
          <p className="text-amber-800/80 leading-relaxed line-clamp-3 mb-6">
            {getExcerpt(post.content)}
          </p>
        )}

        <div className="flex items-center justify-end pt-4 border-t border-amber-100">
          <span className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors">
            查看更多
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
    </Link>
  )
}

// CSS 動畫樣式
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

// 在組件中添加樣式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  if (!document.head.querySelector('style[data-diary-styles]')) {
    styleElement.setAttribute('data-diary-styles', 'true')
    document.head.appendChild(styleElement)
  }
} 