'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../supabase'
import { 
  Environment, 
  CreateEnvironmentInput, 
  UpdateEnvironmentInput, 
  EnvironmentType,
  EnvironmentFilter 
} from '../types/environment'

// =============================================
// useEnvironments Hook - 管理多個環境設施
// =============================================

interface UseEnvironmentsState {
  environments: Environment[]
  loading: boolean
  error: Error | null
  count: number
}

interface EnvironmentQueryOptions {
  type?: EnvironmentType
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export function useEnvironments(options: EnvironmentQueryOptions = {}) {
  const [state, setState] = useState<UseEnvironmentsState>({
    environments: [],
    loading: true,
    error: null,
    count: 0
  })

  // 記憶化 options 以防止不必要的重新渲染
  const memoizedOptions = useMemo(() => options, [
    options.type,
    options.search,
    options.sortBy,
    options.sortOrder,
    options.limit,
    options.offset
  ])

  // 獲取環境設施列表
  const fetchEnvironments = useCallback(async (newOptions?: EnvironmentQueryOptions) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const finalOptions = { ...memoizedOptions, ...newOptions }
      
      // 構建查詢參數
      const params = new URLSearchParams()
      if (finalOptions.type) params.append('type', finalOptions.type)
      if (finalOptions.search) params.append('search', finalOptions.search)
      if (finalOptions.sortBy) params.append('sort', finalOptions.sortBy)
      if (finalOptions.sortOrder) params.append('order', finalOptions.sortOrder)
      if (finalOptions.limit) params.append('limit', finalOptions.limit.toString())
      if (finalOptions.offset) params.append('offset', finalOptions.offset.toString())

      const response = await fetch(`/api/environments?${params.toString()}`)
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error || '獲取環境設施失敗')
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error 
        }))
      } else {
        setState({
          environments: result.data.environments || [],
          loading: false,
          error: null,
          count: result.data.pagination?.total || 0
        })
      }
    } catch (error) {
      console.error('Error fetching environments:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }))
    }
  }, [memoizedOptions])

  // 新增環境設施
  const addEnvironment = useCallback(async (environmentData: CreateEnvironmentInput, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch('/api/environments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
        body: JSON.stringify(environmentData)
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error || '創建環境設施失敗')
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error 
        }))
        return { success: false, error }
      } else {
        // 重新獲取列表
        await fetchEnvironments()
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
  }, [fetchEnvironments])

  // 更新環境設施
  const updateEnvironment = useCallback(async (id: string, updates: UpdateEnvironmentInput, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(`/api/environments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
        body: JSON.stringify(updates)
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error || '更新環境設施失敗')
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error 
        }))
        return { success: false, error }
      } else {
        // 更新本地狀態
        setState(prev => ({
          ...prev,
          loading: false,
          environments: prev.environments.map(environment => 
            environment.id === id ? result.data! : environment
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

  // 刪除環境設施
  const removeEnvironment = useCallback(async (id: string, accessToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(`/api/environments/${id}`, {
        method: 'DELETE',
        headers: {
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        }
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error || '刪除環境設施失敗')
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error 
        }))
        return { success: false, error }
      } else {
        // 從本地狀態中移除
        setState(prev => ({
          ...prev,
          loading: false,
          environments: prev.environments.filter(environment => environment.id !== id),
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

  // 按類型篩選
  const filterByType = useCallback((type: EnvironmentType) => {
    return state.environments.filter(environment => environment.type === type)
  }, [state.environments])

  // 搜尋環境設施
  const searchEnvironments = useCallback((searchTerm: string) => {
    return state.environments.filter(environment => 
      environment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (environment.description && environment.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [state.environments])

  // 刷新列表
  const refresh = useCallback(() => {
    fetchEnvironments()
  }, [fetchEnvironments])

  // 初始載入和即時訂閱
  useEffect(() => {
    let isMounted = true
    let channel: any = null
    
    const initialFetch = async () => {
      if (isMounted) {
        await fetchEnvironments()
      }
    }
    
    const setupRealtimeSubscription = () => {
      try {
        channel = supabase
          .channel('environments-channel')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'environments'
            },
            (payload) => {
              console.log('Environments change received:', payload)
              
              if (isMounted) {
                // 重新獲取數據而非手動更新狀態，確保數據一致性
                fetchEnvironments()
              }
            }
          )
          .subscribe((status) => {
            console.log('Environments subscription status:', status)
          })
      } catch (error) {
        console.error('Error setting up environments realtime subscription:', error)
      }
    }

    // 執行初始載入
    initialFetch()
    
    // 設置即時訂閱
    setupRealtimeSubscription()

    // 清理函數
    return () => {
      isMounted = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchEnvironments])

  return {
    // 狀態
    environments: state.environments,
    loading: state.loading,
    error: state.error,
    count: state.count,
    
    // 操作方法
    addEnvironment,
    updateEnvironment,
    removeEnvironment,
    refresh,
    
    // 篩選方法
    filterByType,
    searchEnvironments,
    
    // 獲取方法
    fetchEnvironments
  }
}

// =============================================
// useEnvironment Hook - 管理單個環境設施
// =============================================

interface UseEnvironmentState {
  environment: Environment | null
  loading: boolean
  error: Error | null
}

export function useEnvironment(id?: string) {
  const [state, setState] = useState<UseEnvironmentState>({
    environment: null,
    loading: !!id,
    error: null
  })

  // 獲取單個環境設施
  const fetchEnvironment = useCallback(async (environmentId?: string) => {
    const targetId = environmentId || id
    if (!targetId) return

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(`/api/environments/${targetId}`)
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        const error = new Error(result.error || '獲取環境設施失敗')
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error 
        }))
      } else {
        setState({
          environment: result.data,
          loading: false,
          error: null
        })
      }
    } catch (error) {
      console.error('Error fetching environment:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }))
    }
  }, [id])

  // 初始載入
  useEffect(() => {
    if (id) {
      fetchEnvironment()
    }
  }, [id, fetchEnvironment])

  return {
    environment: state.environment,
    loading: state.loading,
    error: state.error,
    refetch: fetchEnvironment
  }
} 