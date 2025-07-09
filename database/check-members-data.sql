-- ===============================================
-- 檢查 Members 表格資料
-- ===============================================

-- 檢查 members 表是否存在
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'members'
);

-- 檢查 members 表的結構
\d members

-- 查看所有成員記錄
SELECT id, name, role, status, created_at FROM members ORDER BY created_at DESC;

-- 檢查特定成員 ID 是否存在
SELECT id, name, role, status FROM members WHERE id = '213b34cd-f437-44c2-9e14-ef83b6f0192b';

-- 檢查是否有任何成員記錄
SELECT COUNT(*) as total_members FROM members;

-- 檢查最近的成員記錄
SELECT id, name, role, status, created_at FROM members ORDER BY created_at DESC LIMIT 5;

-- 檢查目前的 RLS 政策
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'members'
ORDER BY policyname; 