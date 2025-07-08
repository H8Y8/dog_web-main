'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'
import { AuthService, type AuthState, type AuthUser } from '../auth'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  // 初始化認證狀態
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { session } = await AuthService.getCurrentSession()
        const user = session?.user || null
        
        setAuthState({
          user: user as AuthUser,
          session,
          loading: false
        })
      } catch (error) {
        console.error('Error initializing auth:', error)
        setAuthState({
          user: null,
          session: null,
          loading: false
        })
      }
    }

    initializeAuth()

    // 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        setAuthState({
          user: (session?.user as AuthUser) || null,
          session,
          loading: false
        })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 登入函數
  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }))
    
    const result = await AuthService.signIn(email, password)
    
    setAuthState({
      user: result.user as AuthUser,
      session: result.session,
      loading: false
    })

    return result
  }, [])

  // 登出函數
  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    
    const result = await AuthService.signOut()
    
    setAuthState({
      user: null,
      session: null,
      loading: false
    })

    return result
  }, [])

  // 檢查是否是管理員
  const isAdmin = useCallback(async () => {
    if (!authState.user) return false
    return await AuthService.isAdmin(authState.user)
  }, [authState.user])

  return {
    ...authState,
    signIn,
    signOut,
    isAdmin,
    isAuthenticated: !!authState.user
  }
} 