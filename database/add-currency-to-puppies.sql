-- ===============================================
-- 添加 currency 欄位到 puppies 表格
-- 修復前端更新幼犬時找不到 currency 欄位的問題
-- ===============================================

-- 添加 currency 欄位，預設值為 TWD（台幣）
ALTER TABLE puppies 
ADD COLUMN currency VARCHAR(10) DEFAULT 'TWD';

-- 為所有現有記錄設定預設貨幣
UPDATE puppies 
SET currency = 'TWD' 
WHERE currency IS NULL;

-- 添加檢查約束確保貨幣代碼有效
ALTER TABLE puppies 
ADD CONSTRAINT puppies_currency_check 
CHECK (currency IN ('TWD', 'USD', 'EUR', 'JPY', 'CNY', 'HKD', 'SGD'));

-- 建立索引以提升查詢效能
CREATE INDEX puppies_currency_idx ON puppies(currency); 