import { NextRequest } from 'next/server'
import { supabase, createAuthenticatedSupabaseClient } from '@/lib/supabase'
import { 
  apiSuccess, 
  apiError, 
  validateAuth,
  handleSupabaseError
} from '@/lib/api-utils'

// GET /api/dashboard/stats - 獲取儀表板統計數據
export async function GET(request: NextRequest) {
  try {
    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建帶有用戶認證上下文的Supabase客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    // 並行獲取所有統計數據
    const [postsResult, membersResult, puppiesResult, environmentsResult] = await Promise.all([
      // 獲取文章統計
      authenticatedSupabase
        .from('posts')
        .select('*', { count: 'exact', head: true }),
      
      // 獲取犬隻統計
      authenticatedSupabase
        .from('members')
        .select('*', { count: 'exact', head: true }),
      
      // 獲取幼犬統計
      authenticatedSupabase
        .from('puppies')
        .select('*', { count: 'exact', head: true }),
      
      // 獲取環境設施統計
      authenticatedSupabase
        .from('environments')
        .select('*', { count: 'exact', head: true })
    ])

    // 檢查是否有錯誤
    if (postsResult.error) {
      return handleSupabaseError(postsResult.error)
    }
    if (membersResult.error) {
      return handleSupabaseError(membersResult.error)
    }
    if (puppiesResult.error) {
      return handleSupabaseError(puppiesResult.error)
    }
    if (environmentsResult.error) {
      return handleSupabaseError(environmentsResult.error)
    }

    // 獲取最近發布的文章統計（本週）
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const { count: recentPostsCount } = await authenticatedSupabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    // 獲取最近添加的幼犬統計（本週）
    const { count: recentPuppiesCount } = await authenticatedSupabase
      .from('puppies')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    // 獲取最近添加的犬隻統計（本週）
    const { count: recentMembersCount } = await authenticatedSupabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    // 計算變化百分比（如果之前一週有數據的話）
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    
    const [prevPostsResult, prevPuppiesResult, prevMembersResult] = await Promise.all([
      authenticatedSupabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString()),
      
      authenticatedSupabase
        .from('puppies')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString()),
      
      authenticatedSupabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString())
    ])

    // 計算變化百分比
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? '+100%' : '0%'
      const change = ((current - previous) / previous) * 100
      return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
    }

    const stats = {
      posts: {
        total: postsResult.count || 0,
        recent: recentPostsCount || 0,
        change: calculateChange(recentPostsCount || 0, prevPostsResult.count || 0)
      },
      members: {
        total: membersResult.count || 0,
        recent: recentMembersCount || 0,
        change: calculateChange(recentMembersCount || 0, prevMembersResult.count || 0)
      },
      puppies: {
        total: puppiesResult.count || 0,
        recent: recentPuppiesCount || 0,
        change: calculateChange(recentPuppiesCount || 0, prevPuppiesResult.count || 0)
      },
      environments: {
        total: environmentsResult.count || 0,
        recent: 0, // 環境設施變化較少，暫時設為0
        change: '0%'
      }
    }

    return apiSuccess(stats)

  } catch (error) {
    console.error('GET /api/dashboard/stats error:', error)
    return apiError('獲取統計數據失敗', 'FETCH_STATS_ERROR', 500)
  }
}