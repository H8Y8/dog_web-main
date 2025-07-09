-- ===============================================
-- Row-Level Security (RLS) 政策配置 (修正版)
-- Scottish Terrier Dog Web
-- ===============================================

-- ===============================================
-- 1. Posts 表格 RLS 政策
-- ===============================================

-- 啟用 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策（如果存在）並重新創建
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
CREATE POLICY "Posts are viewable by everyone" ON posts
    FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Authenticated users can view all posts" ON posts;
CREATE POLICY "Authenticated users can view all posts" ON posts
    FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert posts" ON posts;
CREATE POLICY "Authenticated users can insert posts" ON posts
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
CREATE POLICY "Users can update their own posts" ON posts
    FOR UPDATE TO authenticated
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
CREATE POLICY "Users can delete their own posts" ON posts
    FOR DELETE TO authenticated
    USING (auth.uid() = author_id);

-- ===============================================
-- 2. Members 表格 RLS 政策
-- ===============================================

-- ===============================================
-- Members 表格 RLS 政策修正版
-- 解決新增狗隻成員時的權限問題
-- ===============================================

-- 刪除現有的過於嚴格的政策
DROP POLICY IF EXISTS "Allow authenticated users to read members" ON members;
DROP POLICY IF EXISTS "Allow admins to modify members" ON members;

-- 創建新的、更寬鬆的政策

-- 1. 允許所有人查看狗隻成員（公開資訊）
CREATE POLICY "Members are viewable by everyone" ON members
    FOR SELECT USING (true);

-- 2. 允許已認證用戶新增狗隻成員
CREATE POLICY "Authenticated users can insert members" ON members
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- 3. 允許已認證用戶更新狗隻成員
CREATE POLICY "Authenticated users can update members" ON members
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. 允許已認證用戶刪除狗隻成員
CREATE POLICY "Authenticated users can delete members" ON members
    FOR DELETE TO authenticated
    USING (true);

-- ===============================================
-- 3. Puppies 表格 RLS 政策
-- ===============================================

ALTER TABLE puppies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Available puppies are viewable by everyone" ON puppies;
CREATE POLICY "Available puppies are viewable by everyone" ON puppies
    FOR SELECT USING (available = true);

DROP POLICY IF EXISTS "Authenticated users can view all puppies" ON puppies;
CREATE POLICY "Authenticated users can view all puppies" ON puppies
    FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert puppies" ON puppies;
CREATE POLICY "Authenticated users can insert puppies" ON puppies
    FOR INSERT TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update puppies" ON puppies;
CREATE POLICY "Authenticated users can update puppies" ON puppies
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete puppies" ON puppies;
CREATE POLICY "Authenticated users can delete puppies" ON puppies
    FOR DELETE TO authenticated
    USING (true);

-- ===============================================
-- 4. Environments 表格 RLS 政策
-- ===============================================

ALTER TABLE environments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Environments are viewable by everyone" ON environments;
CREATE POLICY "Environments are viewable by everyone" ON environments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert environments" ON environments;
CREATE POLICY "Authenticated users can insert environments" ON environments
    FOR INSERT TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update environments" ON environments;
CREATE POLICY "Authenticated users can update environments" ON environments
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete environments" ON environments;
CREATE POLICY "Authenticated users can delete environments" ON environments
    FOR DELETE TO authenticated
    USING (true);

-- ===============================================
-- 5. Storage 存儲桶政策 (修正版)
-- ===============================================

-- 確保存儲桶存在（避免重複插入錯誤）
INSERT INTO storage.buckets (id, name, public) 
VALUES ('diary-images', 'diary-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('member-avatars', 'member-avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('puppy-photos', 'puppy-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('environment-images', 'environment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 政策（使用唯一名稱避免衝突）
DROP POLICY IF EXISTS "diary_images_select_policy" ON storage.objects;
CREATE POLICY "diary_images_select_policy" ON storage.objects 
    FOR SELECT USING (bucket_id = 'diary-images');

DROP POLICY IF EXISTS "diary_images_insert_policy" ON storage.objects;
CREATE POLICY "diary_images_insert_policy" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'diary-images');

DROP POLICY IF EXISTS "member_avatars_select_policy" ON storage.objects;
CREATE POLICY "member_avatars_select_policy" ON storage.objects 
    FOR SELECT USING (bucket_id = 'member-avatars');

DROP POLICY IF EXISTS "member_avatars_insert_policy" ON storage.objects;
CREATE POLICY "member_avatars_insert_policy" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'member-avatars');

DROP POLICY IF EXISTS "puppy_photos_select_policy" ON storage.objects;
CREATE POLICY "puppy_photos_select_policy" ON storage.objects 
    FOR SELECT USING (bucket_id = 'puppy-photos');

DROP POLICY IF EXISTS "puppy_photos_insert_policy" ON storage.objects;
CREATE POLICY "puppy_photos_insert_policy" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'puppy-photos');

DROP POLICY IF EXISTS "environment_images_select_policy" ON storage.objects;
CREATE POLICY "environment_images_select_policy" ON storage.objects 
    FOR SELECT USING (bucket_id = 'environment-images');

DROP POLICY IF EXISTS "environment_images_insert_policy" ON storage.objects;
CREATE POLICY "environment_images_insert_policy" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'environment-images'); 

-- ===============================================
-- 驗證政策是否正確應用
-- ===============================================

-- 檢查現有政策
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'members'; 