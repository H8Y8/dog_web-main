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

// GET /api/puppies - 獲取所有幼犬
export async function GET(request: NextRequest) {
  try {
    const { page, limit, sort, order, status, breed, gender } = parseQueryParams(request)
    const offset = calculateOffset(page, limit)

    // 建立查詢
    let query = supabase
      .from('puppies')
      .select('*', { count: 'exact' })
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    // 添加篩選條件
    if (status) {
      query = query.eq('status', status)
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

    // 格式化幼犬數據以匹配前台期望的結構
    const formattedPuppies = (data || []).map(puppy => ({
      ...puppy,
      // 確保必需的數組字段存在
      health_checks: puppy.health_checks || [],
      vaccination_records: puppy.vaccination_records || [],
      pedigree_documents: puppy.pedigree_documents || [],
      health_certificates: puppy.health_certificates || [],
      images: puppy.images || [],
      // 移除 available 字段，使用 status
      ...(puppy.available !== undefined && { available: undefined })
    }))

    return apiSuccess({
      puppies: formattedPuppies,
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
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建帶有用戶認證上下文的Supabase客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

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
      personality_traits: body.personality_traits?.trim(),
      images: body.images || [],
      status: body.status || 'available',
      price: body.price ? parseFloat(body.price) : null,
      currency: body.currency || 'TWD',
      microchip_id: body.microchip_id?.trim(),
      birth_weight: body.birth_weight ? parseInt(body.birth_weight) : null,
      current_weight: body.current_weight ? parseInt(body.current_weight) : null,
      expected_adult_weight: body.expected_adult_weight ? parseInt(body.expected_adult_weight) : null
    }

    // 使用認證的客戶端插入到資料庫
    const { data, error } = await authenticatedSupabase
      .from('puppies')
      .insert([puppyData])
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return handleSupabaseError(error)
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

    return apiSuccess(formattedPuppy, '幼犬資料創建成功')

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