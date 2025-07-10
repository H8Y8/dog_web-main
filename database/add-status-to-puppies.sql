-- ===============================================
-- 添加 status 欄位到 puppies 表格
-- 修復前端更新幼犬時找不到 status 欄位的問題
-- 解決雙重狀態設計不一致問題
-- ===============================================

-- 添加 status 欄位，預設值為 'available'（可預約）
ALTER TABLE puppies 
ADD COLUMN status VARCHAR(20) DEFAULT 'available';

-- 設定現有記錄的 status 值，根據 available 欄位判斷
UPDATE puppies 
SET status = CASE 
    WHEN available = true THEN 'available'
    WHEN available = false THEN 'not_for_sale'
    ELSE 'available'
END;

-- 添加檢查約束確保狀態值有效
ALTER TABLE puppies 
ADD CONSTRAINT puppies_status_check 
CHECK (status IN ('available', 'reserved', 'sold', 'not_for_sale'));

-- 建立索引以提升查詢效能
CREATE INDEX puppies_status_idx ON puppies(status);

-- ===============================================
-- 邏輯關係說明
-- ===============================================
/*
兩個欄位的關係邏輯：

1. available (BOOLEAN) - 簡化的可預約開關
   - true: 一般可預約狀態
   - false: 不可預約（可能已售出、預約、或非賣品）

2. status (VARCHAR) - 詳細的狀態描述
   - 'available': 可預約
   - 'reserved': 已預約
   - 'sold': 已售出
   - 'not_for_sale': 非售品

建議的更新邏輯：
- 當 status = 'available' 時，available = true
- 當 status 為其他值時，available = false

這樣可以保持向後相容性，同時提供更精確的狀態管理。
*/ 