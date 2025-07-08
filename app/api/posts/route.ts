import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
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
    const { page, limit, sort, order, published, author_id } = parseQueryParams(request)
    const offset = calculateOffset(page, limit)

    // 建立查詢
    let query = supabase
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
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

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

    // 插入到資料庫
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single()

    if (error) {
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