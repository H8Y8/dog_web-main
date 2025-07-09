import { NextRequest } from 'next/server'
import { supabase, createAuthenticatedSupabaseClient } from '@/lib/supabase'
import { 
  apiSuccess, 
  apiError, 
  validateAuth, 
  methodNotAllowed,
  validateRequestBody,
  handleSupabaseError
} from '@/lib/api-utils'

// GET /api/posts/[id] - 獲取單篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 檢查是否有認證token，如果有則使用認證客戶端
    let queryClient = supabase
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      queryClient = createAuthenticatedSupabaseClient(token)
    }

    const { data, error } = await queryClient
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('文章不存在', 'POST_NOT_FOUND', 404)
      }
      return handleSupabaseError(error)
    }

    return apiSuccess(data)

  } catch (error) {
    console.error('GET /api/posts/[id] error:', error)
    return apiError('獲取文章失敗', 'FETCH_POST_ERROR', 500)
  }
}

// PUT /api/posts/[id] - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建帶有用戶認證上下文的Supabase客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 先檢查文章是否存在且用戶有權限
    const { data: existingPost, error: fetchError } = await authenticatedSupabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return apiError('文章不存在', 'POST_NOT_FOUND', 404)
      }
      return handleSupabaseError(fetchError)
    }

    if (existingPost.author_id !== user.id) {
      return apiError('您沒有權限修改此文章', 'FORBIDDEN', 403)
    }

    // 驗證請求體
    const { isValid, body, error: validationError } = await validateRequestBody(request, [])
    
    if (!isValid) {
      return apiError(validationError!, 'VALIDATION_ERROR', 400)
    }

    // 準備更新資料
    const updateData: any = {}
    if (body.title) updateData.title = body.title.trim()
    if (body.content) updateData.content = body.content
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt?.trim()
    if (body.cover_image !== undefined) updateData.cover_image = body.cover_image
    if (body.published !== undefined) updateData.published = body.published

    // 使用認證客戶端更新文章
    const { data, error } = await authenticatedSupabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess(data, '文章更新成功')

  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error)
    return apiError('更新文章失敗', 'UPDATE_POST_ERROR', 500)
  }
}

// DELETE /api/posts/[id] - 刪除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建帶有用戶認證上下文的Supabase客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 先檢查文章是否存在且用戶有權限
    const { data: existingPost, error: fetchError } = await authenticatedSupabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return apiError('文章不存在', 'POST_NOT_FOUND', 404)
      }
      return handleSupabaseError(fetchError)
    }

    if (existingPost.author_id !== user.id) {
      return apiError('您沒有權限刪除此文章', 'FORBIDDEN', 403)
    }

    // 使用認證客戶端刪除文章
    const { error } = await authenticatedSupabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess({ deleted: true }, '文章刪除成功')

  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error)
    return apiError('刪除文章失敗', 'DELETE_POST_ERROR', 500)
  }
}

// 處理不支援的 HTTP 方法
export async function POST() {
  return methodNotAllowed(['GET', 'PUT', 'DELETE'])
}

export async function PATCH() {
  return methodNotAllowed(['GET', 'PUT', 'DELETE'])
} 