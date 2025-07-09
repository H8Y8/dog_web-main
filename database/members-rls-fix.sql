-- ===============================================
-- Members 表格 RLS 政策修正
-- 解決 "new row violates row-level security policy" 錯誤
-- ===============================================

-- 首先刪除現有的過於嚴格的政策
DROP POLICY IF EXISTS "Allow authenticated users to read members" ON members;
DROP POLICY IF EXISTS "Allow admins to modify members" ON members;

-- 創建新的政策，允許已認證用戶進行所有操作

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

-- 確保 RLS 已啟用
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 檢查政策是否正確創建
SELECT 
    policyname, 
    cmd, 
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'members'
ORDER BY policyname; 