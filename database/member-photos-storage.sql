-- ===============================================
-- Member Photos Storage 配置
-- ===============================================

-- 創建 member_photos Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'member_photos',
    'member_photos',
    true,
    5242880, -- 5MB 檔案大小限制
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- ===============================================
-- Storage RLS 政策
-- ===============================================

-- 允許已認證用戶讀取所有 member_photos
CREATE POLICY "Allow authenticated users to read member photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'member_photos');

-- 允許已認證用戶上傳 member_photos
CREATE POLICY "Allow authenticated users to upload member photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member_photos');

-- 允許已認證用戶更新自己的 member_photos
CREATE POLICY "Allow authenticated users to update member photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'member_photos')
WITH CHECK (bucket_id = 'member_photos');

-- 允許已認證用戶刪除 member_photos
CREATE POLICY "Allow authenticated users to delete member photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'member_photos');

-- ===============================================
-- 建立檔案命名和路徑規則的說明
-- ===============================================

/* 
檔案路徑結構：
{memberId}/{type}/{uuid}.{extension}

其中：
- memberId: 狗隻成員的 UUID
- type: 照片類型 (avatar, album, pedigree, health_check)
- uuid: 檔案的唯一識別碼
- extension: 檔案副檔名 (jpg, png, webp, gif)

範例：
- /123e4567-e89b-12d3-a456-426614174000/avatar/abc123.jpg
- /123e4567-e89b-12d3-a456-426614174000/album/def456.png
- /123e4567-e89b-12d3-a456-426614174000/pedigree/ghi789.pdf (文件)
- /123e4567-e89b-12d3-a456-426614174000/health_check/jkl012.jpg
*/ 