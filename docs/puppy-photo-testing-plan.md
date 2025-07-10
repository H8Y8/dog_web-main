# 幼犬照片管理功能測試計劃

## 測試概述

本文檔定義了幼犬照片管理功能的全面測試策略，包括單元測試、整合測試、端到端測試和用戶驗收測試。

---

## 測試範圍

### 涵蓋的功能模組
- ✅ 照片上傳（四種類型）
- ✅ 照片刪除
- ✅ 照片顯示和預覽
- ✅ 檔案驗證
- ✅ 錯誤處理
- ✅ 認證和授權
- ✅ RLS 政策
- ✅ API 端點

### 測試環境
- **開發環境**: 本地 Next.js 開發伺服器
- **測試環境**: Supabase 測試專案
- **生產環境**: 實際部署環境（需謹慎測試）

---

## 測試分類

### 1. 單元測試

#### API 客戶端函數測試
**檔案**: `lib/api/puppyPhotos.ts`

```typescript
// 測試用例範例
describe('uploadPuppyPhotos', () => {
  test('應該成功上傳單張照片', async () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
    const result = await uploadPuppyPhotos('puppy-id', [mockFile], 'cover', 'token')
    expect(result.success).toBe(true)
  })

  test('應該拒絕過大的檔案', async () => {
    const bigFile = new File(['x'.repeat(6 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' })
    const result = await uploadPuppyPhotos('puppy-id', [bigFile], 'cover', 'token')
    expect(result.success).toBe(false)
    expect(result.error?.message).toContain('檔案太大')
  })

  test('應該拒絕不支援的檔案格式', async () => {
    const textFile = new File(['content'], 'test.txt', { type: 'text/plain' })
    const result = await uploadPuppyPhotos('puppy-id', [textFile], 'cover', 'token')
    expect(result.success).toBe(false)
  })
})

describe('deletePuppyPhoto', () => {
  test('應該成功刪除照片', async () => {
    const result = await deletePuppyPhoto('puppy-id', 'https://example.com/photo.jpg', 'cover', 'token')
    expect(result.success).toBe(true)
  })

  test('應該處理不存在的照片URL', async () => {
    const result = await deletePuppyPhoto('puppy-id', 'https://invalid.com/photo.jpg', 'cover', 'token')
    expect(result.success).toBe(false)
  })
})
```

#### 組件單元測試
**檔案**: `app/admin/components/PuppyPhotoUpload.tsx`

```typescript
describe('PuppyPhotoUpload', () => {
  test('應該渲染上傳區域', () => {
    render(<PuppyPhotoUpload puppy={mockPuppy} type="cover" onPhotosUpdated={mockCallback} />)
    expect(screen.getByText('拖拽檔案到這裡')).toBeInTheDocument()
  })

  test('應該驗證檔案類型', () => {
    render(<PuppyPhotoUpload puppy={mockPuppy} type="cover" onPhotosUpdated={mockCallback} />)
    const input = screen.getByLabelText('檔案上傳')
    fireEvent.change(input, { target: { files: [invalidFile] } })
    expect(screen.getByText('不支援的檔案格式')).toBeInTheDocument()
  })

  test('應該顯示現有照片', () => {
    const puppyWithPhotos = { ...mockPuppy, cover_image: 'https://example.com/photo.jpg' }
    render(<PuppyPhotoUpload puppy={puppyWithPhotos} type="cover" onPhotosUpdated={mockCallback} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })
})
```

### 2. 整合測試

#### API 路由測試
**檔案**: `app/api/puppies/[id]/photos/route.ts`

```typescript
describe('/api/puppies/[id]/photos', () => {
  describe('POST', () => {
    test('應該成功上傳照片到正確的bucket', async () => {
      const formData = new FormData()
      formData.append('files', mockImageFile)
      formData.append('type', 'cover')

      const response = await POST(mockRequest)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.uploadedFiles).toHaveLength(1)
    })

    test('應該更新資料庫中的幼犬記錄', async () => {
      // 上傳照片
      const response = await POST(mockRequest)
      const data = await response.json()
      
      // 檢查資料庫更新
      const updatedPuppy = await getPuppyById(puppyId)
      expect(updatedPuppy.cover_image).toBe(data.data.uploadedFiles[0].publicUrl)
    })

    test('應該拒絕未認證的請求', async () => {
      const response = await POST(mockRequestWithoutAuth)
      expect(response.status).toBe(401)
    })
  })

  describe('DELETE', () => {
    test('應該成功刪除照片和更新資料庫', async () => {
      const response = await DELETE(mockDeleteRequest)
      expect(response.status).toBe(200)
      
      // 檢查資料庫更新
      const updatedPuppy = await getPuppyById(puppyId)
      expect(updatedPuppy.cover_image).toBeNull()
    })
  })
})
```

#### 資料庫整合測試

```sql
-- 測試 RLS 政策
-- 測試認證用戶可以上傳
SET request.jwt.claims = '{"sub": "user-id", "role": "authenticated"}';
INSERT INTO storage.objects (bucket_id, name, metadata) 
VALUES ('puppy-photos', 'test-puppy/cover/test.jpg', '{}');

-- 測試匿名用戶可以讀取
RESET request.jwt.claims;
SELECT * FROM storage.objects WHERE bucket_id = 'puppy-photos';

-- 測試政策限制
RESET request.jwt.claims;
INSERT INTO storage.objects (bucket_id, name, metadata) 
VALUES ('puppy-photos', 'test-puppy/cover/test2.jpg', '{}');
-- 應該失敗
```

### 3. 端到端測試

#### 用戶流程測試
使用 Playwright 或 Cypress

```typescript
describe('幼犬照片管理端到端測試', () => {
  test('完整照片上傳流程', async ({ page }) => {
    // 1. 登入管理後台
    await page.goto('/admin')
    await page.fill('[data-testid=email]', 'admin@example.com')
    await page.fill('[data-testid=password]', 'password')
    await page.click('[data-testid=login]')

    // 2. 導航到幼犬管理
    await page.click('[data-testid=puppies-management]')
    await expect(page.locator('h2')).toContainText('幼犬管理')

    // 3. 選擇幼犬並進入照片管理
    await page.click('[data-testid=view-puppy]:first-child')
    await page.click('[data-testid=manage-photos]')
    await expect(page.locator('h2')).toContainText('照片管理')

    // 4. 上傳主要照片
    const fileInput = page.locator('input[type=file]')
    await fileInput.setInputFiles('test-fixtures/puppy-photo.jpg')
    await page.click('[data-testid=upload-button]')

    // 5. 驗證上傳成功
    await expect(page.locator('[data-testid=success-message]')).toBeVisible()
    await expect(page.locator('[data-testid=uploaded-photo]')).toBeVisible()

    // 6. 刪除照片
    await page.click('[data-testid=delete-photo]')
    await page.click('[data-testid=confirm-delete]')
    await expect(page.locator('[data-testid=uploaded-photo]')).not.toBeVisible()
  })

  test('錯誤處理測試', async ({ page }) => {
    await page.goto('/admin/puppies/photos')
    
    // 測試大檔案上傳
    const bigFileInput = page.locator('input[type=file]')
    await bigFileInput.setInputFiles('test-fixtures/big-file.jpg') // > 5MB
    await expect(page.locator('[data-testid=error-message]')).toContainText('檔案太大')

    // 測試無效格式
    await bigFileInput.setInputFiles('test-fixtures/document.pdf')
    await expect(page.locator('[data-testid=error-message]')).toContainText('不支援的檔案格式')
  })
})
```

### 4. 效能測試

#### 檔案上傳效能

```typescript
describe('效能測試', () => {
  test('批量上傳測試', async () => {
    const files = Array.from({ length: 10 }, (_, i) => 
      new File(['content'], `photo-${i}.jpg`, { type: 'image/jpeg' })
    )
    
    const startTime = Date.now()
    const result = await uploadPuppyPhotos('puppy-id', files, 'album', 'token')
    const endTime = Date.now()
    
    expect(result.success).toBe(true)
    expect(endTime - startTime).toBeLessThan(30000) // 30秒內完成
  })

  test('大檔案壓縮測試', async () => {
    const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    
    const result = await uploadPuppyPhotos('puppy-id', [largeFile], 'cover', 'token')
    expect(result.success).toBe(true)
    
    // 檢查壓縮後檔案大小
    const uploadedFile = result.data?.uploadedFiles[0]
    expect(uploadedFile?.size).toBeLessThan(1 * 1024 * 1024) // 壓縮後小於1MB
  })
})
```

### 5. 安全測試

#### 認證和授權測試

```typescript
describe('安全測試', () => {
  test('未認證用戶不能上傳', async () => {
    const response = await fetch('/api/puppies/test-id/photos', {
      method: 'POST',
      body: formData
      // 沒有 Authorization header
    })
    expect(response.status).toBe(401)
  })

  test('不能上傳惡意檔案', async () => {
    const maliciousFile = new File(['<script>alert("xss")</script>'], 'malicious.jpg', { 
      type: 'image/jpeg' 
    })
    
    const result = await uploadPuppyPhotos('puppy-id', [maliciousFile], 'cover', 'token')
    expect(result.success).toBe(false)
  })

  test('檔案路徑注入防護', async () => {
    const result = await uploadPuppyPhotos('../../../evil-path', [normalFile], 'cover', 'token')
    expect(result.success).toBe(false)
  })
})
```

### 6. 錯誤恢復測試

#### 網路錯誤處理

```typescript
describe('錯誤恢復測試', () => {
  test('網路中斷時的處理', async () => {
    // 模擬網路中斷
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch

    const result = await uploadPuppyPhotos('puppy-id', [file], 'cover', 'token')
    expect(result.success).toBe(false)
    expect(result.error?.message).toContain('網路錯誤')
  })

  test('部分上傳失敗的處理', async () => {
    const files = [validFile, corruptedFile, validFile2]
    const result = await uploadPuppyPhotos('puppy-id', files, 'album', 'token')
    
    // 應該部分成功
    expect(result.data?.uploadedFiles).toHaveLength(2)
    expect(result.data?.errors).toHaveLength(1)
  })
})
```

---

## 測試執行計劃

### 自動化測試

#### 持續整合 (CI)
```yaml
# .github/workflows/test.yml
name: Test Puppy Photo Management
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
```

#### 測試腳本
```json
{
  "scripts": {
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

### 手動測試

#### 用戶驗收測試清單

- [ ] **基本功能測試**
  - [ ] 登入管理後台
  - [ ] 導航到幼犬照片管理
  - [ ] 上傳主要照片
  - [ ] 上傳相簿照片
  - [ ] 上傳血統證書
  - [ ] 上傳健康證明
  - [ ] 刪除照片
  - [ ] 返回詳情頁面

- [ ] **檔案驗證測試**
  - [ ] 上傳過大檔案（>5MB）
  - [ ] 上傳不支援格式（PDF, TXT）
  - [ ] 上傳正常檔案（JPEG, PNG, WebP, GIF）
  - [ ] 批量上傳多個檔案

- [ ] **用戶體驗測試**
  - [ ] 拖拽上傳功能
  - [ ] 上傳進度顯示
  - [ ] 錯誤訊息顯示
  - [ ] 成功訊息顯示
  - [ ] 載入狀態顯示

- [ ] **響應式設計測試**
  - [ ] 桌面版瀏覽器
  - [ ] 平板裝置
  - [ ] 手機裝置
  - [ ] 不同螢幕解析度

- [ ] **瀏覽器相容性測試**
  - [ ] Chrome (最新版)
  - [ ] Firefox (最新版)
  - [ ] Safari (最新版)
  - [ ] Edge (最新版)

#### 效能測試清單

- [ ] **上傳效能**
  - [ ] 單檔上傳時間 < 5秒
  - [ ] 批量上傳 (10張) < 30秒
  - [ ] 大檔案壓縮時間合理
  - [ ] 記憶體使用正常

- [ ] **載入效能**
  - [ ] 照片列表載入 < 3秒
  - [ ] 照片預覽載入 < 2秒
  - [ ] 頁面互動響應 < 1秒

#### 安全測試清單

- [ ] **認證測試**
  - [ ] 未登入用戶無法存取
  - [ ] 登入用戶可以正常使用
  - [ ] Token過期處理

- [ ] **檔案安全測試**
  - [ ] 惡意檔案上傳防護
  - [ ] 檔案類型驗證
  - [ ] 檔案大小限制
  - [ ] 路徑注入防護

---

## 測試資料

### 測試檔案
```
test-fixtures/
├── valid-images/
│   ├── small-photo.jpg (< 1MB)
│   ├── medium-photo.png (2-3MB)
│   ├── large-photo.webp (4-5MB)
│   └── animated.gif
├── invalid-files/
│   ├── too-large.jpg (> 5MB)
│   ├── document.pdf
│   ├── text-file.txt
│   └── executable.exe
└── test-data/
    ├── puppy-sample.json
    └── user-credentials.json
```

### Mock資料
```typescript
export const mockPuppy: Puppy = {
  id: 'test-puppy-id',
  name: '測試小狗',
  breed: 'Scottish Terrier',
  gender: 'male',
  birth_date: '2024-01-01',
  color: '黑色',
  status: PuppyStatus.AVAILABLE,
  cover_image: null,
  images: [],
  pedigree_documents: [],
  health_certificates: []
}

export const mockFiles = {
  validJpeg: new File([''], 'test.jpg', { type: 'image/jpeg' }),
  validPng: new File([''], 'test.png', { type: 'image/png' }),
  invalidPdf: new File([''], 'test.pdf', { type: 'application/pdf' }),
  oversizedFile: new File(['x'.repeat(6 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' })
}
```

---

## 測試報告

### 預期測試結果

#### 通過標準
- **單元測試覆蓋率**: > 90%
- **整合測試**: 所有API端點正常
- **端到端測試**: 完整用戶流程無錯誤
- **效能測試**: 符合預期效能指標
- **安全測試**: 無安全漏洞

#### 風險評估
- **高風險**: RLS政策配置錯誤
- **中風險**: 檔案上傳失敗處理
- **低風險**: UI/UX 細節問題

### 錯誤記錄格式
```typescript
interface TestError {
  testName: string
  errorType: 'unit' | 'integration' | 'e2e' | 'manual'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  reproduction: string[]
  expectedBehavior: string
  actualBehavior: string
  environment: string
  timestamp: string
}
```

---

## 維護和更新

### 測試維護計劃
- **每週**: 執行完整測試套件
- **每月**: 更新測試案例
- **每季**: 檢查測試覆蓋率
- **每半年**: 效能基準測試

### 測試更新觸發條件
- 新功能添加
- Bug修復
- 依賴庫更新
- 安全政策變更
- 效能優化

---

*本測試計劃最後更新：2025年7月10日* 