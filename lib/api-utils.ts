import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'

// API 回應格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
}

// 成功回應
export function apiSuccess<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message: message || '操作成功'
  })
}

// 錯誤回應
export function apiError(error: string, code?: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error,
    code
  }, { status })
}

// 驗證用戶身份
export async function validateAuth(request: NextRequest): Promise<{ user: any; token?: string; error?: string }> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: '未提供驗證 token' }
    }

    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return { user: null, error: '無效的驗證 token' }
    }

    return { user, token }
  } catch (error) {
    return { user: null, error: '驗證失敗' }
  }
}

// 解析查詢參數
export function parseQueryParams(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: Math.min(parseInt(searchParams.get('limit') || '10', 10), 100),
    sort: searchParams.get('sort') || 'created_at',
    order: (searchParams.get('order') || 'desc') as 'asc' | 'desc',
    search: searchParams.get('search'),
    published: searchParams.get('published'),
    status: searchParams.get('status'),
    type: searchParams.get('type'),
    breed: searchParams.get('breed'),
    gender: searchParams.get('gender'),
    author_id: searchParams.get('author_id')
  }
}

// 計算分頁偏移量
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit
}

// HTTP 方法檢查器
export function methodNotAllowed(allowedMethods: string[]): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
    code: 'METHOD_NOT_ALLOWED'
  }, { status: 405 })
}

// 請求體驗證
export async function validateRequestBody(request: NextRequest, requiredFields: string[]) {
  try {
    const body = await request.json()
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        error: `缺少必要欄位: ${missingFields.join(', ')}`,
        body: null
      }
    }

    return { isValid: true, body, error: null }
  } catch (error) {
    return {
      isValid: false,
      error: '無效的 JSON 格式',
      body: null
    }
  }
}

// Supabase 錯誤處理
export function handleSupabaseError(error: any): NextResponse<ApiResponse> {
  console.error('Supabase error:', error)
  
  if (error.code === 'PGRST116') {
    return apiError('資源不存在', 'NOT_FOUND', 404)
  }
  
  if (error.code === '23505') {
    return apiError('資源已存在', 'DUPLICATE_RESOURCE', 409)
  }
  
  return apiError(error.message || '資料庫操作失敗', 'DATABASE_ERROR', 500)
} 