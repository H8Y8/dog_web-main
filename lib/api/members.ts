import { supabase, createAuthenticatedSupabaseClient } from '../supabase'
import { Member, CreateMemberInput, UpdateMemberInput, MemberRole, MemberStatus } from '../types'

// =============================================
// 狗隻成員資料存取函數
// =============================================

export interface MemberQueryOptions {
  role?: MemberRole
  status?: MemberStatus
  sortBy?: 'name' | 'birth_date' | 'created_at'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

/**
 * 獲取所有狗隻成員
 */
export async function getMembers(options: MemberQueryOptions = {}) {
  try {
    let query = supabase
      .from('members')
      .select('*')
    
    // 篩選條件
    if (options.role) {
      query = query.eq('role', options.role)
    }
    
    if (options.status) {
      query = query.eq('status', options.status)
    }
    
    // 排序
    const sortBy = options.sortBy || 'created_at'
    const sortOrder = options.sortOrder || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    
    // 分頁
    if (options.limit) {
      query = query.limit(options.limit)
      if (options.offset) {
        query = query.range(options.offset, options.offset + options.limit - 1)
      }
    }
    
    const { data, error, count } = await query
    
    if (error) {
      throw error
    }
    
    return {
      data: data as Member[],
      count,
      error: null
    }
  } catch (error) {
    console.error('Error fetching members:', error)
    return {
      data: [],
      count: 0,
      error: error as Error
    }
  }
}

/**
 * 根據ID獲取特定狗隻成員
 */
export async function getMemberById(id: string) {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      throw error
    }
    
    return {
      data: data as Member,
      error: null
    }
  } catch (error) {
    console.error('Error fetching member by ID:', error)
    return {
      data: null,
      error: error as Error
    }
  }
}

/**
 * 創建新的狗隻成員
 * @param memberData 狗隻成員資料
 * @param accessToken 用戶驗證token（可選）
 */
export async function createMember(memberData: CreateMemberInput, accessToken?: string) {
  try {
    const client = accessToken ? 
      createAuthenticatedSupabaseClient(accessToken) : 
      supabase
    
    const { data, error } = await client
      .from('members')
      .insert([memberData])
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return {
      data: data as Member,
      error: null
    }
  } catch (error) {
    console.error('Error creating member:', error)
    return {
      data: null,
      error: error as Error
    }
  }
}

/**
 * 更新狗隻成員資料
 * @param id 狗隻成員ID
 * @param updates 更新的資料
 * @param accessToken 用戶驗證token（可選）
 */
export async function updateMember(id: string, updates: UpdateMemberInput, accessToken?: string) {
  try {
    const client = accessToken ? 
      createAuthenticatedSupabaseClient(accessToken) : 
      supabase
    
    const { data, error } = await client
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return {
      data: data as Member,
      error: null
    }
  } catch (error) {
    console.error('Error updating member:', error)
    return {
      data: null,
      error: error as Error
    }
  }
}

/**
 * 刪除狗隻成員
 * @param id 狗隻成員ID
 * @param accessToken 用戶驗證token（可選）
 */
export async function deleteMember(id: string, accessToken?: string) {
  try {
    const client = accessToken ? 
      createAuthenticatedSupabaseClient(accessToken) : 
      supabase
    
    const { error } = await client
      .from('members')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      error: null
    }
  } catch (error) {
    console.error('Error deleting member:', error)
    return {
      success: false,
      error: error as Error
    }
  }
}

/**
 * 獲取種犬（繁殖用狗隻）
 */
export async function getBreedingDogs() {
  return await getMembers({
    role: MemberRole.BREEDING_MALE,
    status: MemberStatus.ACTIVE,
    sortBy: 'name',
    sortOrder: 'asc'
  })
}

/**
 * 獲取種母（繁殖用母狗）
 */
export async function getBreedingFemales() {
  return await getMembers({
    role: MemberRole.BREEDING_FEMALE,
    status: MemberStatus.ACTIVE,
    sortBy: 'name',
    sortOrder: 'asc'
  })
}

/**
 * 獲取退休狗隻
 */
export async function getRetiredMembers() {
  return await getMembers({
    status: MemberStatus.RETIRED,
    sortBy: 'name',
    sortOrder: 'asc'
  })
}

/**
 * 按角色分組獲取狗隻成員
 */
export async function getMembersByRole() {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('role')
      .order('name')
    
    if (error) {
      throw error
    }
    
    // 按角色分組
    const groupedMembers: Record<MemberRole, Member[]> = {} as Record<MemberRole, Member[]>
    
    data?.forEach((member: Member) => {
      if (!groupedMembers[member.role]) {
        groupedMembers[member.role] = []
      }
      groupedMembers[member.role].push(member)
    })
    
    return {
      data: groupedMembers,
      error: null
    }
  } catch (error) {
    console.error('Error fetching members by role:', error)
    return {
      data: {} as Record<MemberRole, Member[]>,
      error: error as Error
    }
  }
} 