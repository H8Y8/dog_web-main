import { AuthService } from './auth'

// 僅用於開發環境的管理員設置工具
export class AdminSetup {
  // 創建初始管理員用戶
  static async createInitialAdmin(email: string, password: string) {
    console.log('Creating initial admin user...')
    
    try {
      const result = await AuthService.createAdminUser(email, password)
      
      if (result.error) {
        console.error('Failed to create admin user:', result.error)
        return { success: false, error: result.error }
      }
      
      console.log('Admin user created successfully:', result.user?.email)
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Error creating admin user:', error)
      return { success: false, error }
    }
  }

  // 檢查是否已有管理員用戶
  static async checkAdminExists() {
    try {
      // 這裡可以檢查是否已有管理員用戶存在
      // 暫時返回 false，需要根據實際情況調整
      return false
    } catch (error) {
      console.error('Error checking admin existence:', error)
      return false
    }
  }

  // 開發環境快速設置
  static async devSetup() {
    const DEFAULT_ADMIN_EMAIL = 'admin@dogkennel.com'
    const DEFAULT_ADMIN_PASSWORD = 'admin123456'
    
    console.log('🔧 Setting up development admin...')
    
    try {
      const adminExists = await this.checkAdminExists()
      
      if (adminExists) {
        console.log('✅ Admin user already exists')
        return { success: true, message: 'Admin already exists' }
      }
      
      const result = await this.createInitialAdmin(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD)
      
      if (result.success) {
        console.log('✅ Development admin created successfully!')
        console.log(`📧 Email: ${DEFAULT_ADMIN_EMAIL}`)
        console.log(`🔐 Password: ${DEFAULT_ADMIN_PASSWORD}`)
        return { success: true, credentials: { email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD } }
      } else {
        console.log('❌ Failed to create admin user')
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error in dev setup:', error)
      return { success: false, error }
    }
  }

  // 檢查Supabase連接
  static async checkSupabaseConnection() {
    try {
      const { supabase } = await import('./supabase')
      
      // 測試連接
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Supabase connection error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('✅ Supabase connection successful')
      return { success: true, message: 'Connection successful' }
    } catch (error) {
      console.error('Failed to connect to Supabase:', error)
      return { success: false, error: 'Failed to connect to Supabase' }
    }
  }
}

// 在開發環境中自動執行設置（如果需要）
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // 可以在這裡添加自動設置邏輯
  console.log('🚀 Admin setup utility loaded')
} 