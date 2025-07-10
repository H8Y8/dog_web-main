-- ===============================================
-- 移除 available 欄位，簡化為只使用 status 狀態
-- 統一狀態管理，避免雙重狀態的複雜性
-- ===============================================

-- 首先確保 status 欄位已存在且有正確的約束
-- （這個遷移應該在 add-status-to-puppies.sql 之後執行）

-- 檢查 status 欄位是否存在
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'puppies' AND column_name = 'status'
    ) THEN
        RAISE EXCEPTION 'status 欄位不存在！請先執行 add-status-to-puppies.sql 遷移';
    END IF;
END $$;

-- 在移除 available 欄位前，確保所有記錄都有正確的 status 值
-- 將任何 NULL 的 status 設為 'available'
UPDATE puppies 
SET status = 'available' 
WHERE status IS NULL;

-- 移除 available 欄位的索引（如果存在）
DROP INDEX IF EXISTS puppies_available_idx;

-- 移除 available 欄位
ALTER TABLE puppies 
DROP COLUMN IF EXISTS available;

-- ===============================================
-- 簡化後的狀態邏輯說明
-- ===============================================
/*
移除 available 欄位後，只使用 status 欄位管理幼犬狀態：

status 值及其意義：
- 'available': 可預約
- 'reserved': 已預約
- 'sold': 已售出  
- 'not_for_sale': 非售品

前端邏輯調整：
1. 移除所有 available 相關的表單控制項
2. 只使用 status 下拉選單
3. 列表顯示邏輯：status === 'available' 表示可預約
4. 切換功能：在 'available' 和 'not_for_sale' 之間切換

API 調整：
1. 移除 available 欄位的處理
2. 更新 TypeScript 類型定義
3. 調整查詢邏輯使用 status 欄位
*/ 