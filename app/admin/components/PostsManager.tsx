'use client'

import React, { useState, useEffect } from 'react'
import { Post } from '../../../lib/types'
import { Button } from '../../../lib/ui/Button'
import { cn } from '../../../lib/ui/utils'
import { useAuth } from '../../../lib/hooks/useAuth'
import { supabase } from '../../../lib/supabase'

interface PostsManagerProps {
  user: any
  session: any
}

export default function PostsManager({ user, session }: PostsManagerProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // 獲取文章列表
  const fetchPosts = async (page: number = 1) => {
    try {
      setLoading(true)
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      // 添加認證頭
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/posts?page=${page}&limit=${pagination.limit}`, {
        headers
      })
      
      if (!response.ok) {
        throw new Error('獲取文章失敗')
      }
      
      const data = await response.json()
      setPosts(data.data.posts)
      setPagination(data.data.pagination)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取文章失敗')
    } finally {
      setLoading(false)
    }
  }

  // 刪除文章
  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這篇文章嗎？')) return

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      // 添加認證頭
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '刪除文章失敗')
      }

      await fetchPosts(pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除文章失敗')
    }
  }

  // 切換發布狀態
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      // 添加認證頭
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ published: !currentStatus })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新發布狀態失敗')
      }

      await fetchPosts(pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新發布狀態失敗')
    }
  }

  // 處理編輯
  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setCurrentView('edit')
  }

  // 處理新增
  const handleCreate = () => {
    setEditingPost(null)
    setCurrentView('create')
  }

  // 返回列表
  const backToList = () => {
    setCurrentView('list')
    setEditingPost(null)
    fetchPosts(pagination.page)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (currentView === 'create' || currentView === 'edit') {
    return (
      <PostEditor
        post={editingPost}
        onSave={backToList}
        onCancel={backToList}
        user={user}
        session={session}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">文章管理</h2>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          新增文章
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <PostsList
        posts={posts}
        loading={loading}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        onPageChange={fetchPosts}
      />
    </div>
  )
}

interface PostsListProps {
  posts: Post[]
  loading: boolean
  pagination: any
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
  onTogglePublish: (id: string, currentStatus: boolean) => void
  onPageChange: (page: number) => void
}

function PostsList({ posts, loading, pagination, onEdit, onDelete, onTogglePublish, onPageChange }: PostsListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">沒有文章</h3>
          <p className="mt-1 text-sm text-gray-500">開始建立您的第一篇文章</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                標題
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建立時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                更新時間
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  {post.excerpt && (
                    <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                      {post.excerpt}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    post.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  )}>
                    {post.published ? '已發布' : '草稿'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('zh-TW')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.updated_at).toLocaleDateString('zh-TW')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onTogglePublish(post.id, post.published)}
                    className={cn(
                      "mr-2",
                      post.published 
                        ? "text-yellow-600 hover:text-yellow-900" 
                        : "text-green-600 hover:text-green-900"
                    )}
                  >
                    {post.published ? '取消發布' : '發布'}
                  </button>
                  <button
                    onClick={() => onEdit(post)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                上一頁
              </button>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                下一頁
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  顯示 <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> 到{' '}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> 共{' '}
                  <span className="font-medium">{pagination.total}</span> 筆結果
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    上一頁
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={cn(
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        page === pagination.page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    下一頁
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface PostEditorProps {
  post: Post | null
  onSave: () => void
  onCancel: () => void
  user: any
  session: any
}

function PostEditor({ post, onSave, onCancel, user, session }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    cover_image: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        published: post.published,
        cover_image: post.cover_image || ''
      })
      setImagePreview(post.cover_image || null)
    }
  }, [post])

  // 處理圖片文件選擇
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 檢查文件類型
    if (!file.type.startsWith('image/')) {
      setError('請選擇圖片文件')
      return
    }

    // 檢查文件大小 (5MB限制)
    if (file.size > 5 * 1024 * 1024) {
      setError('圖片文件大小不能超過5MB')
      return
    }

    setImageFile(file)
    setError(null)

    // 創建預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // 上傳圖片到Supabase
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `posts/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('diary-images')
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(`圖片上傳失敗: ${uploadError.message}`)
    }

    const { data } = supabase.storage
      .from('diary-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // 移除圖片
  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, cover_image: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let coverImageUrl = formData.cover_image

      // 如果有新的圖片文件需要上傳
      if (imageFile) {
        setUploading(true)
        coverImageUrl = await uploadImage(imageFile)
      }

      const dataToSend = {
        ...formData,
        cover_image: coverImageUrl
      }

      const url = post ? `/api/posts/${post.id}` : '/api/posts'
      const method = post ? 'PUT' : 'POST'

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      // 添加認證頭
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || '保存失敗')
      }

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失敗')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {post ? '編輯文章' : '新增文章'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            標題 *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 封面圖片上傳 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            封面圖片
          </label>
          
          {/* 圖片預覽 */}
          {imagePreview && (
            <div className="mb-4 relative inline-block">
              <img
                src={imagePreview}
                alt="封面圖片預覽"
                className="w-full max-w-md h-auto object-contain rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="移除圖片"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* 圖片上傳輸入 */}
          <div className="mt-2">
            <label htmlFor="cover_image" className="cursor-pointer">
              <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {imageFile ? '更換圖片' : '點擊上傳圖片'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    支援 JPG, PNG, GIF (最大 5MB)
                  </span>
                </div>
              </div>
            </label>
            <input
              type="file"
              id="cover_image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            摘要
          </label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            內容 *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
            立即發布
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? '上傳圖片中...' : loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
} 