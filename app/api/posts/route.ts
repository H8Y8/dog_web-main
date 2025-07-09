import { NextRequest } from 'next/server'
import { supabase, createAuthenticatedSupabaseClient } from '@/lib/supabase'
import { 
  apiSuccess, 
  apiError, 
  validateAuth, 
  parseQueryParams, 
  calculateOffset,
  methodNotAllowed,
  validateRequestBody,
  handleSupabaseError
} from '@/lib/api-utils'

// GET /api/posts - 獲取所有文章
export async function GET(request: NextRequest) {
  try {
    const { page, limit, sort, order, search, published, author_id } = parseQueryParams(request)
    const searchParams = new URL(request.url).searchParams
    const countOnly = searchParams.get('count') === 'true'

    // 檢查是否有認證token，如果有則使用認證客戶端
    let queryClient = supabase
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      queryClient = createAuthenticatedSupabaseClient(token)
    }

    // 如果只需要數量，直接返回總數
    if (countOnly) {
      let countQuery = queryClient
        .from('posts')
        .select('*', { count: 'exact', head: true })

      // 添加篩選條件
      if (published !== null) {
        countQuery = countQuery.eq('published', published === 'true')
      }

      if (author_id) {
        countQuery = countQuery.eq('author_id', author_id)
      }

      // 添加搜尋功能
      if (search && search.trim()) {
        const searchTerm = search.trim()
        countQuery = countQuery.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      }

      const { count, error } = await countQuery

      if (error) {
        return handleSupabaseError(error)
      }

      return apiSuccess({
        total: count || 0
      })
    }

    const offset = calculateOffset(page, limit)

    // 建立查詢
    let query = queryClient
      .from('posts')
      .select('*', { count: 'exact' })
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    // 添加篩選條件
    if (published !== null) {
      query = query.eq('published', published === 'true')
    }

    if (author_id) {
      query = query.eq('author_id', author_id)
    }

    // 添加搜尋功能
    if (search && search.trim()) {
      const searchTerm = search.trim()
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
    }

    const { data, error, count } = await query

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess({
      posts: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('GET /api/posts error:', error)
    return apiError('獲取文章失敗', 'FETCH_POSTS_ERROR', 500)
  }
}

// POST /api/posts - 創建新文章
export async function POST(request: NextRequest) {
  try {
    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建帶有用戶認證上下文的Supabase客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 驗證請求體
    const requiredFields = ['title', 'content']
    const { isValid, body, error: validationError } = await validateRequestBody(request, requiredFields)
    
    if (!isValid) {
      return apiError(validationError!, 'VALIDATION_ERROR', 400)
    }

    // 準備文章資料
    const postData = {
      title: body.title.trim(),
      content: body.content,
      excerpt: body.excerpt?.trim(),
      cover_image: body.cover_image,
      published: body.published || false,
      author_id: user.id
    }

    // 使用認證的客戶端插入到資料庫
    const { data, error } = await authenticatedSupabase
      .from('posts')
      .insert([postData])
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return handleSupabaseError(error)
    }

    return apiSuccess(data, '文章創建成功')

  } catch (error) {
    console.error('POST /api/posts error:', error)
    return apiError('創建文章失敗', 'CREATE_POST_ERROR', 500)
  }
}

// 處理不支援的 HTTP 方法
export async function PUT() {
  return methodNotAllowed(['GET', 'POST'])
}

export async function DELETE() {
  return methodNotAllowed(['GET', 'POST'])
}

export async function PATCH() {
  return methodNotAllowed(['GET', 'POST'])
} 