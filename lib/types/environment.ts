// ===============================================
// 環境設施相關 TypeScript 類型定義
// ===============================================

/**
 * 環境類型枚舉
 */
export enum EnvironmentType {
  ACCOMMODATION = 'accommodation',    // 住宿區
  CLASSROOM = 'classroom',           // 教室
  PLAYGROUND = 'playground',         // 遊戲區
  TRANSPORT = 'transport',           // 接送車
  OTHER = 'other'                    // 其他
}

/**
 * 環境設施完整介面
 */
export interface Environment {
  id: string;
  
  // 基本資訊
  name: string;
  type: EnvironmentType;
  description?: string;
  
  // 照片分類
  cover_image?: string | null;    // 主要封面照片
  images: string[];               // 一般照片集
  equipment_images?: string[];    // 設備照片
  detail_images?: string[];       // 細節照片
  
  // 設施特色
  features: string[];    // 設施特色
  
  // 時間戳記
  created_at: string;
  updated_at: string;
}

/**
 * 新建環境設施的輸入介面
 */
export interface CreateEnvironmentInput {
  name: string;
  type: EnvironmentType;
  description?: string;
  features: string[];
}

/**
 * 更新環境設施的輸入介面
 */
export interface UpdateEnvironmentInput {
  name?: string;
  type?: EnvironmentType;
  description?: string;
  images?: string[];
  features?: string[];
}

/**
 * 環境設施查詢過濾器
 */
export interface EnvironmentFilter {
  type?: EnvironmentType;
  search?: string; // 搜尋名稱或描述
}

/**
 * 環境設施列表回應
 */
export interface EnvironmentsResponse {
  environments: Environment[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 環境照片類型枚舉
 */
export type EnvironmentPhotoType = 'cover' | 'album' | 'equipment' | 'details';

/**
 * 環境照片上傳介面
 */
export interface EnvironmentPhotoUpload {
  file: File;
  environment_id: string;
  type: EnvironmentPhotoType;
}

/**
 * 環境照片上傳回應
 */
export interface EnvironmentPhotoUploadResponse {
  url: string;
  type: EnvironmentPhotoType;
  environment: Environment;
}

/**
 * 環境照片上傳API回應
 */
export interface EnvironmentPhotoApiResponse {
  success: boolean;
  data?: EnvironmentPhotoUploadResponse;
  error?: string;
}

/**
 * 環境API回應
 */
export interface EnvironmentApiResponse {
  success: boolean;
  data?: Environment;
  message?: string;
  error?: string;
}

/**
 * 環境列表API回應
 */
export interface EnvironmentsApiResponse {
  success: boolean;
  data?: EnvironmentsResponse;
  message?: string;
  error?: string;
}

/**
 * 環境類型顯示文字對應
 */
export const ENVIRONMENT_TYPE_LABELS: Record<EnvironmentType, string> = {
  [EnvironmentType.ACCOMMODATION]: '住宿區',
  [EnvironmentType.CLASSROOM]: '教室',
  [EnvironmentType.PLAYGROUND]: '遊戲區',
  [EnvironmentType.TRANSPORT]: '接送車',
  [EnvironmentType.OTHER]: '其他'
};

/**
 * 環境類型顏色對應（用於UI）
 */
export const ENVIRONMENT_TYPE_COLORS: Record<EnvironmentType, string> = {
  [EnvironmentType.ACCOMMODATION]: 'bg-blue-100 text-blue-800',
  [EnvironmentType.CLASSROOM]: 'bg-green-100 text-green-800',
  [EnvironmentType.PLAYGROUND]: 'bg-orange-100 text-orange-800',
  [EnvironmentType.TRANSPORT]: 'bg-purple-100 text-purple-800',
  [EnvironmentType.OTHER]: 'bg-gray-100 text-gray-800'
};

/**
 * 環境類型圖標對應
 */
export const ENVIRONMENT_TYPE_ICONS: Record<EnvironmentType, string> = {
  [EnvironmentType.ACCOMMODATION]: '🏠',
  [EnvironmentType.CLASSROOM]: '📚',
  [EnvironmentType.PLAYGROUND]: '🎮',
  [EnvironmentType.TRANSPORT]: '🚐',
  [EnvironmentType.OTHER]: '📍'
};

/**
 * 環境照片類型標籤
 */
export const ENVIRONMENT_PHOTO_TYPE_LABELS: Record<EnvironmentPhotoType, string> = {
  cover: '封面照片',
  album: '環境照片',
  equipment: '設備照片',
  details: '細節照片'
};

/**
 * 環境照片類型說明
 */
export const ENVIRONMENT_PHOTO_TYPE_DESCRIPTIONS: Record<EnvironmentPhotoType, string> = {
  cover: '用作主要展示的封面圖片',
  album: '展示環境整體外觀和氛圍',
  equipment: '展示設備、器材和設施',
  details: '展示特殊細節和重點特色'
};

/**
 * 常用設施特色選項
 */
export const COMMON_FEATURES = [
  '空調設備',
  '安全監控',
  '清潔衛生',
  '寬敞舒適',
  '專業設備',
  '遮陽設施',
  '防滑地面',
  '圍欄安全',
  '照明充足',
  '通風良好',
  '溫度控制',
  '噪音隔離'
] as const;

export type CommonFeature = typeof COMMON_FEATURES[number]; 