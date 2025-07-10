-- ===============================================
-- Puppy Photos Storage 配置 (修正版)
-- 解決 RLS 政策問題
-- ===============================================

-- 創建 puppy-photos Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'puppy-photos',
    'puppy-photos',
    true,
    5242880, -- 5MB 檔案大小限制
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ===============================================
-- Storage RLS 政策 (修正版)
-- ===============================================

-- 刪除現有政策（如果存在）
DROP POLICY IF EXISTS "puppy_photos_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "puppy_photos_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "puppy_photos_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "puppy_photos_delete_policy" ON storage.objects;

-- 1. 允許所有人讀取 puppy-photos（公開讀取）
-- 修正：確保與member和post的政策一致
CREATE POLICY "puppy_photos_select_policy"
ON storage.objects FOR SELECT
USING (bucket_id = 'puppy-photos');

-- 2. 允許已認證用戶上傳到 puppy-photos
-- 修正：確保policy名稱不會衝突
CREATE POLICY "puppy_photos_insert_policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'puppy-photos');

-- 3. 允許已認證用戶更新 puppy-photos 檔案
-- 修正：添加適當的USING和WITH CHECK子句
CREATE POLICY "puppy_photos_update_policy"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'puppy-photos')
WITH CHECK (bucket_id = 'puppy-photos');

-- 4. 允許已認證用戶刪除 puppy-photos 檔案
-- 修正：確保policy完整性
CREATE POLICY "puppy_photos_delete_policy"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'puppy-photos');

-- ===============================================
-- 確保 RLS 已啟用
-- ===============================================

-- 確保 storage.objects 表格啟用 RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- 驗證政策和bucket設置
-- ===============================================

-- 查詢確認 bucket 是否成功創建
SELECT 
    id, 
    name, 
    public, 
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets 
WHERE id = 'puppy-photos';

-- 查詢確認 RLS 政策是否正確創建
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage' 
AND policyname LIKE '%puppy_photos%'
ORDER BY policyname;

-- ===============================================
-- 測試政策 (可選)
-- ===============================================

-- 檢查當前用戶權限
-- SELECT current_user, session_user, auth.uid();

-- 測試查詢 (應該可以看到bucket)
-- SELECT * FROM storage.buckets WHERE id = 'puppy-photos';

-- ===============================================
-- 檔案路徑結構說明
-- ===============================================

/* 
檔案路徑結構：
{puppyId}/{type}/{uuid}.{extension}

其中：
- puppyId: 幼犬的 UUID
- type: 照片類型 (cover, album, pedigree, health_check)
- uuid: 檔案的唯一識別碼
- extension: 檔案副檔名 (jpg, png, webp, gif)

照片類型說明：
- cover: 主要照片 (cover_image) - 單張
- album: 相簿照片 (images) - 多張
- pedigree: 血統證書文件 (pedigree_documents) - 多張
- health_check: 健康證明文件 (health_certificates) - 多張

範例路徑：
- /123e4567-e89b-12d3-a456-426614174000/cover/abc123.jpg
- /123e4567-e89b-12d3-a456-426614174000/album/def456.png
- /123e4567-e89b-12d3-a456-426614174000/pedigree/ghi789.jpg
- /123e4567-e89b-12d3-a456-426614174000/health_check/jkl012.webp

對應的數據庫欄位：
- cover_image: 存儲主要照片的單個URL
- images: 存儲相簿照片的URL陣列
- pedigree_documents: 存儲血統證書的URL陣列
- health_certificates: 存儲健康證明的URL陣列
*/

-- ===============================================
-- 故障排除指南
-- ===============================================

/*
如果遇到上傳問題，請檢查：

1. 確認 bucket 存在且為 public：
   SELECT * FROM storage.buckets WHERE id = 'puppy-photos';

2. 確認 RLS 政策存在：
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%puppy_photos%';

3. 確認用戶已認證：
   SELECT auth.uid() IS NOT NULL;

4. 檢查檔案大小和格式限制：
   - 最大 5MB
   - 支援格式：jpeg, png, webp, gif

5. 如果政策衝突，執行：
   DROP POLICY IF EXISTS "old_policy_name" ON storage.objects;
*/ 