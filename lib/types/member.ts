// ===============================================
// 狗隻成員相關 TypeScript 類型定義
// ===============================================

/**
 * 狗隻角色枚舉
 */
export enum MemberRole {
  BREEDING_MALE = 'breeding_male',
  BREEDING_FEMALE = 'breeding_female',
  RETIRED = 'retired',
  TRAINING = 'training',
  CHAMPION = 'champion',
  PUPPY_PARENT = 'puppy_parent',
  COMPANION = 'companion'
}

/**
 * 狗隻狀態枚舉
 */
export enum MemberStatus {
  ACTIVE = 'active',
  RETIRED = 'retired',
  DECEASED = 'deceased',
  ON_LOAN = 'on_loan',
  TEMPORARY = 'temporary'
}

/**
 * 性別枚舉
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

/**
 * 血統資訊介面
 */
export interface PedigreeInfo {
  父親?: string;
  母親?: string;
  血統登記號?: string;
  繁殖者?: string;
  出生地?: string;
  [key: string]: any;
}

/**
 * 健康記錄介面
 */
export interface HealthRecord {
  最後檢查?: string;
  疫苗?: string;
  健康狀況?: string;
  繁殖記錄?: string;
  醫療史?: string[];
  [key: string]: any;
}

/**
 * 成就記錄介面
 */
export interface Achievement {
  title: string;
  description?: string;
  date?: string; // ISO date string
  type?: string; // 競賽類型或成就類別
}

/**
 * 狗隻成員完整介面
 */
export interface Member {
  id: string;
  
  // 基本資訊
  name: string;
  breed: string;
  birth_date: string; // ISO date string
  gender: Gender;
  color: string;
  
  // 角色和狀態
  role: MemberRole;
  status: MemberStatus;
  
  // 詳細資訊
  description?: string;
  personality_traits?: string;
  
  // JSON 資料
  pedigree_info: PedigreeInfo;
  health_records: HealthRecord;
  achievements: Achievement[];
  
  // 照片和文件
  avatar_url?: string;
  album_urls: string[];
  pedigree_urls: string[];
  health_check_urls: string[];
  
  // 時間戳記
  created_at: string;
  updated_at: string;
}

/**
 * 新建狗隻成員的輸入介面
 */
export interface CreateMemberInput {
  name: string;
  breed?: string;
  birth_date: string;
  gender: Gender;
  color: string;
  role: MemberRole;
  status?: MemberStatus;
  description?: string;
  personality_traits?: string;
  pedigree_info?: PedigreeInfo;
  health_records?: HealthRecord;
  achievements?: Achievement[];
}

/**
 * 更新狗隻成員的輸入介面
 */
export interface UpdateMemberInput {
  name?: string;
  breed?: string;
  birth_date?: string;
  gender?: Gender;
  color?: string;
  role?: MemberRole;
  status?: MemberStatus;
  description?: string;
  personality_traits?: string;
  pedigree_info?: PedigreeInfo;
  health_records?: HealthRecord;
  achievements?: Achievement[];
  avatar_url?: string;
  album_urls?: string[];
  pedigree_urls?: string[];
  health_check_urls?: string[];
}

/**
 * 成員查詢過濾器
 */
export interface MemberFilter {
  role?: MemberRole;
  status?: MemberStatus;
  gender?: Gender;
  breed?: string;
  search?: string; // 搜尋名字或描述
}

/**
 * 成員列表回應
 */
export interface MembersResponse {
  members: Member[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 照片上傳類型
 */
export enum PhotoType {
  AVATAR = 'avatar',
  ALBUM = 'album',
  PEDIGREE = 'pedigree',
  HEALTH_CHECK = 'health_check'
}

/**
 * 照片上傳介面
 */
export interface PhotoUpload {
  file: File;
  type: PhotoType;
  member_id: string;
}

/**
 * 照片上傳回應
 */
export interface PhotoUploadResponse {
  url: string;
  type: PhotoType;
  filename: string;
}

/**
 * 角色顯示文字對應
 */
export const ROLE_LABELS: Record<MemberRole, string> = {
  [MemberRole.BREEDING_MALE]: '種公',
  [MemberRole.BREEDING_FEMALE]: '種母',
  [MemberRole.RETIRED]: '退休犬',
  [MemberRole.TRAINING]: '訓練中',
  [MemberRole.CHAMPION]: '冠軍犬',
  [MemberRole.PUPPY_PARENT]: '幼犬父母',
  [MemberRole.COMPANION]: '陪伴犬'
};

/**
 * 狀態顯示文字對應
 */
export const STATUS_LABELS: Record<MemberStatus, string> = {
  [MemberStatus.ACTIVE]: '活躍',
  [MemberStatus.RETIRED]: '退休',
  [MemberStatus.DECEASED]: '已故',
  [MemberStatus.ON_LOAN]: '外借',
  [MemberStatus.TEMPORARY]: '暫時'
};

/**
 * 性別顯示文字對應
 */
export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: '公',
  [Gender.FEMALE]: '母'
}; 