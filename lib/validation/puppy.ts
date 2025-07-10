import { CreatePuppyInput, UpdatePuppyInput, PuppyGender, PuppyBreed, PuppyStatus, PuppyColor } from '../types/puppy'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * 幼犬表單驗證工具
 */
export class PuppyValidator {
  
  /**
   * 驗證新增幼犬的資料
   */
  static validateCreateInput(data: CreatePuppyInput): ValidationResult {
    const errors: ValidationError[] = []
    
    // 名稱驗證
    if (!data.name || data.name.trim().length === 0) {
      errors.push({ field: 'name', message: '請輸入幼犬名稱' })
    } else if (data.name.trim().length < 2) {
      errors.push({ field: 'name', message: '幼犬名稱至少需要 2 個字元' })
    } else if (data.name.trim().length > 50) {
      errors.push({ field: 'name', message: '幼犬名稱不能超過 50 個字元' })
    } else if (!/^[a-zA-Z\u4e00-\u9fa5\s\-\.]+$/.test(data.name.trim())) {
      errors.push({ field: 'name', message: '幼犬名稱只能包含中文、英文、空格、連字號和點號' })
    }
    
    // 品種驗證
    if (!data.breed) {
      errors.push({ field: 'breed', message: '請選擇幼犬品種' })
    } else if (!Object.values(PuppyBreed).includes(data.breed)) {
      errors.push({ field: 'breed', message: '請選擇有效的幼犬品種' })
    }
    
    // 出生日期驗證
    if (!data.birth_date) {
      errors.push({ field: 'birth_date', message: '請選擇出生日期' })
    } else {
      const birthDate = new Date(data.birth_date)
      const today = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(today.getFullYear() - 1)
      
      if (isNaN(birthDate.getTime())) {
        errors.push({ field: 'birth_date', message: '請輸入有效的出生日期' })
      } else if (birthDate > today) {
        errors.push({ field: 'birth_date', message: '出生日期不能是未來的日期' })
      } else if (birthDate < oneYearAgo) {
        errors.push({ field: 'birth_date', message: '出生日期不能超過一年前（幼犬年齡限制）' })
      }
    }
    
    // 性別驗證
    if (!data.gender) {
      errors.push({ field: 'gender', message: '請選擇幼犬性別' })
    } else if (!Object.values(PuppyGender).includes(data.gender)) {
      errors.push({ field: 'gender', message: '請選擇有效的幼犬性別' })
    }
    
    // 毛色驗證
    if (!data.color) {
      errors.push({ field: 'color', message: '請選擇幼犬毛色' })
    } else {
      const validColors: PuppyColor[] = ['black', 'wheaten', 'brindle', 'red', 'silver', 'cream', 'mixed']
      if (!validColors.includes(data.color as PuppyColor)) {
        errors.push({ field: 'color', message: '請選擇有效的幼犬毛色' })
      }
    }
    
    // 狀態驗證
    if (data.status && !Object.values(PuppyStatus).includes(data.status)) {
      errors.push({ field: 'status', message: '請選擇有效的幼犬狀態' })
    }
    
    // 價格驗證
    if (data.price !== undefined) {
      if (data.price < 0) {
        errors.push({ field: 'price', message: '價格不能是負數' })
      } else if (data.price > 1000000) {
        errors.push({ field: 'price', message: '價格不能超過 1,000,000 元' })
      } else if (!Number.isInteger(data.price)) {
        errors.push({ field: 'price', message: '價格必須是整數' })
      }
    }
    
    // 體重驗證
    if (data.birth_weight !== undefined) {
      if (data.birth_weight < 0) {
        errors.push({ field: 'birth_weight', message: '出生體重不能是負數' })
      } else if (data.birth_weight > 1000) {
        errors.push({ field: 'birth_weight', message: '出生體重不能超過 1000 公克' })
      }
    }
    
    if (data.expected_adult_weight !== undefined) {
      if (data.expected_adult_weight < 0) {
        errors.push({ field: 'expected_adult_weight', message: '預期成犬體重不能是負數' })
      } else if (data.expected_adult_weight > 50) {
        errors.push({ field: 'expected_adult_weight', message: '預期成犬體重不能超過 50 公斤' })
      }
    }
    
    // 晶片號碼驗證
    if (data.microchip_id && data.microchip_id.trim().length > 0) {
      const microchipId = data.microchip_id.trim()
      if (microchipId.length !== 15 || !/^\d{15}$/.test(microchipId)) {
        errors.push({ field: 'microchip_id', message: '晶片號碼必須是 15 位數字' })
      }
    }
    
    // 描述長度驗證
    if (data.description && data.description.length > 1000) {
      errors.push({ field: 'description', message: '描述不能超過 1000 個字元' })
    }
    
    if (data.personality_traits && data.personality_traits.length > 500) {
      errors.push({ field: 'personality_traits', message: '性格特徵不能超過 500 個字元' })
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  /**
   * 驗證更新幼犬的資料
   */
  static validateUpdateInput(data: UpdatePuppyInput): ValidationResult {
    const errors: ValidationError[] = []
    
    // 名稱驗證（如果提供）
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        errors.push({ field: 'name', message: '請輸入幼犬名稱' })
      } else if (data.name.trim().length < 2) {
        errors.push({ field: 'name', message: '幼犬名稱至少需要 2 個字元' })
      } else if (data.name.trim().length > 50) {
        errors.push({ field: 'name', message: '幼犬名稱不能超過 50 個字元' })
      } else if (!/^[a-zA-Z\u4e00-\u9fa5\s\-\.]+$/.test(data.name.trim())) {
        errors.push({ field: 'name', message: '幼犬名稱只能包含中文、英文、空格、連字號和點號' })
      }
    }
    
    // 品種驗證（如果提供）
    if (data.breed !== undefined && !Object.values(PuppyBreed).includes(data.breed)) {
      errors.push({ field: 'breed', message: '請選擇有效的幼犬品種' })
    }
    
    // 出生日期驗證（如果提供）
    if (data.birth_date !== undefined) {
      const birthDate = new Date(data.birth_date)
      const today = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(today.getFullYear() - 1)
      
      if (isNaN(birthDate.getTime())) {
        errors.push({ field: 'birth_date', message: '請輸入有效的出生日期' })
      } else if (birthDate > today) {
        errors.push({ field: 'birth_date', message: '出生日期不能是未來的日期' })
      } else if (birthDate < oneYearAgo) {
        errors.push({ field: 'birth_date', message: '出生日期不能超過一年前（幼犬年齡限制）' })
      }
    }
    
    // 性別驗證（如果提供）
    if (data.gender !== undefined && !Object.values(PuppyGender).includes(data.gender)) {
      errors.push({ field: 'gender', message: '請選擇有效的幼犬性別' })
    }
    
    // 毛色驗證（如果提供）
    if (data.color !== undefined) {
      const validColors: PuppyColor[] = ['black', 'wheaten', 'brindle', 'red', 'silver', 'cream', 'mixed']
      if (!validColors.includes(data.color as PuppyColor)) {
        errors.push({ field: 'color', message: '請選擇有效的幼犬毛色' })
      }
    }
    
    // 狀態驗證（如果提供）
    if (data.status !== undefined && !Object.values(PuppyStatus).includes(data.status)) {
      errors.push({ field: 'status', message: '請選擇有效的幼犬狀態' })
    }
    
    // 價格驗證（如果提供）
    if (data.price !== undefined) {
      if (data.price < 0) {
        errors.push({ field: 'price', message: '價格不能是負數' })
      } else if (data.price > 1000000) {
        errors.push({ field: 'price', message: '價格不能超過 1,000,000 元' })
      } else if (!Number.isInteger(data.price)) {
        errors.push({ field: 'price', message: '價格必須是整數' })
      }
    }
    
    // 體重驗證（如果提供）
    if (data.current_weight !== undefined) {
      if (data.current_weight < 0) {
        errors.push({ field: 'current_weight', message: '當前體重不能是負數' })
      } else if (data.current_weight > 10000) {
        errors.push({ field: 'current_weight', message: '當前體重不能超過 10000 公克' })
      }
    }
    
    if (data.expected_adult_weight !== undefined) {
      if (data.expected_adult_weight < 0) {
        errors.push({ field: 'expected_adult_weight', message: '預期成犬體重不能是負數' })
      } else if (data.expected_adult_weight > 50) {
        errors.push({ field: 'expected_adult_weight', message: '預期成犬體重不能超過 50 公斤' })
      }
    }
    
    // 晶片號碼驗證（如果提供）
    if (data.microchip_id !== undefined && data.microchip_id.trim().length > 0) {
      const microchipId = data.microchip_id.trim()
      if (microchipId.length !== 15 || !/^\d{15}$/.test(microchipId)) {
        errors.push({ field: 'microchip_id', message: '晶片號碼必須是 15 位數字' })
      }
    }
    
    // 描述長度驗證（如果提供）
    if (data.description !== undefined && data.description.length > 1000) {
      errors.push({ field: 'description', message: '描述不能超過 1000 個字元' })
    }
    
    if (data.personality_traits !== undefined && data.personality_traits.length > 500) {
      errors.push({ field: 'personality_traits', message: '性格特徵不能超過 500 個字元' })
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  /**
   * 驗證業務邏輯規則
   */
  static validateBusinessRules(data: CreatePuppyInput | UpdatePuppyInput): ValidationResult {
    const errors: ValidationError[] = []
    
    // 如果設定為已售出，應該有價格
    if (data.status === PuppyStatus.SOLD && (!data.price || data.price <= 0)) {
      errors.push({ field: 'price', message: '已售出的幼犬必須設定有效價格' })
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  /**
   * 驗證 status 和 available 的邏輯一致性
   */
  static validateStatusConsistency(data: { status?: PuppyStatus }): ValidationResult {
    const errors: ValidationError[] = []

    // 移除 available 欄位相關的驗證邏輯，只使用 status 欄位
    // status 欄位本身的有效性已由 schema 驗證保證

    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  /**
   * 完整驗證（結合所有驗證規則）
   */
  static validateComplete(data: CreatePuppyInput): ValidationResult {
    const basicValidation = this.validateCreateInput(data)
    const businessValidation = this.validateBusinessRules(data)
    
    return {
      isValid: basicValidation.isValid && businessValidation.isValid,
      errors: [...basicValidation.errors, ...businessValidation.errors]
    }
  }
  
  /**
   * 完整更新驗證（結合所有驗證規則）
   */
  static validateUpdateComplete(data: UpdatePuppyInput): ValidationResult {
    const basicValidation = this.validateUpdateInput(data)
    const businessValidation = this.validateBusinessRules(data)
    
    return {
      isValid: basicValidation.isValid && businessValidation.isValid,
      errors: [...basicValidation.errors, ...businessValidation.errors]
    }
  }
}

/**
 * 工具函數：根據欄位名稱獲取中文標籤
 */
export function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    name: '名稱',
    breed: '品種',
    birth_date: '出生日期',
    gender: '性別',
    color: '毛色',
    description: '描述',
    personality_traits: '性格特徵',
    status: '狀態',
    price: '價格',
    currency: '貨幣',
    microchip_id: '晶片號碼',
    birth_weight: '出生體重',
    current_weight: '當前體重',
    expected_adult_weight: '預期成犬體重'
  }
  
  return labels[field] || field
}

/**
 * 工具函數：格式化驗證錯誤訊息
 */
export function formatValidationErrors(errors: ValidationError[]): Record<string, string> {
  const formatted: Record<string, string> = {}
  
  errors.forEach(error => {
    formatted[error.field] = error.message
  })
  
  return formatted
} 

/**
 * 欄位標籤對照（用於錯誤訊息）
 */
export const FIELD_LABELS: Record<string, string> = {
  name: '名稱',
  breed: '品種',
  birth_date: '出生日期',
  gender: '性別',
  color: '毛色',
  description: '描述',
  personality_traits: '個性特徵',
  status: '狀態',
  price: '價格',
  currency: '貨幣',
  microchip_id: '晶片號碼',
  birth_weight: '出生體重',
  current_weight: '當前體重',
  expected_adult_weight: '預期成犬體重',
  cover_image: '主要照片',
  images: '照片集',
  pedigree_documents: '血統證書',
  health_certificates: '健康證明'
} 