import { 
  Environment,
  EnvironmentPhotoType, 
  EnvironmentPhotoApiResponse 
} from '../types/environment'
import { supabase } from '../supabase'

/**
 * 獲取當前用戶的訪問令牌
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    console.error('Get access token error:', error)
    return null
  }
}

/**
 * 上傳環境照片
 */
export async function uploadEnvironmentPhoto(
  environmentId: string,
  file: File,
  type: EnvironmentPhotoType,
  accessToken?: string
): Promise<{ url: string; type: EnvironmentPhotoType; environment: Environment }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  // 獲取access token
  const token = accessToken || await getAccessToken()
  
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`/api/environments/${environmentId}/photos`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '上傳失敗' }))
    throw new Error(errorData.message || '上傳照片失敗')
  }

  const data: EnvironmentPhotoApiResponse = await response.json()
  
  if (!data.success || !data.data) {
    throw new Error(data.error || '上傳照片失敗')
  }

  return data.data
}

/**
 * 刪除環境照片
 */
export async function deleteEnvironmentPhoto(
  environmentId: string,
  photoUrl: string,
  type: EnvironmentPhotoType,
  accessToken?: string
): Promise<Environment> {
  const url = new URL(`/api/environments/${environmentId}/photos`, window.location.origin)
  url.searchParams.append('url', photoUrl)
  url.searchParams.append('type', type)

  // 獲取access token
  const token = accessToken || await getAccessToken()
  
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers,
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '刪除失敗' }))
    throw new Error(errorData.message || '刪除照片失敗')
  }

  const data: EnvironmentPhotoApiResponse = await response.json()
  
  if (!data.success || !data.data) {
    throw new Error(data.error || '刪除照片失敗')
  }

  return data.data.environment
} 