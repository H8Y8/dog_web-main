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

// GET /api/puppies - 獲取所有幼犬
export async function GET(request: NextRequest) {
  try {
    const { page, limit, sort, order, available, breed, gender } = parseQueryParams(request)
    const offset = calculateOffset(page, limit)

    // 建立查詢
    let query = supabase
      .from('puppies')
      .select('*', { count: 'exact' })
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    // 添加篩選條件
    if (available !== null) {
      query = query.eq('available', available === 'true')
    }

    if (breed) {
      query = query.eq('breed', breed)
    }

    if (gender) {
      query = query.eq('gender', gender)
    }

    const { data, error, count } = await query

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess({
      puppies: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('GET /api/puppies error:', error)
    return apiError('獲取幼犬資料失敗', 'FETCH_PUPPIES_ERROR', 500)
  }
}

// POST /api/puppies - 創建新幼犬資料
export async function POST(request: NextRequest) {
  try {
    // 驗證用戶身份
    const { user, error: authError } = await validateAuth(request)
    if (authError || !user) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 驗證請求體
    const requiredFields = ['name', 'breed', 'birth_date', 'gender', 'color']
    const { isValid, body, error: validationError } = await validateRequestBody(request, requiredFields)
    
    if (!isValid) {
      return apiError(validationError!, 'VALIDATION_ERROR', 400)
    }

    // 驗證性別
    if (!['male', 'female'].includes(body.gender)) {
      return apiError('性別必須為 male 或 female', 'INVALID_GENDER', 400)
    }

    // 準備幼犬資料
    const puppyData = {
      name: body.name.trim(),
      breed: body.breed.trim(),
      birth_date: body.birth_date,
      gender: body.gender,
      color: body.color.trim(),
      description: body.description?.trim(),
      images: body.images || [],
      available: body.available !== undefined ? body.available : true,
      price: body.price ? parseFloat(body.price) : null
    }

    // 插入到資料庫
    const { data, error } = await supabase
      .from('puppies')
      .insert([puppyData])
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return apiSuccess(data, '幼犬資料創建成功')

  } catch (error) {
    console.error('POST /api/puppies error:', error)
    return apiError('創建幼犬資料失敗', 'CREATE_PUPPY_ERROR', 500)
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