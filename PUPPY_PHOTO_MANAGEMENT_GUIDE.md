# 幼犬照片管理功能指南

## 目錄
- [概述](#概述)
- [功能特色](#功能特色)
- [用戶操作指南](#用戶操作指南)
- [技術實施細節](#技術實施細節)
- [API 文檔](#api-文檔)
- [故障排除](#故障排除)
- [開發者注意事項](#開發者注意事項)

---

## 概述

幼犬照片管理功能提供完整的圖片上傳、管理和展示解決方案，支援四種不同類型的照片：主要照片、相簿照片、血統證書和健康證明。本功能建立在 Supabase Storage 之上，提供安全、高效的文件存儲服務。

### 支援的照片類型
- **主要照片 (Cover Image)**: 幼犬的代表性照片，顯示在列表和詳情頁面
- **相簿照片 (Album Images)**: 多張展示照片，用於幼犬相簿展示
- **血統證書 (Pedigree Documents)**: 血統證明文件的照片或掃描件
- **健康證明 (Health Certificates)**: 健康檢查報告和證書的照片

---

## 功能特色

### ✨ 核心功能
- **多類型上傳**: 支援四種不同類型的照片分類管理
- **拖拽上傳**: 直觀的拖拽介面，支援多檔案同時上傳
- **即時預覽**: 上傳前預覽圖片，支援圖片壓縮設定
- **批量管理**: 支援批量上傳和單檔上傳
- **即時更新**: 照片上傳後立即更新幼犬資料

### 🔧 技術特色
- **檔案驗證**: 自動檢查檔案大小(5MB限制)和格式
- **圖片壓縮**: 根據照片類型自動調整壓縮設定
- **錯誤處理**: 完整的錯誤處理和用戶反饋機制
- **TypeScript**: 完整的類型安全保障
- **響應式設計**: 適配各種螢幕尺寸

### 🔒 安全特色
- **認證整合**: 與現有認證系統整合
- **RLS政策**: Row Level Security 保護資料安全
- **檔案驗證**: 嚴格的檔案類型和大小限制

---

## 用戶操作指南

### 1. 進入照片管理

1. **從幼犬列表進入**:
   - 登入管理後台 → 幼犬管理
   - 點選任一幼犬的「查看」按鈕
   - 在幼犬詳情頁面點選「管理照片」按鈕

2. **導航說明**:
   - 幼犬列表 → 幼犬詳情 → 照片管理
   - 在照片管理頁面可點選「返回詳情」回到幼犬詳情頁面

### 2. 上傳照片

#### 拖拽上傳
1. 選擇照片類型（主要照片、相簿照片、血統證書、健康證明）
2. 將圖片檔案拖拽到上傳區域
3. 系統自動驗證檔案格式和大小
4. 預覽圖片並確認上傳設定
5. 點選「開始上傳」執行批量上傳

#### 點選上傳
1. 點選「選擇檔案」按鈕
2. 從檔案管理器選擇一個或多個圖片檔案
3. 確認檔案列表和設定
4. 執行上傳流程

### 3. 管理現有照片

#### 查看照片
- 上傳區域下方會顯示該類型的現有照片
- 每張照片都會顯示縮圖預覽
- 支援點選查看大圖

#### 刪除照片
- 每張照片都有刪除按鈕
- 刪除前會有確認提示
- 刪除後立即從存儲和資料庫中移除

### 4. 照片類型說明

#### 主要照片 (Cover Image)
- **用途**: 幼犬的代表性照片
- **顯示位置**: 幼犬列表、詳情頁面頭部
- **數量限制**: 1張
- **建議尺寸**: 正方形或橫幅比例
- **壓縮設定**: 85% 品質，最大1200x1200像素

#### 相簿照片 (Album Images)
- **用途**: 幼犬的多角度展示照片
- **顯示位置**: 幼犬詳情頁面相簿區域
- **數量限制**: 無限制（建議10張以內）
- **建議尺寸**: 4:3 或 16:9 比例
- **壓縮設定**: 80% 品質，最大1000x1000像素

#### 血統證書 (Pedigree Documents)
- **用途**: 血統證明文件的照片或掃描件
- **顯示位置**: 幼犬詳情頁面證書區域
- **數量限制**: 多張（通常1-3張）
- **建議格式**: 清晰的文件掃描圖片
- **壓縮設定**: 90% 品質，保持文字清晰

#### 健康證明 (Health Certificates)
- **用途**: 健康檢查報告和疫苗證書照片
- **顯示位置**: 幼犬詳情頁面健康區域
- **數量限制**: 多張
- **建議格式**: 清晰的文件掃描圖片
- **壓縮設定**: 90% 品質，保持文字清晰

---

## 技術實施細節

### 架構概述

```
Frontend (React/Next.js)
├── PuppyPhotoUpload.tsx      # 上傳組件
├── PuppyPhotoManager.tsx     # 管理介面
└── PuppiesManager.tsx        # 主管理頁面

API Layer
├── /api/puppies/[id]/photos  # 照片上傳API
└── lib/api/puppyPhotos.ts    # API客戶端

Storage Layer
├── Supabase Storage          # 檔案存儲
├── puppy-photos bucket       # 存儲桶
└── RLS Policies              # 安全政策

Database
└── puppies table             # 幼犬資料表
    ├── cover_image           # 主要照片URL
    ├── images[]              # 相簿照片URL陣列
    ├── pedigree_documents[]  # 血統證書URL陣列
    └── health_certificates[] # 健康證明URL陣列
```

### 檔案結構

#### 存儲路徑規則
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

#### 檔案命名規則
- **Puppy ID**: 幼犬的 UUID
- **類型資料夾**: cover, album, pedigree, health_check
- **檔案名**: 隨機生成的 UUID + 原始副檔名
- **範例**: `123e4567-e89b-12d3-a456-426614174000/cover/abc123.jpg`

### 資料庫欄位

#### puppies 表格相關欄位
```sql
-- 主要照片（單個URL）
cover_image: TEXT

-- 相簿照片（URL陣列）
images: TEXT[]

-- 血統證書（URL陣列）
pedigree_documents: TEXT[]

-- 健康證明（URL陣列）
health_certificates: TEXT[]
```

### 檔案限制

#### 大小限制
- **最大檔案大小**: 5MB
- **總上傳限制**: 無（單次批量上傳建議不超過50MB）

#### 格式支援
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)
- **GIF** (.gif) - 僅靜態圖片

#### 壓縮設定
```typescript
const compressionSettings = {
  cover: { quality: 0.85, maxWidth: 1200, maxHeight: 1200 },
  album: { quality: 0.80, maxWidth: 1000, maxHeight: 1000 },
  pedigree: { quality: 0.90, maxWidth: 1500, maxHeight: 1500 },
  health_check: { quality: 0.90, maxWidth: 1500, maxHeight: 1500 }
}
```

---

## API 文檔

### 上傳照片 API

#### POST `/api/puppies/[id]/photos`

**請求參數**:
```typescript
// FormData
{
  files: File[]           // 圖片檔案陣列
  type: PhotoType         // 照片類型
  // PhotoType = 'cover' | 'album' | 'pedigree' | 'health_check'
}
```

**請求標頭**:
```
Content-Type: multipart/form-data
Authorization: Bearer {access_token}
```

**回應格式**:
```typescript
// 成功回應
{
  success: true,
  data: {
    uploadedFiles: Array<{
      originalName: string
      storagePath: string
      publicUrl: string
      size: number
      type: string
    }>,
    updatedPuppy: Puppy
  }
}

// 錯誤回應
{
  success: false,
  error: {
    message: string
    code?: string
    details?: any
  }
}
```

### 刪除照片 API

#### DELETE `/api/puppies/[id]/photos`

**請求參數**:
```typescript
// Query Parameters
{
  url: string        // 要刪除的照片URL
  type: PhotoType    // 照片類型
}
```

**範例**:
```
DELETE /api/puppies/123/photos?url=https://...&type=cover
```

### API 客戶端函數

```typescript
// lib/api/puppyPhotos.ts

// 上傳照片
export async function uploadPuppyPhotos(
  puppyId: string,
  files: File[],
  type: PhotoType,
  accessToken?: string
): Promise<ApiResponse<UploadResult>>

// 刪除照片
export async function deletePuppyPhoto(
  puppyId: string,
  photoUrl: string,
  type: PhotoType,
  accessToken?: string
): Promise<ApiResponse<{ success: boolean }>>
```

---

## 故障排除

### 常見問題

#### 1. 上傳失敗：「檔案太大」
**原因**: 檔案超過5MB限制
**解決方案**: 
- 使用圖片壓縮工具減小檔案大小
- 系統會自動壓縮，但原始檔案不能超過限制

#### 2. 上傳失敗：「不支援的檔案格式」
**原因**: 檔案格式不在支援列表中
**解決方案**: 
- 支援格式：JPEG, PNG, WebP, GIF
- 確認檔案副檔名正確

#### 3. 上傳失敗：「認證錯誤」
**原因**: 用戶未登入或token過期
**解決方案**: 
- 重新登入管理後台
- 檢查網路連接

#### 4. 上傳成功但照片不顯示
**原因**: 瀏覽器快取或RLS政策問題
**解決方案**: 
- 重新整理頁面
- 檢查Supabase存儲設定
- 執行RLS政策修正腳本

#### 5. 照片載入緩慢
**原因**: 檔案過大或網路問題
**解決方案**: 
- 系統會自動壓縮，等待處理完成
- 檢查網路連接速度

### RLS 政策問題排除

#### 檢查 Supabase 設定
```sql
-- 檢查 bucket 存在
SELECT * FROM storage.buckets WHERE id = 'puppy-photos';

-- 檢查 RLS 政策
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%puppy_photos%';

-- 檢查用戶認證
SELECT auth.uid() IS NOT NULL;
```

#### 修正 RLS 政策
如果遇到權限問題，執行修正腳本：
```bash
# 在 Supabase SQL 編輯器中執行
database/puppy-photos-storage-fixed.sql
```

### 除錯模式

#### 開發環境除錯
```typescript
// 在瀏覽器控制台查看詳細錯誤
console.log('Upload error:', error);

// 檢查 API 回應
fetch('/api/puppies/123/photos', {
  method: 'POST',
  body: formData
}).then(res => res.json()).then(console.log);
```

#### 伺服器日誌
```bash
# 檢查 Next.js 開發伺服器日誌
npm run dev

# 檢查 Vercel 部署日誌（生產環境）
vercel logs
```

---

## 開發者注意事項

### 程式碼結構

#### 組件階層
```
PuppiesManager (主管理頁面)
└── PuppyPhotoManager (照片管理頁面)
    └── PuppyPhotoUpload (上傳組件)
```

#### 狀態管理
- 使用 `usePuppies` hook 管理幼犬資料
- 組件內部狀態管理上傳進度和錯誤
- 即時更新父組件資料

#### 錯誤處理策略
- API 層面：標準化錯誤回應格式
- 組件層面：用戶友好的錯誤訊息
- 網路層面：自動重試機制

### 擴展指南

#### 添加新的照片類型
1. 更新 `PhotoType` 類型定義
2. 修改資料庫 schema 添加新欄位
3. 更新 API 端點處理邏輯
4. 擴展前端組件支援新類型

#### 自訂壓縮設定
```typescript
// 在 PuppyPhotoUpload.tsx 中修改
const customCompressionSettings = {
  newType: { 
    quality: 0.75, 
    maxWidth: 800, 
    maxHeight: 600 
  }
}
```

#### 批量操作優化
- 考慮實施進度條顯示
- 添加暫停/繼續功能
- 實施失敗重試機制

### 效能考量

#### 圖片最佳化
- 自動壓縮減少存儲空間
- 支援 WebP 格式提升載入速度
- 考慮實施 CDN 分發

#### 記憶體管理
- 大檔案上傳時注意記憶體使用
- 實施檔案分片上傳（未來功能）
- 清理臨時物件避免記憶體洩漏

### 安全考量

#### 檔案驗證
- 嚴格的 MIME 類型檢查
- 檔案大小限制
- 防止惡意檔案上傳

#### 存取控制
- RLS 政策保護存儲資源
- 認證整合確保用戶權限
- 定期檢查存取日誌

---

## 版本記錄

### v1.0.0 (2025-07-10)
- ✅ 完整的幼犬照片上傳功能
- ✅ 四種照片類型支援
- ✅ 拖拽上傳介面
- ✅ 批量上傳和管理
- ✅ RLS 安全政策
- ✅ 完整的錯誤處理
- ✅ TypeScript 類型安全
- ✅ 響應式設計

### 未來規劃
- [ ] 圖片編輯功能（裁切、旋轉）
- [ ] 檔案分片上傳支援大檔案
- [ ] 圖片標籤和分類系統
- [ ] 批量匯出功能
- [ ] CDN 整合
- [ ] 圖片 SEO 最佳化

---

## 技術支援

如有技術問題或需要協助，請參考：
- [Supabase Storage 文檔](https://supabase.com/docs/guides/storage)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React 檔案上傳最佳實踐](https://react.dev/learn)

---

*本文檔最後更新：2025年7月10日* 