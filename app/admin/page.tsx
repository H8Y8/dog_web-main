'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
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


function AdminDashboard({ user, session, onSignOut }: { user: any, session: any, onSignOut: () => Promise<any> }) {
  const [currentView, setCurrentView] = useState('dashboard')
  // 初始狀態：在手機版時側邊欄隱藏，桌面版時顯示
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [postsCount, setPostsCount] = useState(0)
  const [membersCount, setMembersCount] = useState(0)
  const [puppiesCount, setPuppiesCount] = useState(0)
  const [environmentsCount, setEnvironmentsCount] = useState(0)
  const [quickActionTrigger, setQuickActionTrigger] = useState<{ type: string, action: string } | null>(null)
  const [detailView, setDetailView] = useState<{ view: string, id: string, title: string } | null>(null)



  // 監聽視窗大小變化，調整側邊欄狀態
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // 桌面版時展開側邊欄
        setSidebarCollapsed(false)
      } else {
        // 手機版時隱藏側邊欄
        setSidebarCollapsed(true)
      }
    }

    // 初始檢查
    handleResize()
    
    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 監聽詳細頁面導航事件
  useEffect(() => {
    const handleNavigateToDetail = (event: CustomEvent) => {
      const { view, id, title } = event.detail
      console.log('handleNavigateToDetail called with:', { view, id, title })
      setDetailView({ view, id, title })
      setCurrentView(view)
    }

    window.addEventListener('navigate-to-detail', handleNavigateToDetail as EventListener)
    
    return () => {
      window.removeEventListener('navigate-to-detail', handleNavigateToDetail as EventListener)
    }
  }, [])

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
        { id: 'members', label: '犬隻管理', badge: membersCount.toString() },
        { id: 'environments', label: '環境管理', badge: environmentsCount.toString() },
      ],
    },
  ]

  const handleNavigationClick = (itemId: string) => {
    setCurrentView(itemId)
    // 如果不是快速操作觸發的導航，清除觸發器
    if (!quickActionTrigger || quickActionTrigger.type !== itemId) {
      setQuickActionTrigger(null)
    }
    // 清除詳細頁面狀態，因為用戶手動導航了
    setDetailView(null)
    
    // 在手機版時，點選導航項目後自動隱藏側邊欄
    if (window.innerWidth < 1024) { // lg 斷點是 1024px
      setSidebarCollapsed(true)
    }
  }

  const handleQuickAction = (action: string) => {
    // 設置快速操作觸發器，讓對應的管理組件知道要直接進入創建模式
    setQuickActionTrigger({ type: action, action: 'create' })
    setCurrentView(action)
  }

  const renderContent = () => {
    // 檢查是否有快速操作觸發器，並在渲染後清除
    const trigger = quickActionTrigger
    if (trigger && trigger.type === currentView) {
      // 在下一個事件循環中清除觸發器
      setTimeout(() => setQuickActionTrigger(null), 0)
    }

    // 取得詳細頁面請求，但不立即清除
    const detail = detailView

    switch (currentView) {
      case 'dashboard':
        return <DashboardContent session={session} onQuickAction={handleQuickAction} />
      case 'posts':
        const postsProps = {
          user,
          session,
          initialView: (trigger?.type === 'posts' && trigger?.action === 'create' ? 'create' : 
                      detail?.view === 'posts' ? 'edit' : undefined) as 'list' | 'create' | 'edit' | 'detail' | undefined,
          selectedId: detail?.view === 'posts' ? detail.id : undefined,
          onEditViewActivated: () => setDetailView(null)
        }
        console.log('Rendering PostsManager with props:', postsProps)
        return <PostsManager {...postsProps} />
      case 'puppies':
        return <PuppiesManager 
          initialView={trigger?.type === 'puppies' && trigger?.action === 'create' ? 'create' : 
                      detail?.view === 'puppies' ? 'detail' : undefined}
          selectedId={detail?.view === 'puppies' ? detail.id : undefined}
        />
      case 'members':
        const membersProps = {
          initialView: (trigger?.type === 'members' && trigger?.action === 'create' ? 'create' : 
                      detail?.view === 'members' ? 'detail' : undefined) as 'list' | 'detail' | 'create' | 'edit' | undefined,
          selectedId: detail?.view === 'members' ? detail.id : undefined,
          onDetailViewActivated: () => setDetailView(null)
        }
        console.log('Rendering MembersManager with props:', membersProps)
        console.log('Current detail state:', detail)
        return <MembersManager {...membersProps} />
      case 'environments':
        return <EnvironmentsManager 
          initialView={trigger?.type === 'environments' && trigger?.action === 'create' ? 'create' : 
                      detail?.view === 'environments' ? 'detail' : undefined}
          selectedId={detail?.view === 'environments' ? detail.id : undefined}
        />
      default:
        return <DashboardContent session={session} onQuickAction={handleQuickAction} />
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* 遮罩層 - 只在手機版側邊欄展開時顯示 */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* 側邊欄 */}
      <div className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg",
        "fixed lg:relative z-50 lg:z-auto h-full",
        "lg:translate-x-0",
        sidebarCollapsed 
          ? "-translate-x-full lg:translate-x-0 lg:w-16" 
          : "translate-x-0 w-64"
      )}>
        {/* Logo 區域 */}
        <div className="p-3 md:p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs md:text-sm">Reo</span>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-2 md:ml-3 min-w-0">
                <h2 className="text-sm md:text-lg font-bold text-gray-900 truncate">雷歐犬舍訓練工作室</h2>
                <p className="text-xs text-gray-500 hidden md:block">管理系統</p>
              </div>
            )}
          </div>
        </div>

        {/* 導航區域 */}
        <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
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
        <div className="p-2 md:p-4 border-t border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs md:text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-2 md:ml-3 flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                    {user?.email?.split('@')[0] || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate hidden md:block">管理員</p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs md:text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        "lg:ml-0", // 桌面版時不需要左邊距，因為側邊欄是相對定位
        !sidebarCollapsed && "lg:ml-0" // 確保桌面版時側邊欄展開不影響主內容
      )}>
        {/* 頂部導航欄 */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="mr-2 md:mr-4 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <MenuIcon />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                  {currentView === 'dashboard' ? '概覽' : getPageTitle(currentView)}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">歡迎回到管理後台</p>
              </div>
            </div>
          </div>
        </header>

        {/* 主要內容 */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-3 md:p-6">
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
          "w-full flex items-center px-2 md:px-3 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200",
          "hover:bg-gray-100 focus:outline-none",
          item.active && "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm",
          !item.active && "text-gray-600 hover:text-gray-900"
        )}
      >
        {item.icon && (
          <span className="flex-shrink-0 h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3">
            {item.icon}
          </span>
        )}
        
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            
            {item.badge && (
              <span className="ml-1 md:ml-2 inline-flex items-center px-1.5 md:px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full flex-shrink-0">
                {item.badge}
              </span>
            )}
            
            {hasChildren && (
              <span className="flex-shrink-0 ml-1">
                <ChevronRightIcon />
              </span>
            )}
          </>
        )}
      </button>
      
      {hasChildren && isOpen && !collapsed && (
        <div className="mt-1 ml-4 md:ml-6 space-y-1">
          {item.children.map((child: any) => (
            <button
              key={child.id}
              onClick={() => onItemClick(child.id)}
              className="w-full flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md md:rounded-lg transition-colors"
            >
              <span className="truncate">{child.label}</span>
              {child.badge && (
                <span className="ml-1 md:ml-2 inline-flex items-center px-1.5 md:px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
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

function DashboardContent({ session, onQuickAction }: { 
  session: any, 
  onQuickAction: (action: string) => void
}) {
  
  const navigateToItem = (item: any) => {
    // 根據活動內容推斷類型和操作
    let targetView = 'dashboard'
    let targetId = item.id
    
    if (item.action?.includes('日誌') || item.action?.includes('文章')) {
      targetView = 'posts'
    } else if (item.action?.includes('幼犬')) {
      targetView = 'puppies'
    } else if (item.action?.includes('犬隻')) {
      targetView = 'members'
    } else if (item.action?.includes('環境') || item.action?.includes('設施')) {
      targetView = 'environments'
    } else if (item.type) {
      // 如果有 type 字段，使用映射
      const typeMapping: { [key: string]: string } = {
        'post': 'posts',
        'posts': 'posts',
        'puppy': 'puppies',
        'puppies': 'puppies',
        'member': 'members',
        'members': 'members',
        'environment': 'environments',
        'environments': 'environments'
      }
      targetView = typeMapping[item.type] || item.type
    }
    
    console.log('Navigating from item:', item, 'to view:', targetView, 'with ID:', targetId)
    
    // 發送詳細頁面導航事件
    window.dispatchEvent(new CustomEvent('navigate-to-detail', { 
      detail: { 
        view: targetView, 
        id: targetId, 
        title: item.target
      } 
    }))
  }
  const [stats, setStats] = useState<{
    posts: { total: number, change: string, trend: 'up' | 'down' | 'neutral' },
    puppies: { total: number, change: string, trend: 'up' | 'down' | 'neutral' },
    members: { total: number, change: string, trend: 'up' | 'down' | 'neutral' },
    environments: { total: number, change: string, trend: 'up' | 'down' | 'neutral' }
  }>({
    posts: { total: 0, change: '0%', trend: 'neutral' },
    puppies: { total: 0, change: '0%', trend: 'neutral' },
    members: { total: 0, change: '0%', trend: 'neutral' },
    environments: { total: 0, change: '0%', trend: 'neutral' }
  })
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [clickedAction, setClickedAction] = useState<string | null>(null)

  // 快速操作處理函數
  const handleQuickAction = (action: string) => {
    setClickedAction(action)
    // 添加視覺反饋延遲
    setTimeout(() => {
      onQuickAction(action)
      setClickedAction(null)
    }, 150)
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }

        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        // 並行獲取統計數據和活動記錄
        const [statsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/dashboard/stats', { headers }),
          fetch('/api/dashboard/activities', { headers })
        ])

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success && statsData.data) {
            const data = statsData.data
            setStats({
              posts: {
                total: data.posts.total,
                change: data.posts.change,
                trend: data.posts.change.startsWith('+') ? 'up' : data.posts.change === '0%' ? 'neutral' : 'down'
              },
              puppies: {
                total: data.puppies.total,
                change: data.puppies.change,
                trend: data.puppies.change.startsWith('+') ? 'up' : data.puppies.change === '0%' ? 'neutral' : 'down'
              },
              members: {
                total: data.members.total,
                change: data.members.change,
                trend: data.members.change.startsWith('+') ? 'up' : data.members.change === '0%' ? 'neutral' : 'down'
              },
              environments: {
                total: data.environments.total,
                change: data.environments.change,
                trend: data.environments.change.startsWith('+') ? 'up' : data.environments.change === '0%' ? 'neutral' : 'down'
              }
            })
          }
        } else {
          console.error('Failed to fetch stats:', statsResponse.status)
        }

        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json()
          if (activitiesData.success && activitiesData.data) {
            setActivities(activitiesData.data)
          }
        } else {
          console.error('Failed to fetch activities:', activitiesResponse.status)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchDashboardData()
    }
  }, [session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-2xl shadow-xl">
          <div className="px-8 py-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-4">
                歡迎來到雷歐犬舍訓練工作室管理系統
              </h1>
              <p className="text-purple-100 text-lg leading-relaxed">
                專業的犬舍管理平台，讓您輕鬆管理犬舍的日常運營、幼犬資訊和會員服務
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
              <div className="h-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 歡迎區域 */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-xl md:rounded-2xl shadow-xl">
        <div className="px-4 md:px-8 py-6 md:py-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              歡迎來到雷歐犬舍訓練工作室管理系統
            </h1>
            <p className="text-purple-100 text-sm md:text-lg leading-relaxed">
              專業的犬舍管理平台，讓您輕鬆管理犬舍的日常運營、幼犬資訊和會員服務
            </p>
          </div>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard
          title="日誌文章"
          value={stats.posts.total.toString()}
          change={stats.posts.change}
          trend={stats.posts.trend}
          icon={<PostsIcon />}
          color="blue"
        />
        <StatCard
          title="幼犬資料"
          value={stats.puppies.total.toString()}
          change={stats.puppies.change}
          trend={stats.puppies.trend}
          icon={<PuppiesIcon />}
          color="red"
        />
        <StatCard
          title="犬隻數量"
          value={stats.members.total.toString()}
          change={stats.members.change}
          trend={stats.members.trend}
          icon={<MembersIcon />}
          color="green"
        />
        <StatCard
          title="環境設施"
          value={stats.environments.total.toString()}
          change={stats.environments.change}
          trend={stats.environments.trend}
          icon={<EnvironmentIcon />}
          color="purple"
        />
      </div>

      {/* 快速操作和最近活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* 快速操作 */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">快速操作</h2>
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <QuickActionCard
              title="新增日誌"
              description="記錄犬舍日常"
              icon={<PostsIcon />}
              color="blue"
              onClick={() => handleQuickAction('posts')}
              loading={clickedAction === 'posts'}
            />
            <QuickActionCard
              title="登記幼犬"
              description="新增幼犬資料"
              icon={<PuppiesIcon />}
              color="red"
              onClick={() => handleQuickAction('puppies')}
              loading={clickedAction === 'puppies'}
            />
            <QuickActionCard
              title="新增犬隻"
              description="註冊新犬隻"
              icon={<MembersIcon />}
              color="green"
              onClick={() => handleQuickAction('members')}
              loading={clickedAction === 'members'}
            />
            <QuickActionCard
              title="更新環境"
              description="維護設施資訊"
              icon={<EnvironmentIcon />}
              color="purple"
              onClick={() => handleQuickAction('environments')}
              loading={clickedAction === 'environments'}
            />
          </div>
        </div>

        {/* 最近活動 */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">最近活動</h2>
          <div className="space-y-3 md:space-y-4">
            {activities.length > 0 ? (
              activities.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => navigateToItem(item)}
                  className="w-full flex items-center p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-sm md:text-lg flex-shrink-0">
                    {item.avatar}
                  </div>
                  <div className="ml-2 md:ml-4 flex-1 text-left min-w-0">
                    <p className="text-xs md:text-sm text-gray-900 truncate">
                      {item.action} <span className="font-semibold">「{item.target}」</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 md:mt-1">{item.time}</p>
                  </div>
                  <div className="flex-shrink-0 ml-1">
                    <ChevronRightIcon />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>暫無最近活動</p>
              </div>
            )}
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
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-3 md:p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className={cn(
          "w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center",
          `bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`
        )}>
          <div className="text-white text-sm md:text-base">
            {icon}
          </div>
        </div>
        <div className={cn(
          "px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium",
          trendColors[trend]
        )}>
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-xl md:text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function QuickActionCard({ title, description, icon, color, onClick, loading = false }: {
  title: string,
  description: string,
  icon: React.ReactNode,
  color: 'blue' | 'red' | 'green' | 'purple',
  onClick?: () => void,
  loading?: boolean
}) {
  const colorClasses = {
    blue: 'hover:border-blue-200 hover:bg-blue-50',
    red: 'hover:border-red-200 hover:bg-red-50',
    green: 'hover:border-green-200 hover:bg-green-50',
    purple: 'hover:border-purple-200 hover:bg-purple-50'
  }

  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={cn(
        "p-2 md:p-4 border border-gray-200 rounded-lg md:rounded-xl hover:shadow-md transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 relative min-h-[80px] md:min-h-[120px]",
        !loading && colorClasses[color],
        loading && 'bg-gray-50 border-gray-300 cursor-not-allowed',
        !loading && color === 'blue' && 'focus:ring-blue-500',
        !loading && color === 'red' && 'focus:ring-red-500',
        !loading && color === 'green' && 'focus:ring-green-500',
        !loading && color === 'purple' && 'focus:ring-purple-500'
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg md:rounded-xl">
          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="mb-2 md:mb-3">
        <div className={cn("transition-colors text-sm md:text-base", loading ? "text-gray-400" : "text-gray-600")}>
          {icon}
        </div>
      </div>
      <h3 className={cn("text-sm md:text-base font-semibold mb-1 transition-colors leading-tight", loading ? "text-gray-500" : "text-gray-900")}>{title}</h3>
      <p className={cn("text-xs md:text-sm transition-colors leading-tight", loading ? "text-gray-400" : "text-gray-500")}>{description}</p>
    </button>
  )
}



function getPageTitle(view: string): string {
  const titles: { [key: string]: string } = {
    posts: '日誌管理',
    puppies: '幼犬管理',
    members: '犬隻管理',
    environments: '環境管理'
  }
  return titles[view] || view
} 