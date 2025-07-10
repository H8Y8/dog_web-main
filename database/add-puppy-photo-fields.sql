-- ===============================================
-- 添加幼犬照片管理功能所需的欄位
-- 修復 "Could not find the 'cover_image' column" 錯誤
-- ===============================================

-- 檢查當前表格結構
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'puppies' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===============================================
-- 添加缺少的照片欄位
-- ===============================================

-- 1. 添加主要照片欄位 (cover_image) - 單個URL
ALTER TABLE puppies ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- 2. 添加血統證書欄位 (pedigree_documents) - URL陣列
ALTER TABLE puppies ADD COLUMN IF NOT EXISTS pedigree_documents TEXT[] DEFAULT '{}';

-- 3. 添加健康證明欄位 (health_certificates) - URL陣列  
ALTER TABLE puppies ADD COLUMN IF NOT EXISTS health_certificates TEXT[] DEFAULT '{}';

-- 4. 檢查 images 欄位是否存在（相簿照片）
-- 如果不存在則添加
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'puppies' 
        AND column_name = 'images'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE puppies ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- ===============================================
-- 添加健康相關陣列欄位（API中使用）
-- ===============================================

-- 5. 添加健康檢查記錄欄位
ALTER TABLE puppies ADD COLUMN IF NOT EXISTS health_checks TEXT[] DEFAULT '{}';

-- 6. 添加疫苗記錄欄位
ALTER TABLE puppies ADD COLUMN IF NOT EXISTS vaccination_records TEXT[] DEFAULT '{}';

-- ===============================================
-- 添加註解說明
-- ===============================================

COMMENT ON COLUMN puppies.cover_image IS '主要照片URL - 單張封面照片';
COMMENT ON COLUMN puppies.images IS '相簿照片URL陣列 - 多張展示照片';
COMMENT ON COLUMN puppies.pedigree_documents IS '血統證書文件URL陣列';
COMMENT ON COLUMN puppies.health_certificates IS '健康證明文件URL陣列';
COMMENT ON COLUMN puppies.health_checks IS '健康檢查記錄陣列';
COMMENT ON COLUMN puppies.vaccination_records IS '疫苗接種記錄陣列';

-- ===============================================
-- 驗證欄位添加結果
-- ===============================================

-- 查詢新增欄位確認
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'puppies' 
AND table_schema = 'public'
AND column_name IN (
    'cover_image', 
    'images', 
    'pedigree_documents', 
    'health_certificates',
    'health_checks',
    'vaccination_records'
)
ORDER BY column_name;

-- 測試查詢 - 確保新欄位可以正常使用
SELECT 
    id, 
    name,
    cover_image,
    images,
    pedigree_documents,
    health_certificates,
    health_checks,
    vaccination_records
FROM puppies 
LIMIT 1;

-- ===============================================
-- 照片類型對應說明
-- ===============================================

/*
API 照片類型映射到資料庫欄位：

1. 'cover' → cover_image (TEXT)
   - 主要照片，單個URL字符串
   - 用於卡片顯示和主要展示

2. 'album' → images (TEXT[])
   - 相簿照片，URL陣列
   - 用於照片輪播和相簿展示

3. 'pedigree' → pedigree_documents (TEXT[])
   - 血統證書文件，URL陣列
   - 用於血統認證展示

4. 'health_check' → health_certificates (TEXT[])
   - 健康證明文件，URL陣列
   - 用於健康狀況證明

額外的健康資料欄位：
- health_checks: 健康檢查記錄
- vaccination_records: 疫苗接種記錄

檔案儲存路徑格式：
{puppyId}/{photoType}/{uuid}.{extension}

範例：
- 69290679-38ec-4ba5-a635-a2724264a601/cover/b1c30f78.png
- 69290679-38ec-4ba5-a635-a2724264a601/album/c2d40g89.jpg
- 69290679-38ec-4ba5-a635-a2724264a601/pedigree/d3e51h90.pdf
- 69290679-38ec-4ba5-a635-a2724264a601/health_check/e4f62i01.jpg
*/ 