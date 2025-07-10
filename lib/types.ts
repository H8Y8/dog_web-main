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

// Puppy 介面已移至 lib/types/puppy.ts
// 新的 Puppy 介面專為幼犬管理設計
export type { 
  Puppy, 
  CreatePuppyInput, 
  UpdatePuppyInput, 
  PuppyFilter,
  PuppiesResponse,
  HealthCheck,
  VaccinationRecord,
  PuppyPedigree,
  AddHealthCheckInput,
  AddVaccinationInput,
  PuppyApiResponse,
  PuppiesApiResponse
} from './types/puppy'
export { 
  PuppyGender, 
  PuppyBreed, 
  PuppyStatus,
  PUPPY_GENDER_LABELS,
  PUPPY_BREED_LABELS,
  PUPPY_STATUS_LABELS,
  PUPPY_COLOR_LABELS
} from './types/puppy'
export type { PuppyColor } from './types/puppy'

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