# Supabase Storage 設置指南

## 問題說明

當您遇到 `ERROR: 42501: must be owner of table objects` 錯誤時，這表示您沒有足夠的權限來修改 `storage.objects` 表格的RLS政策。這是正常的，因為只有超級用戶才能修改系統表格的政策。

## 解決方案

### 步驟1：執行簡化版SQL腳本

使用 `database/puppy-photos-storage-simple.sql` 而不是 `database/puppy-photos-storage-fixed.sql`：

1. 在Supabase Dashboard中打開SQL編輯器
2. 執行以下命令：

```sql
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
```

3. 確認bucket創建成功：

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at
FROM storage.buckets 
WHERE id = 'puppy-photos';
```

### 步驟2：通過Dashboard設置RLS政策

#### 2.1 進入Storage Policies頁面
1. 登入Supabase Dashboard
2. 選擇您的專案
3. 前往 **Storage** → **Policies**
4. 找到 **objects** 表格

#### 2.2 創建政策1：公開讀取
點擊 **New Policy** 並設置：
- **Policy name**: `puppy_photos_select_policy`
- **Allowed operation**: `SELECT`
- **Target roles**: `public` (或留空，表示所有人)
- **Using expression**: `bucket_id = 'puppy-photos'`

#### 2.3 創建政策2：認證用戶上傳
點擊 **New Policy** 並設置：
- **Policy name**: `puppy_photos_insert_policy`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Using expression**: `bucket_id = 'puppy-photos'`

#### 2.4 創建政策3：認證用戶更新
點擊 **New Policy** 並設置：
- **Policy name**: `puppy_photos_update_policy`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Using expression**: `bucket_id = 'puppy-photos'`
- **Check expression**: `bucket_id = 'puppy-photos'`

#### 2.5 創建政策4：認證用戶刪除
點擊 **New Policy** 並設置：
- **Policy name**: `puppy_photos_delete_policy`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Using expression**: `bucket_id = 'puppy-photos'`

## 驗證設置

### 測試bucket創建
在SQL編輯器中執行：
```sql
SELECT * FROM storage.buckets WHERE id = 'puppy-photos';
```

### 測試RLS政策
在SQL編輯器中執行：
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage' 
AND policyname LIKE '%puppy_photos%'
ORDER BY policyname;
```

應該看到4個政策被成功創建。

## 故障排除

### 如果bucket已存在
如果遇到bucket已存在的錯誤，可以先檢查現有bucket：
```sql
SELECT * FROM storage.buckets WHERE id = 'puppy-photos';
```

如果需要更新設置，可以使用：
```sql
UPDATE storage.buckets 
SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'puppy-photos';
```

### 如果政策已存在
在Dashboard中，先刪除現有的重複政策，然後重新創建。

### 測試上傳功能
完成設置後，測試幼犬照片上傳功能：
1. 前往管理後台的幼犬管理頁面
2. 選擇一個幼犬並點擊「管理照片」
3. 嘗試上傳一張測試圖片
4. 確認上傳成功且能正常顯示

## 檔案路徑結構

設置完成後，上傳的檔案將按以下結構存儲：

```
puppy-photos/
└── {puppyId}/
    ├── cover/
    │   └── {uuid}.{extension}
    ├── album/
    │   ├── {uuid}.{extension}
    │   └── {uuid}.{extension}
    ├── pedigree/
    │   └── {uuid}.{extension}
    └── health_check/
        └── {uuid}.{extension}
```

## 數據庫欄位對應

- `cover_image`: 主要照片的單個URL
- `images`: 相簿照片的URL陣列
- `pedigree_documents`: 血統證書的URL陣列  
- `health_certificates`: 健康證明的URL陣列

## 下一步

完成Storage設置後，您就可以：
1. 使用幼犬照片上傳功能
2. 測試四種照片類型的上傳和管理
3. 驗證照片在前台的正確顯示
4. 完成任務29的最終測試 