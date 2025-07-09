-- 簡化 member-avatars Storage 政策
-- 刪除所有現有政策
DROP POLICY IF EXISTS "member_avatars_read" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_write" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_update" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_delete" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_select" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_insert" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_public_read" ON storage.objects;
DROP POLICY IF EXISTS "member_avatars_all_authenticated" ON storage.objects;

-- 確保 bucket 設定正確且為公開讀取
UPDATE storage.buckets 
SET public = true 
WHERE id = 'member-avatars';

-- 創建最簡單的政策 - 允許已認證用戶執行所有操作
CREATE POLICY "member_avatars_all_authenticated" ON storage.objects 
FOR ALL TO authenticated 
USING (bucket_id = 'member-avatars') 
WITH CHECK (bucket_id = 'member-avatars');

-- 允許匿名用戶讀取（因為 bucket 是公開的）
CREATE POLICY "member_avatars_public_read" ON storage.objects 
FOR SELECT TO anon 
USING (bucket_id = 'member-avatars');

-- 檢查政策是否正確創建
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE 'member_avatars%';

-- 檢查 bucket 設定
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'member-avatars'; 