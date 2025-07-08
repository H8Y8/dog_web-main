# API Routes Design

## 📋 API 路由架構規劃

### 1. Posts API (日記文章)
```
GET    /api/posts           - 獲取所有文章 (支援分頁、篩選)
GET    /api/posts/[id]      - 獲取單篇文章
POST   /api/posts           - 創建新文章 (需驗證)
PUT    /api/posts/[id]      - 更新文章 (需驗證 + 權限)
DELETE /api/posts/[id]      - 刪除文章 (需驗證 + 權限)
```

### 2. Members API (成員管理)
```
GET    /api/members         - 獲取所有成員
GET    /api/members/[id]    - 獲取單個成員
POST   /api/members         - 創建新成員 (需驗證)
PUT    /api/members/[id]    - 更新成員 (需驗證)
DELETE /api/members/[id]    - 刪除成員 (需驗證)
```

### 3. Puppies API (幼犬管理)
```
GET    /api/puppies         - 獲取所有幼犬 (公開可見 available=true)
GET    /api/puppies/all     - 獲取所有幼犬 (需驗證，包含不可用的)
GET    /api/puppies/[id]    - 獲取單隻幼犬
POST   /api/puppies         - 創建新幼犬資料 (需驗證)
PUT    /api/puppies/[id]    - 更新幼犬資料 (需驗證)
DELETE /api/puppies/[id]    - 刪除幼犬資料 (需驗證)
```

### 4. Environments API (環境管理)
```
GET    /api/environments    - 獲取所有環境資訊
GET    /api/environments/[id] - 獲取單個環境
POST   /api/environments    - 創建新環境 (需驗證)
PUT    /api/environments/[id] - 更新環境 (需驗證)
DELETE /api/environments/[id] - 刪除環境 (需驗證)
```

### 5. Contact API (聯絡表單)
```
POST   /api/contact         - 提交聯絡表單
```

### 6. Upload API (檔案上傳)
```
POST   /api/upload/diary-images     - 上傳日記圖片 (需驗證)
POST   /api/upload/member-avatars   - 上傳成員頭像 (需驗證)
POST   /api/upload/puppy-photos     - 上傳幼犬照片 (需驗證)
POST   /api/upload/environment-images - 上傳環境圖片 (需驗證)
```

### 7. Auth API (身份驗證)
```
POST   /api/auth/login      - 登入
POST   /api/auth/logout     - 登出
POST   /api/auth/register   - 註冊
GET    /api/auth/user       - 獲取目前用戶資訊
```

## 🔒 權限控制

### 公開路由 (不需驗證)
- `GET /api/posts` (只顯示 published=true)
- `GET /api/posts/[id]` (只顯示 published=true)
- `GET /api/members`
- `GET /api/puppies` (只顯示 available=true)
- `GET /api/environments`
- `POST /api/contact`

### 私有路由 (需要驗證)
- 所有 POST、PUT、DELETE 操作
- `GET /api/puppies/all`
- 所有 upload 操作

## 📝 回應格式

### 成功回應
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 錯誤回應
```json
{
  "success": false,
  "error": "錯誤訊息",
  "code": "ERROR_CODE"
}
```

## 🔍 查詢參數

### 分頁參數
- `page`: 頁數 (預設: 1)
- `limit`: 每頁筆數 (預設: 10, 最大: 100)

### 篩選參數
- Posts: `published`, `author_id`
- Puppies: `available`, `breed`, `gender`
- Environments: `type`

### 排序參數
- `sort`: 排序欄位 (預設: created_at)
- `order`: 排序方向 (asc/desc, 預設: desc) 