'use client'

import { useState } from 'react'
import { AdminSetup } from '../../../lib/admin-setup'

export default function AdminSetupPage() {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [setupResult, setSetupResult] = useState<any>(null)
  const [customEmail, setCustomEmail] = useState('')
  const [customPassword, setCustomPassword] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'checking' | 'success' | 'error'>('unchecked')

  const handleConnectionCheck = async () => {
    setConnectionStatus('checking')
    try {
      const result = await AdminSetup.checkSupabaseConnection()
      setConnectionStatus(result.success ? 'success' : 'error')
      if (!result.success) {
        setSetupResult({ error: result.error })
      }
    } catch (error) {
      setConnectionStatus('error')
      setSetupResult({ error: 'Failed to check connection' })
    }
  }

  const handleDevSetup = async () => {
    setSetupStatus('loading')
    setSetupResult(null)
    
    try {
      const result = await AdminSetup.devSetup()
      setSetupResult(result)
      setSetupStatus(result.success ? 'success' : 'error')
    } catch (error) {
      setSetupResult({ error: 'Unexpected error occurred' })
      setSetupStatus('error')
    }
  }

  const handleCustomSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail || !customPassword) return

    setSetupStatus('loading')
    setSetupResult(null)
    
    try {
      const result = await AdminSetup.createInitialAdmin(customEmail, customPassword)
      setSetupResult(result)
      setSetupStatus(result.success ? 'success' : 'error')
    } catch (error) {
      setSetupResult({ error: 'Unexpected error occurred' })
      setSetupStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
          管理員設置
        </h1>
        
        <div className="space-y-6">
          {/* 連接檢查 */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Supabase 連接檢查</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleConnectionCheck}
                disabled={connectionStatus === 'checking'}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {connectionStatus === 'checking' ? '檢查中...' : '檢查連接'}
              </button>
              {connectionStatus === 'success' && (
                <span className="text-green-600 text-sm">✅ 連接成功</span>
              )}
              {connectionStatus === 'error' && (
                <span className="text-red-600 text-sm">❌ 連接失敗</span>
              )}
            </div>
          </div>

          {/* 快速設置 */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">快速設置（開發用）</h2>
            <p className="text-sm text-gray-600 mb-4">
              將創建預設管理員帳號：admin@dogkennel.com / admin123456
            </p>
            <button
              onClick={handleDevSetup}
              disabled={setupStatus === 'loading'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {setupStatus === 'loading' ? '設置中...' : '快速設置'}
            </button>
          </div>

          {/* 自定義設置 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">自定義管理員</h2>
            <form onSubmit={handleCustomSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電子郵件
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your-email@example.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  請使用有效的電子郵件地址
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  密碼
                </label>
                <input
                  type="password"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  密碼長度至少6個字符
                </p>
              </div>
              <button
                type="submit"
                disabled={setupStatus === 'loading'}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {setupStatus === 'loading' ? '創建中...' : '創建管理員'}
              </button>
            </form>
          </div>

          {/* 結果顯示 */}
          {setupResult && (
            <div className={`p-4 rounded-md ${
              setupStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {setupStatus === 'success' ? (
                <div>
                  <p className="font-semibold mb-2">✅ 管理員創建成功！</p>
                  {setupResult.credentials && (
                    <div className="text-sm">
                      <p>電子郵件: {setupResult.credentials.email}</p>
                      <p>密碼: {setupResult.credentials.password}</p>
                    </div>
                  )}
                  <p className="text-sm mt-2">
                    <a href="/admin" className="text-blue-600 hover:underline">
                      前往管理後台登入 →
                    </a>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold mb-2">❌ 創建失敗</p>
                  <p className="text-sm">
                    {setupResult.error?.message || setupResult.error || '未知錯誤'}
                  </p>
                  <div className="text-xs mt-2 text-gray-600">
                    <p>可能的解決方案：</p>
                    <ul className="list-disc ml-4 mt-1">
                      <li>確保 Supabase 環境變數設置正確</li>
                      <li>檢查 Supabase 專案的認證設置</li>
                      <li>使用有效的電子郵件地址</li>
                      <li>確保網路連接正常</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            此頁面僅用於開發環境設置
          </p>
        </div>
      </div>
    </div>
  )
} 