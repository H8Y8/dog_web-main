'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  getMembers, 
  getMemberById, 
  createMember, 
  updateMember, 
  deleteMember,
  getBreedingDogs,
  getBreedingFemales,
  getMembersByRole,
  type MemberQueryOptions 
} from '../api/members'
import { Member, CreateMemberInput, UpdateMemberInput, MemberRole, MemberStatus } from '../types'

// =============================================
// useMembers Hook - 管理多個狗隻成員
// =============================================

interface UseMembersState {
  members: Member[]
  loading: boolean
  error: Error | null
  count: number
}

export function useMembers(options: MemberQueryOptions = {}) {
  const [state, setState] = useState<UseMembersState>({
    members: [],
    loading: true,
    error: null,
    count: 0
  })

  // 記憶化 options 以防止不必要的重新渲染
  const memoizedOptions = useMemo(() => options, [
    options.role,
    options.status,
    options.sortBy,
    options.sortOrder,
    options.limit,
    options.offset
  ])

  // 獲取狗隻成員列表
  const fetchMembers = useCallback(async (newOptions?: MemberQueryOptions) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const finalOptions = { ...memoizedOptions, ...newOptions }
      const result = await getMembers(finalOptions)
      
      if (result.error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: result.error 
        }))
      } else {
        setState({
          members: result.data,
          loading: false,
          error: null,
          count: result.count || 0
        })
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }))
    }
  }, [memoizedOptions])

  // 新增狗隻成員
  const addMember = useCallback(async (memberData: CreateMemberInput, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await createMember(memberData, accessToken)
      
      if (result.error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: result.error 
        }))
        return { success: false, error: result.error }
      } else {
        // 重新獲取列表
        await fetchMembers()
        return { success: true, data: result.data }
      }
    } catch (error) {
      const err = error as Error
      setState(prev => ({
        ...prev,
        loading: false,
        error: err
      }))
      return { success: false, error: err }
    }
  }, [fetchMembers])

  // 更新狗隻成員
  const updateMemberData = useCallback(async (id: string, updates: UpdateMemberInput, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await updateMember(id, updates, accessToken)
      
      if (result.error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: result.error 
        }))
        return { success: false, error: result.error }
      } else {
        // 更新本地狀態
        setState(prev => ({
          ...prev,
          loading: false,
          members: prev.members.map(member => 
            member.id === id ? result.data! : member
          )
        }))
        return { success: true, data: result.data }
      }
    } catch (error) {
      const err = error as Error
      setState(prev => ({
        ...prev,
        loading: false,
        error: err
      }))
      return { success: false, error: err }
    }
  }, [])

  // 刪除狗隻成員
  const removeMember = useCallback(async (id: string, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await deleteMember(id, accessToken)
      
      if (result.error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: result.error 
        }))
        return { success: false, error: result.error }
      } else {
        // 從本地狀態中移除
        setState(prev => ({
          ...prev,
          loading: false,
          members: prev.members.filter(member => member.id !== id),
          count: prev.count - 1
        }))
        return { success: true }
      }
    } catch (error) {
      const err = error as Error
      setState(prev => ({
        ...prev,
        loading: false,
        error: err
      }))
      return { success: false, error: err }
    }
  }, [])

  // 按角色篩選
  const filterByRole = useCallback((role: MemberRole) => {
    return state.members.filter(member => member.role === role)
  }, [state.members])

  // 按狀態篩選
  const filterByStatus = useCallback((status: MemberStatus) => {
    return state.members.filter(member => member.status === status)
  }, [state.members])

  // 初始載入 - 只在初次掛載時執行
  useEffect(() => {
    let isMounted = true
    
    const initialFetch = async () => {
      if (isMounted) {
        await fetchMembers()
      }
    }
    
    initialFetch()
    
    return () => {
      isMounted = false
    }
  }, []) // 移除 fetchMembers 依賴，避免無限循環

  // 當 options 改變時重新獲取數據
  useEffect(() => {
    if (state.members.length > 0 || !state.loading) {
      fetchMembers()
    }
  }, [memoizedOptions.role, memoizedOptions.status, memoizedOptions.sortBy, memoizedOptions.sortOrder])

  return {
    ...state,
    fetchMembers,
    addMember,
    updateMember: updateMemberData,
    removeMember,
    filterByRole,
    filterByStatus,
    refresh: fetchMembers
  }
}

// =============================================
// useMember Hook - 管理單個狗隻成員
// =============================================

interface UseMemberState {
  member: Member | null
  loading: boolean
  error: Error | null
}

export function useMember(id?: string) {
  const [state, setState] = useState<UseMemberState>({
    member: null,
    loading: false,
    error: null
  })

  // 獲取單個狗隻成員
  const fetchMember = useCallback(async (memberId?: string) => {
    const targetId = memberId || id
    if (!targetId) return

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await getMemberById(targetId)
      
      if (result.error) {
        setState({
          member: null,
          loading: false,
          error: result.error
        })
      } else {
        setState({
          member: result.data,
          loading: false,
          error: null
        })
      }
    } catch (error) {
      setState({
        member: null,
        loading: false,
        error: error as Error
      })
    }
  }, [id])

  // 更新成員資料
  const updateMemberData = useCallback(async (updates: UpdateMemberInput, accessToken?: string) => {
    if (!id) return { success: false, error: new Error('No member ID provided') }

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await updateMember(id, updates, accessToken)
      
      if (result.error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: result.error 
        }))
        return { success: false, error: result.error }
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          member: result.data
        }))
        return { success: true, data: result.data }
      }
    } catch (error) {
      const err = error as Error
      setState(prev => ({
        ...prev,
        loading: false,
        error: err
      }))
      return { success: false, error: err }
    }
  }, [id])

  // 載入成員資料
  useEffect(() => {
    if (id) {
      fetchMember()
    }
  }, [id, fetchMember])

  return {
    ...state,
    fetchMember,
    updateMember: updateMemberData,
    refresh: () => fetchMember()
  }
}

// =============================================
// useBreedingDogs Hook - 種犬管理
// =============================================

export function useBreedingDogs() {
  const [breedingMales, setBreedineMales] = useState<Member[]>([])
  const [breedingFemales, setBreedingFemales] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBreedingDogs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [malesResult, femalesResult] = await Promise.all([
        getBreedingDogs(),
        getBreedingFemales()
      ])

      if (malesResult.error || femalesResult.error) {
        setError(malesResult.error || femalesResult.error!)
      } else {
        setBreedineMales(malesResult.data)
        setBreedingFemales(femalesResult.data)
      }
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBreedingDogs()
  }, [fetchBreedingDogs])

  return {
    breedingMales,
    breedingFemales,
    loading,
    error,
    refresh: fetchBreedingDogs
  }
}

// =============================================
// useMembersByRole Hook - 按角色分組
// =============================================

export function useMembersByRole() {
  const [memberGroups, setMemberGroups] = useState<Record<MemberRole, Member[]>>({} as Record<MemberRole, Member[]>)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMembersByRole = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getMembersByRole()
      
      if (result.error) {
        setError(result.error)
      } else {
        setMemberGroups(result.data)
      }
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembersByRole()
  }, [fetchMembersByRole])

  return {
    memberGroups,
    loading,
    error,
    refresh: fetchMembersByRole
  }
} 