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

// GET /api/environments - 獲取所有環境設施
export async function GET(request: NextRequest) {
  try {
    const { page, limit, sort, order } = parseQueryParams(request)
    const { searchParams } = new URL(request.url)
    
    // 獲取過濾參數
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    
    const offset = calculateOffset(page, limit)

    let query = supabase
      .from('environments')
      .select('*', { count: 'exact' })

    // 應用過濾器
    if (type) {
      query = query.eq('type', type)
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    const { data, error, count } = await query
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      return handleSupabaseError(error)
    }

    // 確保數組字段的格式正確
    const formattedData = data?.map(environment => ({
      ...environment,
      images: environment.images || [],
      features: environment.features || []
    }))

    return apiSuccess({
      environments: formattedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('GET /api/environments error:', error)
    return apiError('獲取環境設施失敗', 'FETCH_ENVIRONMENTS_ERROR', 500)
  }
}

// POST /api/environments - 創建新環境設施
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
    const requiredFields = ['name', 'type']
    const { isValid, body, error: validationError } = await validateRequestBody(request, requiredFields)
    
    if (!isValid) {
      return apiError(validationError!, 'VALIDATION_ERROR', 400)
    }

    // 驗證環境類型
    const validTypes = ['accommodation', 'classroom', 'playground', 'transport', 'other']
    if (!validTypes.includes(body.type)) {
      return apiError('無效的環境類型', 'INVALID_TYPE', 400)
    }

    // 準備環境設施資料
    const environmentData = {
      name: body.name.trim(),
      type: body.type,
      description: body.description?.trim() || null,
      features: body.features || []
    }

    // 使用認證的客戶端插入到資料庫
    const { data, error } = await authenticatedSupabase
      .from('environments')
      .insert([environmentData])
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return handleSupabaseError(error)
    }

    // 確保返回的數據格式正確
    const formattedData = {
      ...data,
      images: data.images || [],
      features: data.features || []
    }

    return apiSuccess(formattedData, '環境設施創建成功')

  } catch (error) {
    console.error('POST /api/environments error:', error)
    return apiError('創建環境設施失敗', 'CREATE_ENVIRONMENT_ERROR', 500)
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