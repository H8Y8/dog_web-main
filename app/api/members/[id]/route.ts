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

// GET /api/members/[id] - 獲取單個成員
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('成員不存在', 'MEMBER_NOT_FOUND', 404)
      }
      return handleSupabaseError(error)
    }

    return apiSuccess(data)

  } catch (error) {
    console.error('GET /api/members/[id] error:', error)
    return apiError('獲取成員失敗', 'FETCH_MEMBER_ERROR', 500)
  }
}

// PUT /api/members/[id] - 更新成員
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

    // 驗證請求體
    const { isValid, body, error: validationError } = await validateRequestBody(request, [])
    
    if (!isValid) {
      return apiError(validationError!, 'VALIDATION_ERROR', 400)
    }

    // 準備更新資料
    const updateData: any = {}
    if (body.name) updateData.name = body.name.trim()
    if (body.role) updateData.role = body.role.trim()
    if (body.bio !== undefined) updateData.bio = body.bio?.trim()
    if (body.avatar_url !== undefined) updateData.avatar_url = body.avatar_url
    if (body.email !== undefined) updateData.email = body.email?.trim()

    // 使用認證的客戶端更新成員
    const { data, error } = await authenticatedSupabase
      .from('members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return handleSupabaseError(error)
    }

    if (!data) {
      return apiError('成員不存在', 'MEMBER_NOT_FOUND', 404)
    }

    return apiSuccess(data, '成員更新成功')

  } catch (error) {
    console.error('PUT /api/members/[id] error:', error)
    return apiError('更新成員失敗', 'UPDATE_MEMBER_ERROR', 500)
  }
}

// DELETE /api/members/[id] - 刪除成員
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

    // 使用認證的客戶端刪除成員
    const { data, error } = await authenticatedSupabase
      .from('members')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Delete error:', error)
      return handleSupabaseError(error)
    }

    if (!data) {
      return apiError('成員不存在', 'MEMBER_NOT_FOUND', 404)
    }

    return apiSuccess(data, '成員刪除成功')

  } catch (error) {
    console.error('DELETE /api/members/[id] error:', error)
    return apiError('刪除成員失敗', 'DELETE_MEMBER_ERROR', 500)
  }
}

// 處理不支援的 HTTP 方法
export async function POST() {
  return methodNotAllowed(['GET', 'PUT', 'DELETE'])
}

export async function PATCH() {
  return methodNotAllowed(['GET', 'PUT', 'DELETE'])
} 