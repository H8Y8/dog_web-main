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

// GET /api/members - 獲取所有成員
export async function GET(request: NextRequest) {
  try {
    const { page, limit, sort, order } = parseQueryParams(request)
    const offset = calculateOffset(page, limit)

    const { data, error, count } = await supabase
      .from('members')
      .select('*', { count: 'exact' })
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess({
      members: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('GET /api/members error:', error)
    return apiError('獲取成員失敗', 'FETCH_MEMBERS_ERROR', 500)
  }
}

// POST /api/members - 創建新成員
export async function POST(request: NextRequest) {
  try {
    // 驗證用戶身份
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 驗證請求體
    const requiredFields = ['name', 'role']
    const { isValid, body, error: validationError } = await validateRequestBody(request, requiredFields)
    
    if (!isValid) {
      return apiError(validationError!, 'VALIDATION_ERROR', 400)
    }

    // 準備成員資料
    const memberData = {
      name: body.name.trim(),
      role: body.role.trim(),
      bio: body.bio?.trim(),
      avatar_url: body.avatar_url,
      email: body.email?.trim()
    }

    // 插入到資料庫
    const { data, error } = await supabase
      .from('members')
      .insert([memberData])
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess(data, '成員創建成功')

  } catch (error) {
    console.error('POST /api/members error:', error)
    return apiError('創建成員失敗', 'CREATE_MEMBER_ERROR', 500)
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