'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Post } from '../../../lib/types'
import { cn } from '../../../lib/ui/utils'

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 獲取文章詳細資訊
  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('文章不存在')
        }
        throw new Error(`HTTP ${response.status}: 載入文章失敗`)
      }
      
      const data = await response.json()
      
      // 檢查文章是否已發布
      if (!data.data.published) {
        throw new Error('文章尚未發布')
      }
      
      setPost(data.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching post:', err)
      setError(err instanceof Error ? err.message : '載入文章失敗')
    } finally {
      setLoading(false)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  // 格式化內容（將 Markdown 轉換為基本 HTML）
  const formatContent = (content: string) => {
    if (!content) return ''
    
    // 基本的 Markdown 處理
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-earth-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-earth-900 mt-10 mb-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-earth-900 mt-12 mb-8">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-earth-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="text-earth-700 leading-relaxed mb-4">')
      .replace(/^\n/, '<p class="text-earth-700 leading-relaxed mb-4">')
      .replace(/\n$/, '</p>')
  }

  // 返回文章列表
  const handleBackToList = () => {
    router.push('/diary')
  }

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])


  return (
    <div className="pt-32 min-h-screen bg-earth-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按鈕 */}
        <div className="mb-8">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center text-amber-600 hover:text-amber-800 focus:text-amber-800 font-medium focus:outline-none focus:underline transition-colors"
            aria-label="返回文章列表"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回文章列表
          </button>
        </div>

        {/* 載入狀態 */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-earth-600">載入文章中...</p>
          </div>
        )}

        {/* 錯誤狀態 */}
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-red-800">載入失敗</h2>
            </div>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="flex justify-center">
              <button
                onClick={fetchPost}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                重試
              </button>
            </div>
          </div>
        )}

        {/* 文章內容 */}
        {post && !loading && !error && (
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* 文章封面 */}
            {post.cover_image && (
              <div className="relative flex justify-center items-center p-4" style={{ backgroundColor: 'rgb(252, 249, 245)' }}>
                <img
                  src={post.cover_image}
                  alt={`${post.title} 的封面圖片`}
                  className="max-w-2xl w-full h-auto object-contain rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            )}

            {/* 文章資訊 */}
            <div className="p-6 sm:p-8 lg:p-12">
              {/* 文章標題 */}
              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-earth-900 leading-tight mb-4">
                  {post.title}
                </h1>
                
                {/* 文章元資訊 */}
                <div className="flex flex-wrap items-center gap-4 text-earth-600 border-b border-earth-200 pb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={post.created_at}>
                      {formatDate(post.created_at)}
                    </time>
                  </div>
                </div>
              </header>

              {/* 文章摘要 */}
              {post.excerpt && (
                <div className="mb-8 p-4 bg-earth-50 rounded-lg border-l-4 border-primary-500">
                  <p className="text-lg text-earth-800 italic leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* 文章內容 */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-earth-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: formatContent(post.content) 
                  }}
                />
              </div>

              {/* 文章底部 */}
              <footer className="mt-12 pt-8 border-t border-earth-200">
                <div className="text-center text-sm text-earth-600">
                  <p>感謝您的閱讀！歡迎分享您的想法和經驗。</p>
                </div>
              </footer>
            </div>
          </article>
        )}
      </div>
    </div>
  )
} 