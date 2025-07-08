import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

// 認證相關類型定義
export interface AuthUser extends User {
  role?: string
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
}

// 認證服務類
export class AuthService {
  // 登入
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      return { user: null, session: null, error }
    }
  }

  // 登出
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // 獲取當前用戶
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  // 獲取當前會話
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      return { session: null, error }
    }
  }

  // 檢查用戶是否是管理員
  static async isAdmin(user: User | null): Promise<boolean> {
    if (!user) return false
    
    try {
      // 檢查用戶的 metadata 或專門的 admin_users 表
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (error) {
        // 如果沒有 admin_users 表，檢查 user metadata
        return user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin'
      }

      return data?.role === 'admin'
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // 創建管理員用戶（僅供開發/初始化使用）
  static async createAdminUser(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      })

      if (error) throw error

      // 如果有 admin_users 表，同時在該表中創建記錄
      if (data.user) {
        await supabase
          .from('admin_users')
          .insert({
            user_id: data.user.id,
            email: data.user.email,
            role: 'admin',
            created_at: new Date().toISOString()
          })
      }

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }
} 