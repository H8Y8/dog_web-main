-- =============================================
-- 環境設施照片系統遷移
-- =============================================

-- 1. 更新environments表，添加照片相關欄位
ALTER TABLE environments
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS equipment_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS detail_images TEXT[] DEFAULT '{}';

-- 2. 創建環境照片storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('environment-photos', 'environment-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. 設置環境照片storage的RLS政策
-- 允許已認證用戶查看所有環境照片
CREATE POLICY "Anyone can view environment photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'environment-photos');

-- 允許已認證的管理員上傳環境照片
CREATE POLICY "Authenticated users can upload environment photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'environment-photos' 
    AND auth.role() = 'authenticated'
  );

-- 允許已認證的管理員更新環境照片
CREATE POLICY "Authenticated users can update environment photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'environment-photos' 
    AND auth.role() = 'authenticated'
  ) WITH CHECK (
    bucket_id = 'environment-photos' 
    AND auth.role() = 'authenticated'
  );

-- 允許已認證的管理員刪除環境照片
CREATE POLICY "Authenticated users can delete environment photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'environment-photos' 
    AND auth.role() = 'authenticated'
  );

-- 4. 更新environments表的RLS政策（如果需要）
-- 這些政策應該已經從之前的遷移中存在，這裡僅作為參考

-- 確保更新操作包含新的照片欄位
DROP POLICY IF EXISTS "Authenticated users can update environments" ON environments;
CREATE POLICY "Authenticated users can update environments" ON environments
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 5. 添加註釋說明新欄位的用途
COMMENT ON COLUMN environments.cover_image IS '環境主要封面照片URL';
COMMENT ON COLUMN environments.equipment_images IS '設備照片URL陣列';
COMMENT ON COLUMN environments.detail_images IS '細節照片URL陣列';

-- 6. 創建索引以提高查詢性能（可選）
CREATE INDEX IF NOT EXISTS idx_environments_cover_image ON environments(cover_image) WHERE cover_image IS NOT NULL; 