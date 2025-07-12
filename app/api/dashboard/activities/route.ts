import { NextRequest } from 'next/server'
import { supabase, createAuthenticatedSupabaseClient } from '@/lib/supabase'
import { 
  apiSuccess, 
  apiError, 
  validateAuth,
  handleSupabaseError
} from '@/lib/api-utils'

interface Activity {
  id: string
  type: 'post' | 'member' | 'puppy' | 'environment'
  action: string
  target: string
  time: string
  avatar: string
}

// GET /api/dashboard/activities - 獲取最近活動
export async function GET(request: NextRequest) {
  try {
    // 驗證用戶身份
    const { user, token, error: authError } = await validateAuth(request)
    if (authError || !user || !token) {
      return apiError(authError || '需要登入', 'UNAUTHORIZED', 401)
    }

    // 創建帶有用戶認證上下文的Supabase客戶端
    const authenticatedSupabase = createAuthenticatedSupabaseClient(token)

    const limit = 10 // 獲取最近10條活動

    // 並行獲取各種類型的最近記錄
    const [postsResult, membersResult, puppiesResult, environmentsResult] = await Promise.all([
      // 最近的文章
      authenticatedSupabase
        .from('posts')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
      
      // 最近的犬隻
      authenticatedSupabase
        .from('members')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
      
      // 最近的幼犬
      authenticatedSupabase
        .from('puppies')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
      
      // 最近的環境設施
      authenticatedSupabase
        .from('environments')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)
    ])

    // 檢查錯誤
    if (postsResult.error) {
      console.error('Posts query error:', postsResult.error)
      return handleSupabaseError(postsResult.error)
    }
    if (membersResult.error) {
      console.error('Members query error:', membersResult.error)
      return handleSupabaseError(membersResult.error)
    }
    if (puppiesResult.error) {
      console.error('Puppies query error:', puppiesResult.error)
      return handleSupabaseError(puppiesResult.error)
    }
    if (environmentsResult.error) {
      console.error('Environments query error:', environmentsResult.error)
      return handleSupabaseError(environmentsResult.error)
    }

    // 格式化活動數據
    const activities: Activity[] = []

    // 添加文章活動
    postsResult.data?.forEach(post => {
      activities.push({
        id: `post-${post.id}`,
        type: 'post',
        action: '新增了日誌文章',
        target: post.title || '未命名文章',
        time: formatTime(post.created_at),
        avatar: '📝'
      })
    })

    // 添加犬隻活動
    membersResult.data?.forEach(member => {
      activities.push({
        id: `member-${member.id}`,
        type: 'member',
        action: '新增了犬隻',
        target: member.name || '未命名犬隻',
        time: formatTime(member.created_at),
        avatar: '👤'
      })
    })

    // 添加幼犬活動
    puppiesResult.data?.forEach(puppy => {
      activities.push({
        id: `puppy-${puppy.id}`,
        type: 'puppy',
        action: '登記了幼犬',
        target: puppy.name || '未命名幼犬',
        time: formatTime(puppy.created_at),
        avatar: '🐕'
      })
    })

    // 添加環境設施活動
    environmentsResult.data?.forEach(environment => {
      activities.push({
        id: `environment-${environment.id}`,
        type: 'environment',
        action: '更新了環境設施',
        target: environment.name || '未命名設施',
        time: formatTime(environment.created_at),
        avatar: '🏠'
      })
    })

    // 按時間排序並限制數量
    activities.sort((a, b) => {
      const timeA = new Date(a.time.replace(/(\d+)\s*(小時|天|分鐘)前/, (match, num, unit) => {
        const now = new Date()
        if (unit === '小時') {
          now.setHours(now.getHours() - parseInt(num))
        } else if (unit === '天') {
          now.setDate(now.getDate() - parseInt(num))
        } else if (unit === '分鐘') {
          now.setMinutes(now.getMinutes() - parseInt(num))
        }
        return now.toISOString()
      }))
      
      const timeB = new Date(b.time.replace(/(\d+)\s*(小時|天|分鐘)前/, (match, num, unit) => {
        const now = new Date()
        if (unit === '小時') {
          now.setHours(now.getHours() - parseInt(num))
        } else if (unit === '天') {
          now.setDate(now.getDate() - parseInt(num))
        } else if (unit === '分鐘') {
          now.setMinutes(now.getMinutes() - parseInt(num))
        }
        return now.toISOString()
      }))
      
      return timeB.getTime() - timeA.getTime()
    })

    return apiSuccess(activities.slice(0, limit))

  } catch (error) {
    console.error('GET /api/dashboard/activities error:', error)
    return apiError('獲取活動記錄失敗', 'FETCH_ACTIVITIES_ERROR', 500)
  }
}

// 格式化時間為相對時間
function formatTime(createdAt: string): string {
  const now = new Date()
  const created = new Date(createdAt)
  const diffMs = now.getTime() - created.getTime()
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 60) {
    return `${diffMinutes} 分鐘前`
  } else if (diffHours < 24) {
    return `${diffHours} 小時前`
  } else {
    return `${diffDays} 天前`
  }
}