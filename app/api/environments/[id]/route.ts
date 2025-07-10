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

// GET /api/environments/[id] - 獲取單個環境設施
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return apiError('環境設施ID為必填', 'MISSING_ID', 400)
    }

    const { data, error } = await supabase
      .from('environments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('環境設施不存在', 'ENVIRONMENT_NOT_FOUND', 404)
      }
      return handleSupabaseError(error)
    }

    // 確保數組字段的格式正確
    const formattedData = {
      ...data,
      images: data.images || [],
      features: data.features || []
    }

    return apiSuccess(formattedData)

  } catch (error) {
    console.error('GET /api/environments/[id] error:', error)
    return apiError('獲取環境設施失敗', 'FETCH_ENVIRONMENT_ERROR', 500)
  }
}

// PUT /api/environments/[id] - 更新環境設施
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return apiError('環境設施ID為必填', 'MISSING_ID', 400)
    }

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

    if (body.name) {
      updateData.name = body.name.trim()
    }

    if (body.type) {
      const validTypes = ['accommodation', 'classroom', 'playground', 'transport', 'other']
      if (!validTypes.includes(body.type)) {
        return apiError('無效的環境類型', 'INVALID_TYPE', 400)
      }
      updateData.type = body.type
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null
    }

    if (body.images !== undefined) {
      updateData.images = body.images || []
    }

    if (body.features !== undefined) {
      updateData.features = body.features || []
    }

    // 如果沒有要更新的資料
    if (Object.keys(updateData).length === 0) {
      return apiError('沒有提供要更新的資料', 'NO_UPDATE_DATA', 400)
    }

    // 更新環境設施
    const { data, error } = await authenticatedSupabase
      .from('environments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('環境設施不存在', 'ENVIRONMENT_NOT_FOUND', 404)
      }
      return handleSupabaseError(error)
    }

    // 確保返回的數據格式正確
    const formattedData = {
      ...data,
      images: data.images || [],
      features: data.features || []
    }

    return apiSuccess(formattedData, '環境設施更新成功')

  } catch (error) {
    console.error('PUT /api/environments/[id] error:', error)
    return apiError('更新環境設施失敗', 'UPDATE_ENVIRONMENT_ERROR', 500)
  }
}

// DELETE /api/environments/[id] - 刪除環境設施
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return apiError('環境設施ID為必填', 'MISSING_ID', 400)
    }

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建帶有用戶認證上下文的Supabase客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 刪除環境設施
    const { error } = await authenticatedSupabase
      .from('environments')
      .delete()
      .eq('id', id)

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess(null, '環境設施刪除成功')

  } catch (error) {
    console.error('DELETE /api/environments/[id] error:', error)
    return apiError('刪除環境設施失敗', 'DELETE_ENVIRONMENT_ERROR', 500)
  }
}

// 處理不支援的 HTTP 方法
export async function POST() {
  return methodNotAllowed(['GET', 'PUT', 'DELETE'])
}

export async function PATCH() {
  return methodNotAllowed(['GET', 'PUT', 'DELETE'])
} 