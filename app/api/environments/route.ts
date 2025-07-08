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

// GET /api/environments - 獲取所有環境
export async function GET(request: NextRequest) {
  try {
    const { page, limit, sort, order, type } = parseQueryParams(request)
    const offset = calculateOffset(page, limit)

    // 建立查詢
    let query = supabase
      .from('environments')
      .select('*', { count: 'exact' })
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    // 添加篩選條件
    if (type) {
      query = query.eq('type', type)
    }

    const { data, error, count } = await query

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess({
      environments: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('GET /api/environments error:', error)
    return apiError('獲取環境資料失敗', 'FETCH_ENVIRONMENTS_ERROR', 500)
  }
}

// POST /api/environments - 創建新環境
export async function POST(request: NextRequest) {
  try {
    // 驗證用戶身份
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 驗證請求體
    const requiredFields = ['name', 'type']
    const { isValid, body, error: validationError } = await validateRequestBody(request, requiredFields)
    
    if (!isValid) {
      return apiError(validationError!, 'VALIDATION_ERROR', 400)
    }

    // 驗證環境類型
    const validTypes = ['accommodation', 'classroom', 'playground', 'transport', 'other']
    if (!validTypes.includes(body.type)) {
      return apiError(`環境類型必須為: ${validTypes.join(', ')}`, 'INVALID_TYPE', 400)
    }

    // 準備環境資料
    const environmentData = {
      name: body.name.trim(),
      type: body.type,
      description: body.description?.trim(),
      images: body.images || [],
      features: body.features || []
    }

    // 插入到資料庫
    const { data, error } = await supabase
      .from('environments')
      .insert([environmentData])
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess(data, '環境資料創建成功')

  } catch (error) {
    console.error('POST /api/environments error:', error)
    return apiError('創建環境資料失敗', 'CREATE_ENVIRONMENT_ERROR', 500)
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