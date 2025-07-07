# 📸 照片管理和部署指南

## 🎯 目標
這個系統讓您可以在本地存放所有1.4GB的照片資源，但在部署時只上傳您選定和優化過的照片，避免浪費空間和時間。

## 📂 資料夾結構

```
專案根目錄/
├── photos-source/ (本地開發用，不會被git追蹤或部署)
│   ├── original/     - 存放1.4GB原始照片
│   ├── candidates/   - 篩選後的候選照片
│   │   ├── gallery/      - 畫廊展示用候選照片
│   │   ├── puppies/      - 幼犬詳情候選照片
│   │   ├── environment/  - 環境介紹候選照片
│   │   └── diary/        - 日誌文章候選照片
│   └── selected/     - 最終選定的照片
└── public/images/ (會被git追蹤和部署)
    ├── gallery/          - 優化後的畫廊照片
    ├── puppies-detail/   - 優化後的幼犬照片
    ├── environment-detail/ - 優化後的環境照片
    └── diary-photos/     - 優化後的日誌照片
```

## 🔄 完整工作流程

### 步驟1: 存放原始照片
```bash
# 將您的1.4GB照片放入此目錄
cp /path/to/your/photos/* photos-source/original/
```

### 步驟2: 篩選候選照片
根據用途，將照片複製到對應的候選目錄：
```bash
# 畫廊展示照片
cp photos-source/original/gallery_photo1.jpg photos-source/candidates/gallery/

# 幼犬詳情照片  
cp photos-source/original/puppy_photo1.jpg photos-source/candidates/puppies/

# 環境介紹照片
cp photos-source/original/environment_photo1.jpg photos-source/candidates/environment/

# 日誌文章照片
cp photos-source/original/diary_photo1.jpg photos-source/candidates/diary/
```

### 步驟3: 批量優化照片
```bash
# 優化特定類型的照片
npm run optimize-photos gallery      # 畫廊照片
npm run optimize-photos puppies      # 幼犬照片  
npm run optimize-photos environment  # 環境照片
npm run optimize-photos diary        # 日誌照片

# 或一次優化所有類型
npm run optimize-all
```

### 步驟4: 檢查部署準備
```bash
# 檢查照片大小和部署準備
npm run deploy-check

# 完整的部署前檢查和構建
npm run pre-deploy
```

## ⚙️ 可用的腳本命令

| 命令 | 功能 | 說明 |
|------|------|------|
| `npm run optimize-photos <type>` | 優化指定類型照片 | type: gallery, puppies, environment, diary |
| `npm run optimize-all` | 優化所有類型照片 | 一次處理所有候選照片 |
| `npm run optimize-existing` | 優化現有大檔案 | 處理public/images中的大圖片 |
| `npm run deploy-check` | 部署前檢查 | 檢查照片大小和部署準備 |
| `npm run pre-deploy` | 完整部署準備 | 檢查+構建 |

## 📏 照片規格標準

| 用途 | 尺寸 | 品質 | 建議大小 |
|------|------|------|----------|
| 畫廊展示 | 1200x800px | 85% | <200KB |
| 幼犬詳情 | 800x600px | 90% | <150KB |
| 環境介紹 | 1200x800px | 85% | <200KB |
| 日誌文章 | 600x400px | 80% | <100KB |

## 🚀 部署流程

### 本地部署檢查
```bash
npm run deploy-check
```

### Zeabur 部署
1. 確保所有大檔案已優化
2. 檢查 `.gitignore` 正確排除 `photos-source/`
3. 提交代碼到git
4. 推送到遠端倉庫
5. Zeabur會自動部署（只包含public/images中的優化照片）

## 🔧 故障排除

### 問題：腳本顯示"請先安裝sharp套件"
```bash
npm install sharp --save-dev
```

### 問題：優化後照片品質不滿意
修改 `scripts/optimize-photos.js` 中的配置：
```javascript
const photoConfigs = {
  gallery: { width: 1200, height: 800, quality: 90, maxSize: 250 }, // 提高品質和大小限制
  // ...
}
```

### 問題：需要還原原始照片
```bash
node scripts/optimize-existing.js restore  # 還原備份
```

### 問題：清理備份檔案
```bash
node scripts/optimize-existing.js clean    # 清理備份
```

## 🎯 最佳實踐

1. **定期備份**: 原始照片請確保有額外備份
2. **分批處理**: 大量照片建議分批優化，避免記憶體問題
3. **版本控制**: 重要變更前先提交git
4. **品質檢查**: 優化後手動檢查照片品質
5. **命名規範**: 使用有意義的檔案名稱

## 📊 空間節省效果

使用這個系統的預期效果：
- **開發環境**: 可存取所有1.4GB原始照片
- **部署版本**: 只包含20-50MB的優化照片
- **載入速度**: 提升3-5倍
- **頻寬節省**: 減少90%+的傳輸量

## 🔗 相關檔案

- `scripts/optimize-photos.js` - 照片優化腳本
- `scripts/optimize-existing.js` - 現有照片優化
- `scripts/deploy-check.js` - 部署檢查腳本
- `photos-source/README.md` - 照片管理說明
- `.gitignore` - 排除規則配置 