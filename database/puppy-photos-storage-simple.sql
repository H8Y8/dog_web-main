-- ===============================================
-- Puppy Photos Storage 配置 (簡化版 - 無需超級用戶權限)
-- 只創建bucket，RLS政策通過Dashboard設置
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
-- 驗證bucket設置
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
-- 後續步驟
-- ===============================================

/*
執行此腳本後，請通過Supabase Dashboard設置RLS政策：

1. 前往 Supabase Dashboard → Storage → Policies
2. 為 "objects" 表格添加以下政策：

政策1：公開讀取 (Allow public read)
- Policy name: puppy_photos_select_policy  
- Allowed operation: SELECT
- Target roles: public
- Conditions: bucket_id = 'puppy-photos'

政策2：認證用戶上傳 (Allow authenticated insert)
- Policy name: puppy_photos_insert_policy
- Allowed operation: INSERT  
- Target roles: authenticated
- Conditions: bucket_id = 'puppy-photos'

政策3：認證用戶更新 (Allow authenticated update)
- Policy name: puppy_photos_update_policy
- Allowed operation: UPDATE
- Target roles: authenticated  
- Conditions: bucket_id = 'puppy-photos'

政策4：認證用戶刪除 (Allow authenticated delete)
- Policy name: puppy_photos_delete_policy
- Allowed operation: DELETE
- Target roles: authenticated
- Conditions: bucket_id = 'puppy-photos'
*/ 