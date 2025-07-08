-- ===============================================
-- Row-Level Security (RLS) 政策配置
-- Scottish Terrier Dog Web
-- ===============================================

-- ===============================================
-- 1. Posts 表格 RLS 政策
-- ===============================================

-- 啟用 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 政策：任何人都可以讀取已發布的文章
CREATE POLICY "Posts are viewable by everyone" ON posts
    FOR SELECT USING (published = true);

-- 政策：經過身份驗證的用戶可以查看所有文章（包括未發布的）
CREATE POLICY "Authenticated users can view all posts" ON posts
    FOR SELECT TO authenticated
    USING (true);

-- 政策：經過身份驗證的用戶可以插入文章（設置為自己的 author_id）
CREATE POLICY "Authenticated users can insert posts" ON posts
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = author_id);

-- 政策：用戶只能更新自己的文章
CREATE POLICY "Users can update their own posts" ON posts
    FOR UPDATE TO authenticated
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- 政策：用戶只能刪除自己的文章
CREATE POLICY "Users can delete their own posts" ON posts
    FOR DELETE TO authenticated
    USING (auth.uid() = author_id);

-- ===============================================
-- 2. Members 表格 RLS 政策
-- ===============================================

-- 啟用 RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 政策：任何人都可以讀取會員資訊
CREATE POLICY "Members are viewable by everyone" ON members
    FOR SELECT USING (true);

-- 政策：只有經過身份驗證的用戶可以插入會員資料
CREATE POLICY "Authenticated users can insert members" ON members
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- 政策：只有經過身份驗證的用戶可以更新會員資料
CREATE POLICY "Authenticated users can update members" ON members
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- 政策：只有經過身份驗證的用戶可以刪除會員資料
CREATE POLICY "Authenticated users can delete members" ON members
    FOR DELETE TO authenticated
    USING (true);

-- ===============================================
-- 3. Puppies 表格 RLS 政策
-- ===============================================

-- 啟用 RLS
ALTER TABLE puppies ENABLE ROW LEVEL SECURITY;

-- 政策：任何人都可以讀取可用的幼犬資訊
CREATE POLICY "Available puppies are viewable by everyone" ON puppies
    FOR SELECT USING (available = true);

-- 政策：經過身份驗證的用戶可以查看所有幼犬（包括不可用的）
CREATE POLICY "Authenticated users can view all puppies" ON puppies
    FOR SELECT TO authenticated
    USING (true);

-- 政策：只有經過身份驗證的用戶可以插入幼犬資料
CREATE POLICY "Authenticated users can insert puppies" ON puppies
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- 政策：只有經過身份驗證的用戶可以更新幼犬資料
CREATE POLICY "Authenticated users can update puppies" ON puppies
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- 政策：只有經過身份驗證的用戶可以刪除幼犬資料
CREATE POLICY "Authenticated users can delete puppies" ON puppies
    FOR DELETE TO authenticated
    USING (true);

-- ===============================================
-- 4. Environments 表格 RLS 政策
-- ===============================================

-- 啟用 RLS
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;

-- 政策：任何人都可以讀取環境資訊
CREATE POLICY "Environments are viewable by everyone" ON environments
    FOR SELECT USING (true);

-- 政策：只有經過身份驗證的用戶可以插入環境資料
CREATE POLICY "Authenticated users can insert environments" ON environments
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- 政策：只有經過身份驗證的用戶可以更新環境資料
CREATE POLICY "Authenticated users can update environments" ON environments
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- 政策：只有經過身份驗證的用戶可以刪除環境資料
CREATE POLICY "Authenticated users can delete environments" ON environments
    FOR DELETE TO authenticated
    USING (true);

-- ===============================================
-- 5. Storage 存儲桶政策
-- ===============================================

-- diary-images 存儲桶政策
INSERT INTO storage.buckets (id, name, public) 
VALUES ('diary-images', 'diary-images', true)
ON CONFLICT (id) DO NOTHING;

-- 政策：任何人都可以查看 diary-images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'diary-images');

-- 政策：經過身份驗證的用戶可以上傳到 diary-images
CREATE POLICY "Authenticated users can upload diary images" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'diary-images');

-- 政策：經過身份驗證的用戶可以更新自己上傳的圖片
CREATE POLICY "Users can update their own diary images" ON storage.objects 
    FOR UPDATE TO authenticated 
    USING (bucket_id = 'diary-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 政策：經過身份驗證的用戶可以刪除自己上傳的圖片
CREATE POLICY "Users can delete their own diary images" ON storage.objects 
    FOR DELETE TO authenticated 
    USING (bucket_id = 'diary-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- member-avatars 存儲桶政策
INSERT INTO storage.buckets (id, name, public) 
VALUES ('member-avatars', 'member-avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'member-avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'member-avatars');

-- puppy-photos 存儲桶政策
INSERT INTO storage.buckets (id, name, public) 
VALUES ('puppy-photos', 'puppy-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'puppy-photos');
CREATE POLICY "Authenticated users can upload puppy photos" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'puppy-photos');

-- environment-images 存儲桶政策
INSERT INTO storage.buckets (id, name, public) 
VALUES ('environment-images', 'environment-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'environment-images');
CREATE POLICY "Authenticated users can upload environment images" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'environment-images'); 