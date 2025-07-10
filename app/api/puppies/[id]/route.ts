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

// GET /api/puppies/[id] - 獲取單個幼犬
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('puppies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return apiError('幼犬不存在', 'PUPPY_NOT_FOUND', 404)
      }
      return handleSupabaseError(error)
    }

    // 格式化幼犬數據以匹配前台期望的結構
    const formattedPuppy = {
      ...data,
      // 確保必需的數組字段存在
      health_checks: data.health_checks || [],
      vaccination_records: data.vaccination_records || [],
      pedigree_documents: data.pedigree_documents || [],
      health_certificates: data.health_certificates || [],
      images: data.images || [],
      // 移除 available 字段，使用 status
      ...(data.available !== undefined && { available: undefined })
    }

    return apiSuccess(formattedPuppy)

  } catch (error) {
    console.error('GET /api/puppies/[id] error:', error)
    return apiError('獲取幼犬失敗', 'FETCH_PUPPY_ERROR', 500)
  }
}

// PUT /api/puppies/[id] - 更新幼犬資料
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // 驗證性別（如果提供）
    if (body.gender && !['male', 'female'].includes(body.gender)) {
      return apiError('性別必須為 male 或 female', 'INVALID_GENDER', 400)
    }

    // 準備更新資料（過濾掉空值和 id）
    const updateData = Object.entries(body).reduce((acc, [key, value]) => {
      if (key !== 'id' && value !== undefined && value !== null && value !== '') {
        if (key === 'price' && value !== null) {
          (acc as any)[key] = parseFloat(value as string)
        } else if (typeof value === 'string') {
          (acc as any)[key] = value.trim()
        } else {
          (acc as any)[key] = value
        }
      }
      return acc
    }, {})

    // 添加 updated_at 時間戳
    ;(updateData as any).updated_at = new Date().toISOString()

    // 使用認證的客戶端更新資料庫
    const { data, error } = await authenticatedSupabase
      .from('puppies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return handleSupabaseError(error)
    }

    if (!data) {
      return apiError('幼犬不存在', 'PUPPY_NOT_FOUND', 404)
    }

    // 格式化返回的幼犬數據
    const formattedPuppy = {
      ...data,
      health_checks: data.health_checks || [],
      vaccination_records: data.vaccination_records || [],
      pedigree_documents: data.pedigree_documents || [],
      health_certificates: data.health_certificates || [],
      images: data.images || [],
      ...(data.available !== undefined && { available: undefined })
    }

    return apiSuccess(formattedPuppy, '幼犬資料更新成功')

  } catch (error) {
    console.error('PUT /api/puppies/[id] error:', error)
    return apiError('更新幼犬資料失敗', 'UPDATE_PUPPY_ERROR', 500)
  }
}

// DELETE /api/puppies/[id] - 刪除幼犬資料
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建帶有用戶認證上下文的Supabase客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 使用認證的客戶端刪除資料
    const { data, error } = await authenticatedSupabase
      .from('puppies')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Delete error:', error)
      return handleSupabaseError(error)
    }

    if (!data) {
      return apiError('幼犬不存在', 'PUPPY_NOT_FOUND', 404)
    }

    // 格式化返回的幼犬數據
    const formattedPuppy = {
      ...data,
      health_checks: data.health_checks || [],
      vaccination_records: data.vaccination_records || [],
      pedigree_documents: data.pedigree_documents || [],
      health_certificates: data.health_certificates || [],
      images: data.images || [],
      ...(data.available !== undefined && { available: undefined })
    }

    return apiSuccess(formattedPuppy, '幼犬資料刪除成功')

  } catch (error) {
    console.error('DELETE /api/puppies/[id] error:', error)
    return apiError('刪除幼犬資料失敗', 'DELETE_PUPPY_ERROR', 500)
  }
}

// 處理不支援的 HTTP 方法
export async function POST() {
  return methodNotAllowed(['GET', 'PUT', 'DELETE'])
}

export async function PATCH() {
  return methodNotAllowed(['GET', 'PUT', 'DELETE'])
} 