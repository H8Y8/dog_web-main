// Supabase 資料庫表格類型定義
export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  cover_image?: string
  published: boolean
  created_at: string
  updated_at: string
  author_id: string
}

export interface Member {
  id: string
  name: string
  role: string
  bio?: string
  avatar_url?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Puppy {
  id: string
  name: string
  breed: string
  birth_date: string
  gender: 'male' | 'female'
  color: string
  description?: string
  images: string[]
  available: boolean
  price?: number
  created_at: string
  updated_at: string
}

export interface Environment {
  id: string
  name: string
  type: 'accommodation' | 'classroom' | 'playground' | 'transport' | 'other'
  description?: string
  images: string[]
  features: string[]
  created_at: string
  updated_at: string
} 