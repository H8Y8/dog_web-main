-- ===============================================
-- Member Avatars Storage 政策設置
-- 確保 member-avatars bucket 有正確的權限
-- ===============================================

-- 檢查並創建 member-avatars bucket（如果不存在）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'member-avatars',
    'member-avatars',
    true,
    5242880, -- 5MB 檔案大小限制
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ===============================================
-- Storage RLS 政策
-- ===============================================

-- 刪除現有政策（如果存在）
DROP POLICY IF EXISTS "member_avatars_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_delete_policy" ON storage.objects;

-- 1. 允許所有人讀取 member-avatars（公開讀取）
CREATE POLICY "member_avatars_select_policy"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-avatars');

-- 2. 允許已認證用戶上傳到 member-avatars
CREATE POLICY "member_avatars_insert_policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-avatars');

-- 3. 允許已認證用戶更新 member-avatars 檔案
CREATE POLICY "member_avatars_update_policy"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'member-avatars')
WITH CHECK (bucket_id = 'member-avatars');

-- 4. 允許已認證用戶刪除 member-avatars 檔案
CREATE POLICY "member_avatars_delete_policy"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'member-avatars');

-- ===============================================
-- 檢查政策是否正確創建
-- ===============================================

-- 查看 member-avatars bucket 資訊
SELECT 
    id, 
    name, 
    public, 
    file_size_limit,
    allowed_mime_types,
    created_at,
    updated_at
FROM storage.buckets 
WHERE id = 'member-avatars';

-- 查看 Storage 政策
SELECT 
    policyname, 
    cmd, 
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%member_avatars%'
ORDER BY policyname;

-- ===============================================
-- 檔案路徑結構說明
-- ===============================================

/* 
檔案路徑結構：
{memberId}/{photoType}/{uuid}.{extension}

其中：
- memberId: 狗隻成員的 UUID
- photoType: 照片類型 (avatar, album, pedigree, health_check)
- uuid: 檔案的唯一識別碼 (crypto.randomUUID())
- extension: 檔案副檔名 (jpg, png, webp, gif)

範例檔案路徑：
- 123e4567-e89b-12d3-a456-426614174000/avatar/abc123.jpg
- 123e4567-e89b-12d3-a456-426614174000/album/def456.png
- 123e4567-e89b-12d3-a456-426614174000/pedigree/ghi789.jpg
- 123e4567-e89b-12d3-a456-426614174000/health_check/jkl012.jpg

對應的公開 URL 格式：
https://[project-id].supabase.co/storage/v1/object/public/member-avatars/[member-id]/[photo-type]/[filename]
*/ 