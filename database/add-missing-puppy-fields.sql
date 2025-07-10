-- ===============================================
-- 添加缺少的 Puppy 欄位遷移
-- ===============================================

-- 添加性格特徵欄位
ALTER TABLE puppies ADD COLUMN personality_traits TEXT;

-- 添加當前體重欄位（以公克為單位）
ALTER TABLE puppies ADD COLUMN current_weight INTEGER;

-- 添加預期成犬體重欄位（以公克為單位，TypeScript 中會轉換成公斤顯示）
ALTER TABLE puppies ADD COLUMN expected_adult_weight INTEGER;

-- 添加出生體重欄位（以公克為單位）
ALTER TABLE puppies ADD COLUMN birth_weight INTEGER;

-- 添加晶片號碼欄位
ALTER TABLE puppies ADD COLUMN microchip_id VARCHAR(50);

-- 添加索引以提升查詢效能
CREATE INDEX puppies_microchip_id_idx ON puppies(microchip_id) WHERE microchip_id IS NOT NULL;

-- 添加約束條件確保重量值合理
ALTER TABLE puppies ADD CONSTRAINT check_birth_weight CHECK (birth_weight > 0 AND birth_weight < 10000);
ALTER TABLE puppies ADD CONSTRAINT check_current_weight CHECK (current_weight > 0 AND current_weight < 100000);
ALTER TABLE puppies ADD CONSTRAINT check_expected_adult_weight CHECK (expected_adult_weight > 0 AND expected_adult_weight < 100000); 