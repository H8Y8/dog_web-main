-- ===============================================
-- 檢查成員頭像資料
-- ===============================================

-- 查看所有成員的頭像資料
SELECT 
    id, 
    name, 
    avatar_url, 
    CASE 
        WHEN avatar_url IS NULL THEN '無頭像'
        WHEN avatar_url = '' THEN '空字串'
        ELSE '有頭像'
    END as avatar_status,
    created_at,
    updated_at
FROM members 
ORDER BY updated_at DESC;

-- 檢查有頭像的成員數量
SELECT 
    COUNT(*) as total_members,
    COUNT(avatar_url) as members_with_avatar,
    COUNT(*) - COUNT(avatar_url) as members_without_avatar
FROM members;

-- 檢查最近更新的成員（可能是最近上傳照片的）
SELECT 
    id, 
    name, 
    avatar_url,
    updated_at
FROM members 
WHERE updated_at >= NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;

-- 檢查特定的 avatar_url 格式
SELECT 
    id,
    name,
    avatar_url,
    CASE 
        WHEN avatar_url LIKE '%supabase%' THEN 'Supabase URL'
        WHEN avatar_url LIKE 'http%' THEN 'HTTP URL'
        WHEN avatar_url IS NULL THEN 'NULL'
        ELSE 'Other'
    END as url_type
FROM members
WHERE avatar_url IS NOT NULL; 