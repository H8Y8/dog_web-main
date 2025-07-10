// ===============================================
// 幼犬相關 TypeScript 類型定義
// ===============================================

/**
 * 幼犬性別枚舉
 */
export enum PuppyGender {
  MALE = 'male',
  FEMALE = 'female'
}

/**
 * 幼犬品種枚舉（常見蘇格蘭梗相關品種）
 */
export enum PuppyBreed {
  SCOTTISH_TERRIER = 'scottish_terrier',
  WEST_HIGHLAND_WHITE = 'west_highland_white',
  CAIRN_TERRIER = 'cairn_terrier',
  SKYE_TERRIER = 'skye_terrier',
  MIXED = 'mixed'
}

/**
 * 幼犬可用狀態枚舉
 */
export enum PuppyStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  NOT_FOR_SALE = 'not_for_sale'
}

/**
 * 幼犬毛色類型
 */
export type PuppyColor = 
  | 'black'
  | 'wheaten'
  | 'brindle'
  | 'red'
  | 'silver'
  | 'cream'
  | 'mixed';

/**
 * 健康檢查記錄介面
 */
export interface HealthCheck {
  date: string; // ISO date string
  type: string; // 檢查類型：疫苗、體檢、晶片等
  result: string; // 檢查結果
  vet_name?: string; // 獸醫師姓名
  notes?: string; // 額外備註
  certificate_url?: string; // 證明文件URL
}

/**
 * 疫苗記錄介面
 */
export interface VaccinationRecord {
  date: string; // 接種日期
  vaccine_type: string; // 疫苗類型
  batch_number?: string; // 批號
  next_due_date?: string; // 下次接種日期
  vet_name?: string; // 獸醫師姓名
  certificate_url?: string; // 疫苗證書URL
}

/**
 * 血統資訊介面
 */
export interface PuppyPedigree {
  sire_name?: string; // 父犬名稱
  sire_registration?: string; // 父犬註冊號
  dam_name?: string; // 母犬名稱
  dam_registration?: string; // 母犬註冊號
  registration_number?: string; // 幼犬註冊號
  kennel_name?: string; // 犬舍名稱
  breeder_name?: string; // 繁殖者姓名
  champion_bloodline?: boolean; // 是否有冠軍血統
}

/**
 * 幼犬完整介面
 */
export interface Puppy {
  id: string;
  
  // 基本資訊
  name: string;
  breed: PuppyBreed;
  birth_date: string; // ISO date string
  gender: PuppyGender;
  color: PuppyColor;
  
  // 描述和特徵
  description?: string;
  personality_traits?: string;
  
  // 狀態和價格
  status: PuppyStatus;
  price?: number;
  currency?: string; // 預設 'TWD'
  
  // 健康和血統
  microchip_id?: string; // 晶片號碼
  health_checks: HealthCheck[];
  vaccination_records: VaccinationRecord[];
  pedigree_info?: PuppyPedigree;
  
  // 照片和文件
  cover_image?: string; // 主要照片
  images: string[]; // 照片集
  pedigree_documents: string[]; // 血統證書文件
  health_certificates: string[]; // 健康證明文件
  
  // 體重記錄（可選）
  birth_weight?: number; // 出生體重（公克）
  current_weight?: number; // 當前體重（公克）
  expected_adult_weight?: number; // 預期成犬體重（公斤）
  
  // 時間戳記
  created_at: string;
  updated_at: string;
}

/**
 * 新建幼犬的輸入介面
 */
export interface CreatePuppyInput {
  name: string;
  breed: PuppyBreed;
  birth_date: string;
  gender: PuppyGender;
  color: PuppyColor;
  description?: string;
  personality_traits?: string;
  status?: PuppyStatus;
  price?: number;
  currency?: string;
  microchip_id?: string;
  birth_weight?: number;
  expected_adult_weight?: number;
  pedigree_info?: PuppyPedigree;
}

/**
 * 更新幼犬的輸入介面
 */
export interface UpdatePuppyInput {
  name?: string;
  breed?: PuppyBreed;
  birth_date?: string;
  gender?: PuppyGender;
  color?: PuppyColor;
  description?: string;
  personality_traits?: string;
  status?: PuppyStatus;
  price?: number;
  currency?: string;
  microchip_id?: string;
  current_weight?: number;
  expected_adult_weight?: number;
  pedigree_info?: PuppyPedigree;
  cover_image?: string;
  images?: string[];
  pedigree_documents?: string[];
  health_certificates?: string[];
}

/**
 * 幼犬查詢過濾器
 */
export interface PuppyFilter {
  status?: PuppyStatus;
  breed?: PuppyBreed;
  gender?: PuppyGender;
  color?: PuppyColor;
  min_price?: number;
  max_price?: number;
  birth_date_from?: string;
  birth_date_to?: string;
  search?: string; // 搜尋名字或描述
}

/**
 * 幼犬列表回應
 */
export interface PuppiesResponse {
  puppies: Puppy[];
  total: number;
  page: number;
  limit: number;
  filters?: PuppyFilter;
}

/**
 * 健康記錄輸入介面
 */
export interface AddHealthCheckInput {
  puppy_id: string;
  date: string;
  type: string;
  result: string;
  vet_name?: string;
  notes?: string;
}

/**
 * 疫苗記錄輸入介面
 */
export interface AddVaccinationInput {
  puppy_id: string;
  date: string;
  vaccine_type: string;
  batch_number?: string;
  next_due_date?: string;
  vet_name?: string;
}

/**
 * API 回應介面
 */
export interface PuppyApiResponse {
  success: boolean;
  data?: Puppy;
  message?: string;
  error?: string;
}

export interface PuppiesApiResponse {
  success: boolean;
  data?: PuppiesResponse;
  message?: string;
  error?: string;
}

/**
 * 性別顯示文字對應
 */
export const PUPPY_GENDER_LABELS: Record<PuppyGender, string> = {
  [PuppyGender.MALE]: '公',
  [PuppyGender.FEMALE]: '母'
};

/**
 * 品種顯示文字對應
 */
export const PUPPY_BREED_LABELS: Record<PuppyBreed, string> = {
  [PuppyBreed.SCOTTISH_TERRIER]: '蘇格蘭梗',
  [PuppyBreed.WEST_HIGHLAND_WHITE]: '西高地白梗',
  [PuppyBreed.CAIRN_TERRIER]: '凱恩梗',
  [PuppyBreed.SKYE_TERRIER]: '斯凱梗',
  [PuppyBreed.MIXED]: '混血'
};

/**
 * 狀態顯示文字對應
 */
export const PUPPY_STATUS_LABELS: Record<PuppyStatus, string> = {
  [PuppyStatus.AVAILABLE]: '可預約',
  [PuppyStatus.RESERVED]: '已預約',
  [PuppyStatus.SOLD]: '已售出',
  [PuppyStatus.NOT_FOR_SALE]: '非售品'
};

/**
 * 毛色顯示文字對應
 */
export const PUPPY_COLOR_LABELS: Record<PuppyColor, string> = {
  'black': '黑色',
  'wheaten': '小麥色',
  'brindle': '虎斑',
  'red': '紅色',
  'silver': '銀色',
  'cream': '奶油色',
  'mixed': '混色'
}; 