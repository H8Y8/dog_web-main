-- ===============================================
-- 修正 Members 表格 RLS 政策
-- 解決 "資源不存在" 錯誤
-- ===============================================

-- 檢查目前的 members 表政策
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'members';

-- 刪除所有可能存在的嚴格政策
DROP POLICY IF EXISTS "Allow authenticated users to read members" ON members;
DROP POLICY IF EXISTS "Allow admins to modify members" ON members;
DROP POLICY IF EXISTS "Members are viewable by everyone" ON members;
DROP POLICY IF EXISTS "Authenticated users can insert members" ON members;
DROP POLICY IF EXISTS "Authenticated users can update members" ON members;
DROP POLICY IF EXISTS "Authenticated users can delete members" ON members;

-- 確保 RLS 已啟用
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 創建新的寬鬆政策

-- 1. 允許所有人查看狗隻成員（公開資訊）
CREATE POLICY "Members_public_read" ON members
    FOR SELECT USING (true);

-- 2. 允許已認證用戶新增狗隻成員
CREATE POLICY "Members_authenticated_insert" ON members
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- 3. 允許已認證用戶更新狗隻成員
CREATE POLICY "Members_authenticated_update" ON members
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. 允許已認證用戶刪除狗隻成員
CREATE POLICY "Members_authenticated_delete" ON members
    FOR DELETE TO authenticated
    USING (true);

-- 檢查新政策是否正確創建
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'members'
ORDER BY policyname;

-- 測試查詢：確認可以讀取成員資料
SELECT id, name, role, status FROM members LIMIT 3; 