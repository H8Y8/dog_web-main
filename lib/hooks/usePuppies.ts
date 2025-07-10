'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../supabase'
import { 
  Puppy, 
  CreatePuppyInput, 
  UpdatePuppyInput, 
  PuppyGender, 
  PuppyBreed, 
  PuppyStatus,
  PuppiesResponse 
} from '../types/puppy'

// =============================================
// usePuppies Hook - 管理多個幼犬
// =============================================

interface PuppyQueryOptions {
  breed?: PuppyBreed
  gender?: PuppyGender
  status?: PuppyStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

interface UsePuppiesState {
  puppies: Puppy[]
  loading: boolean
  error: Error | null
  count: number
}

export function usePuppies(options: PuppyQueryOptions = {}) {
  const [state, setState] = useState<UsePuppiesState>({
    puppies: [],
    loading: true,
    error: null,
    count: 0
  })

  // 記憶化 options 以防止不必要的重新渲染
  const memoizedOptions = useMemo(() => options, [
    options.breed,
    options.gender,
    options.status,
    options.sortBy,
    options.sortOrder,
    options.limit,
    options.offset
  ])

  // 獲取幼犬列表
  const fetchPuppies = useCallback(async (newOptions?: PuppyQueryOptions) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const finalOptions = { ...memoizedOptions, ...newOptions }
      
      // 構建查詢參數
      const queryParams = new URLSearchParams()
      if (finalOptions.breed) queryParams.set('breed', finalOptions.breed)
      if (finalOptions.gender) queryParams.set('gender', finalOptions.gender)
      if (finalOptions.status) queryParams.set('status', finalOptions.status)
      if (finalOptions.sortBy) queryParams.set('sort', finalOptions.sortBy)
      if (finalOptions.sortOrder) queryParams.set('order', finalOptions.sortOrder)
      if (finalOptions.limit) queryParams.set('limit', finalOptions.limit.toString())
      if (finalOptions.offset) queryParams.set('offset', finalOptions.offset.toString())

      const response = await fetch(`/api/puppies?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`獲取幼犬資料失敗: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      setState({
        puppies: result.data.puppies,
        loading: false,
        error: null,
        count: result.data.pagination.total
      })
    } catch (error) {
      console.error('Error fetching puppies:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }))
    }
  }, [memoizedOptions])

  // 新增幼犬
  const addPuppy = useCallback(async (puppyData: CreatePuppyInput, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch('/api/puppies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
        body: JSON.stringify(puppyData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '創建幼犬失敗')
      }

      const result = await response.json()
      
      // 重新獲取列表
      await fetchPuppies()
      return { success: true, data: result.data }
      
    } catch (error) {
      const err = error as Error
      setState(prev => ({
        ...prev,
        loading: false,
        error: err
      }))
      return { success: false, error: err }
    }
  }, [fetchPuppies])

  // 更新幼犬
  const updatePuppy = useCallback(async (id: string, updates: UpdatePuppyInput, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(`/api/puppies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '更新幼犬失敗')
      }

      const result = await response.json()
      
      // 更新本地狀態
      setState(prev => ({
        ...prev,
        loading: false,
        puppies: prev.puppies.map(puppy => 
          puppy.id === id ? result.data : puppy
        )
      }))
      return { success: true, data: result.data }
      
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

  // 刪除幼犬
  const removePuppy = useCallback(async (id: string, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(`/api/puppies/${id}`, {
        method: 'DELETE',
        headers: {
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '刪除幼犬失敗')
      }
      
      // 從本地狀態中移除
      setState(prev => ({
        ...prev,
        loading: false,
        puppies: prev.puppies.filter(puppy => puppy.id !== id),
        count: prev.count - 1
      }))
      return { success: true }
      
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

  // 按狀態篩選
  const filterByStatus = useCallback((status: PuppyStatus) => {
    return state.puppies.filter(puppy => puppy.status === status)
  }, [state.puppies])

  // 按品種篩選
  const filterByBreed = useCallback((breed: PuppyBreed) => {
    return state.puppies.filter(puppy => puppy.breed === breed)
  }, [state.puppies])

  // 按性別篩選
  const filterByGender = useCallback((gender: PuppyGender) => {
    return state.puppies.filter(puppy => puppy.gender === gender)
  }, [state.puppies])

  // 初始載入和即時訂閱
  useEffect(() => {
    let isMounted = true
    let channel: any = null
    
    const initialFetch = async () => {
      if (isMounted) {
        await fetchPuppies()
      }
    }
    
    // 設置即時訂閱
    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel('puppies_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'puppies' 
          }, 
          (payload) => {
            if (!isMounted) return
            
            setState(prev => {
              let newPuppies = [...prev.puppies]
              
              switch (payload.eventType) {
                case 'INSERT':
                  // 檢查是否已存在，避免重複
                  if (!newPuppies.find(p => p.id === payload.new.id)) {
                    newPuppies.push(payload.new as Puppy)
                  }
                  break
                  
                case 'UPDATE':
                  newPuppies = newPuppies.map(puppy => 
                    puppy.id === payload.new.id ? payload.new as Puppy : puppy
                  )
                  break
                  
                case 'DELETE':
                  newPuppies = newPuppies.filter(puppy => puppy.id !== payload.old.id)
                  break
              }
              
              return {
                ...prev,
                puppies: newPuppies,
                count: payload.eventType === 'INSERT' ? prev.count + 1 :
                       payload.eventType === 'DELETE' ? prev.count - 1 : prev.count
              }
            })
          }
        )
        .subscribe()
    }

    // 初始載入
    initialFetch()
    
    // 設置訂閱
    setupRealtimeSubscription()
    
    // 清理函數
    return () => {
      isMounted = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchPuppies])

  // 手動刷新
  const refresh = useCallback(() => {
    return fetchPuppies()
  }, [fetchPuppies])

  return {
    ...state,
    addPuppy,
    updatePuppy,
    removePuppy,
    filterByStatus,
    filterByBreed,
    filterByGender,
    refresh
  }
}

// =============================================
// usePuppy Hook - 管理單個幼犬
// =============================================

interface UsePuppyState {
  puppy: Puppy | null
  loading: boolean
  error: Error | null
}

export function usePuppy(id?: string) {
  const [state, setState] = useState<UsePuppyState>({
    puppy: null,
    loading: true,
    error: null
  })

  const fetchPuppy = useCallback(async (puppyId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(`/api/puppies/${puppyId}`)
      
      if (!response.ok) {
        throw new Error(`獲取幼犬資料失敗: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      setState({
        puppy: result.data,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error fetching puppy:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }))
    }
  }, [])

  // 當 ID 改變時重新獲取
  useEffect(() => {
    if (id) {
      fetchPuppy(id)
    } else {
      setState({
        puppy: null,
        loading: false,
        error: null
      })
    }
  }, [id, fetchPuppy])

  const refresh = useCallback(() => {
    if (id) {
      return fetchPuppy(id)
    }
  }, [id, fetchPuppy])

  return {
    ...state,
    refresh
  }
} 