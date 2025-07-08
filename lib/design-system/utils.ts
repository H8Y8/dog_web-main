import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合併和處理 className 的工具函數
 * 結合 clsx 和 tailwind-merge 的功能
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化像素值
 */
export function formatPixels(value: number): string {
  return `${value}px`;
}

/**
 * 格式化 rem 值
 */
export function formatRem(value: number): string {
  return `${value}rem`;
}

/**
 * 將十六進制顏色轉換為 RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 創建 CSS 變數名稱
 */
export function createCSSVariable(name: string): string {
  return `--${name}`;
}

/**
 * 獲取響應式斷點查詢
 */
export function getBreakpointQuery(breakpoint: string): string {
  return `@media (min-width: ${breakpoint})`;
}

/**
 * 深度合併對象
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  Object.keys(source).forEach(key => {
    if (source[key as keyof T] && typeof source[key as keyof T] === 'object' && !Array.isArray(source[key as keyof T])) {
      result[key as keyof T] = deepMerge(result[key as keyof T], source[key as keyof T] as any);
    } else {
      result[key as keyof T] = source[key as keyof T] as any;
    }
  });
  
  return result;
}

/**
 * 生成隨機 ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 延遲函數
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 防抖函數
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * 節流函數
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
} 