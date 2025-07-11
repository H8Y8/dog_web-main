'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import { Button } from '../../lib/ui/Button'
import { cn } from '../../lib/ui/utils'
import PostsManager from './components/PostsManager'
import MembersManager from './components/MembersManager'
import PuppiesManager from './components/PuppiesManager'
import EnvironmentsManager from './components/EnvironmentsManager'

export default function AdminPage() {
  const { user, session, loading, isAuthenticated, signOut } = useAuth()
  const [isAdminVerified, setIsAdminVerified] = useState(false)
  const [adminCheckLoading, setAdminCheckLoading] = useState(true)

  // 檢查是否是管理員
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!loading && isAuthenticated && user) {
        try {
          const { AuthService } = await import('../../lib/auth')
          const adminStatus = await AuthService.isAdmin(user)
          setIsAdminVerified(adminStatus)
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdminVerified(false)
        }
      } else {
        setIsAdminVerified(false)
      }
      setAdminCheckLoading(false)
    }

    checkAdminStatus()
  }, [user, loading, isAuthenticated])

  if (loading || adminCheckLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white/80 text-lg font-medium">驗證身份中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdminVerified) {
    return <AdminLogin />
  }

  return <AdminDashboard user={user} session={session} onSignOut={signOut} />
}

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await signIn(email, password)
      
      if (result.error) {
        const errorMessage = result.error instanceof Error ? result.error.message : '帳號或密碼錯誤'
        setError('登入失敗：' + errorMessage)
      }
    } catch (error) {
      setError('登入失敗：網路錯誤，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
                         <h1 className="text-3xl font-bold text-white mb-2">管理後台</h1>
             <p className="text-white/70">雷歐犬舍訓練工作室管理系統</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                電子郵件
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                placeholder="請輸入電子郵件"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                密碼
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                placeholder="請輸入密碼"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  登入中...
                </div>
              ) : (
                '登入管理後台'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// 圖標組件
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
  </svg>
)

const PostsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const PuppiesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const MembersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const EnvironmentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

function AdminDashboard({ user, session, onSignOut }: { user: any, session: any, onSignOut: () => Promise<any> }) {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [postsCount, setPostsCount] = useState(0)
  const [membersCount, setMembersCount] = useState(0)
  const [puppiesCount, setPuppiesCount] = useState(0)
  const [environmentsCount, setEnvironmentsCount] = useState(0)

  // 獲取所有數量統計
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }

        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        // 獲取文章數量
        console.log('Fetching posts count...') // 調試信息

        const postsResponse = await fetch('/api/posts?count=true', {
          headers,
        })

        console.log('Posts response status:', postsResponse.status) // 調試信息

        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          console.log('Posts count data:', postsData) // 調試信息
          setPostsCount(postsData.data?.total || 0)
        } else {
          console.error('Failed to fetch posts count:', postsResponse.status, postsResponse.statusText)
        }

        // 獲取成員數量
        console.log('Fetching members count...') // 調試信息

        const membersResponse = await fetch('/api/members', {
          headers,
        })

        console.log('Members response status:', membersResponse.status) // 調試信息

        if (membersResponse.ok) {
          const membersData = await membersResponse.json()
          console.log('Members count data:', membersData) // 調試信息
          setMembersCount(membersData.data?.pagination?.total || 0)
        } else {
          console.error('Failed to fetch members count:', membersResponse.status, membersResponse.statusText)
        }

        // 獲取幼犬數量
        console.log('Fetching puppies count...') // 調試信息

        const puppiesResponse = await fetch('/api/puppies', {
          headers,
        })

        console.log('Puppies response status:', puppiesResponse.status) // 調試信息

        if (puppiesResponse.ok) {
          const puppiesData = await puppiesResponse.json()
          console.log('Puppies count data:', puppiesData) // 調試信息
          setPuppiesCount(puppiesData.data?.pagination?.total || 0)
        } else {
          console.error('Failed to fetch puppies count:', puppiesResponse.status, puppiesResponse.statusText)
        }

        // 獲取環境設施數量
        console.log('Fetching environments count...') // 調試信息

        const environmentsResponse = await fetch('/api/environments', {
          headers,
        })

        console.log('Environments response status:', environmentsResponse.status) // 調試信息

        if (environmentsResponse.ok) {
          const environmentsData = await environmentsResponse.json()
          console.log('Environments count data:', environmentsData) // 調試信息
          setEnvironmentsCount(environmentsData.data?.pagination?.total || 0)
        } else {
          console.error('Failed to fetch environments count:', environmentsResponse.status, environmentsResponse.statusText)
        }
      } catch (error) {
        console.error('Error fetching counts:', error)
      }
    }

    if (session) {
      fetchCounts()
    }
  }, [session])

  const navigationItems = [
    {
      id: 'dashboard',
      label: '概覽',
      icon: <DashboardIcon />,
      active: currentView === 'dashboard',
    },
    {
      id: 'content',
      label: '內容管理',
      icon: <PostsIcon />,
      children: [
        { id: 'posts', label: '日誌管理', badge: postsCount.toString() },
        { id: 'puppies', label: '幼犬管理', badge: puppiesCount.toString() },
        { id: 'members', label: '成員管理', badge: membersCount.toString() },
        { id: 'environments', label: '環境管理', badge: environmentsCount.toString() },
      ],
    },
    {
      id: 'settings',
      label: '系統設定',
      icon: <SettingsIcon />,
    },
  ]

  const handleNavigationClick = (itemId: string) => {
    setCurrentView(itemId)
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardContent />
      case 'posts':
        return <PostsManager user={user} session={session} />
      case 'puppies':
        return <PuppiesManager />
      case 'members':
        return <MembersManager />
      case 'environments':
        return <EnvironmentsManager />
      case 'settings':
        return <ComingSoonPage title="系統設定" description="配置系統參數和偏好" />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* 側邊欄 */}
      <div className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo 區域 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
                         <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-sm">雷</span>
             </div>
             {!sidebarCollapsed && (
               <div className="ml-3">
                 <h2 className="text-lg font-bold text-gray-900">雷歐犬舍訓練工作室</h2>
                 <p className="text-xs text-gray-500">管理系統</p>
               </div>
             )}
          </div>
        </div>

        {/* 導航區域 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              collapsed={sidebarCollapsed}
              onItemClick={handleNavigationClick}
            />
          ))}
        </nav>

        {/* 用戶區域 */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email?.split('@')[0] || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">管理員</p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 頂部導航欄 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MenuIcon />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentView === 'dashboard' ? '概覽' : getPageTitle(currentView)}
                </h1>
                <p className="text-sm text-gray-500">歡迎回到管理後台</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <BellIcon />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* 主要內容 */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

function NavItem({ item, collapsed, onItemClick }: { 
  item: any, 
  collapsed: boolean, 
  onItemClick: (id: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    } else {
      onItemClick(item.id)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
          "hover:bg-gray-100 focus:outline-none",
          item.active && "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm",
          !item.active && "text-gray-600 hover:text-gray-900"
        )}
      >
        {item.icon && (
          <span className="flex-shrink-0 h-5 w-5 mr-3">
            {item.icon}
          </span>
        )}
        
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            
            {item.badge && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                {item.badge}
              </span>
            )}
            
            {hasChildren && (
              <ChevronRightIcon />
            )}
          </>
        )}
      </button>
      
      {hasChildren && isOpen && !collapsed && (
        <div className="mt-1 ml-6 space-y-1">
          {item.children.map((child: any) => (
            <button
              key={child.id}
              onClick={() => onItemClick(child.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{child.label}</span>
              {child.badge && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  {child.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* 歡迎區域 */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-2xl shadow-xl">
        <div className="px-8 py-12 text-center">
                     <div className="max-w-4xl mx-auto">
             <h1 className="text-4xl font-bold text-white mb-4">
               歡迎來到雷歐犬舍訓練工作室管理系統
             </h1>
             <p className="text-purple-100 text-lg leading-relaxed">
               專業的犬舍管理平台，讓您輕鬆管理犬舍的日常運營、幼犬資訊和會員服務
             </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                查看統計報告
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                快速設定
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="日誌文章"
          value="12"
          change="+8.2%"
          trend="up"
          icon={<PostsIcon />}
          color="blue"
        />
        <StatCard
          title="幼犬資料"
          value="8"
          change="+12.5%"
          trend="up"
          icon={<PuppiesIcon />}
          color="red"
        />
        <StatCard
          title="會員數量"
          value="15"
          change="+5.1%"
          trend="up"
          icon={<MembersIcon />}
          color="green"
        />
        <StatCard
          title="環境設施"
          value="6"
          change="0%"
          trend="neutral"
          icon={<EnvironmentIcon />}
          color="purple"
        />
      </div>

      {/* 快速操作和最近活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 快速操作 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">快速操作</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionCard
              title="新增日誌"
              description="記錄犬舍日常"
              icon={<PostsIcon />}
              color="blue"
            />
            <QuickActionCard
              title="登記幼犬"
              description="新增幼犬資料"
              icon={<PuppiesIcon />}
              color="red"
            />
            <QuickActionCard
              title="新增會員"
              description="註冊新會員"
              icon={<MembersIcon />}
              color="green"
            />
            <QuickActionCard
              title="更新環境"
              description="維護設施資訊"
              icon={<EnvironmentIcon />}
              color="purple"
            />
          </div>
        </div>

        {/* 最近活動 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">最近活動</h2>
          <div className="space-y-4">
            {[
              { 
                id: 1, 
                action: '新增了日誌文章', 
                target: '春季幼犬訓練記錄', 
                time: '2 小時前',
                type: 'post',
                avatar: '📝'
              },
              { 
                id: 2, 
                action: '更新了幼犬資訊', 
                target: 'Max 的健康檢查', 
                time: '4 小時前',
                type: 'puppy',
                avatar: '🐕'
              },
              { 
                id: 3, 
                action: '新增了會員', 
                target: '張先生', 
                time: '1 天前',
                type: 'member',
                avatar: '👤'
              },
              { 
                id: 4, 
                action: '更新了環境設施', 
                target: '遊戲區清潔記錄', 
                time: '2 天前',
                type: 'environment',
                avatar: '🏠'
              },
            ].map((item) => (
              <div key={item.id} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-lg">
                  {item.avatar}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-900">
                    {item.action} <span className="font-semibold">「{item.target}」</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
                <ChevronRightIcon />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, trend, icon, color }: {
  title: string,
  value: string,
  change: string,
  trend: 'up' | 'down' | 'neutral',
  icon: React.ReactNode,
  color: 'blue' | 'red' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600',
    red: 'from-red-500 to-red-600 text-red-600',
    green: 'from-green-500 to-green-600 text-green-600',
    purple: 'from-purple-500 to-purple-600 text-purple-600'
  }

  const trendColors = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          `bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`
        )}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          trendColors[trend]
        )}>
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function QuickActionCard({ title, description, icon, color }: {
  title: string,
  description: string,
  icon: React.ReactNode,
  color: 'blue' | 'red' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'hover:border-blue-200 hover:bg-blue-50',
    red: 'hover:border-red-200 hover:bg-red-50',
    green: 'hover:border-green-200 hover:bg-green-50',
    purple: 'hover:border-purple-200 hover:bg-purple-50'
  }

  return (
    <button className={cn(
      "p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 text-left",
      colorClasses[color]
    )}>
      <div className="mb-3">
        <div className="text-gray-600">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  )
}

function ComingSoonPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          🚀 這個功能正在開發中，敬請期待！
        </p>
      </div>
    </div>
  )
}

function getPageTitle(view: string): string {
  const titles: { [key: string]: string } = {
    posts: '日誌管理',
    puppies: '幼犬管理',
    members: '成員管理',
    environments: '環境管理',
    settings: '系統設定'
  }
  return titles[view] || view
} 