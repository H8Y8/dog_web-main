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

// Member 介面已移至 lib/types/member.ts
// 新的 Member 介面專為狗隻成員設計
export type { Member, CreateMemberInput, UpdateMemberInput, PedigreeInfo, HealthRecord, Achievement } from './types/member'
export { MemberRole, MemberStatus, Gender, ROLE_LABELS, STATUS_LABELS, GENDER_LABELS, PhotoType } from './types/member'

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