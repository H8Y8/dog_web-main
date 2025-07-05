# 蘇格蘭㹴育種與訓練中心網站

這是一個專業的蘇格蘭㹴育種與訓練中心的官方網站，採用現代化的設計理念和技術棧，提供優質的用戶體驗。

## 📝 TODO LIST

### 1. 後台功能完善
- [ ] 內容管理系統 (CMS)
  - [ ] 文章發布與管理
  - [ ] 圖片上傳與管理
  - [ ] 輪播圖設定
- [ ] 數據統計與分析
  - [ ] 訪問量統計
  - [ ] 用戶行為分析
  - [ ] 數據可視化展示
- [ ] 系統設置
  - [ ] 網站基本信息設置
  - [ ] SEO 設置
  - [ ] 備份與還原功能

## 🌟 特色功能

### 1. 響應式設計
- 完全響應式的佈局，適配手機、平板和桌面設備
- 針對不同設備優化的交互體驗
- 流暢的動畫效果和轉場

### 2. 主要頁面
- **首頁**: 展示核心服務和價值主張
  - 英雄區輪播圖
  - 關於我們介紹
  - 服務項目展示
  - 聯絡資訊

- **成員介紹**: 展示蘇格蘭㹴家族成員
  - 互動式卡片設計
  - 懸停效果
  - 詳細資訊展示

- **管理後台**: 提供管理員登入功能
  - 安全的身份驗證
  - 管理員專用介面

### 3. 互動元素
- 滾動動畫效果 (AOS)
- 自適應的導航欄
- 互動式路徑指示器
- 動態的社交媒體連結

## 🛠 技術棧

### 前端框架與庫
- **React 18**: 核心框架
- **React Router**: 路由管理
- **Tailwind CSS**: 樣式框架
- **Swiper**: 輪播圖組件
- **AOS**: 滾動動畫效果

### 開發工具
- **Create React App**: 專案腳手架
- **PostCSS**: CSS 處理器
- **ESLint**: 代碼質量控制

### 部署平台
- **Cloudflare Pages**: 網站託管
- **GitHub**: 代碼版本控制

## 📦 項目結構

```
dog_web/
├── public/
│   ├── images/         # 靜態圖片資源
│   ├── _redirects      # Cloudflare Pages 路由配置
│   └── _headers        # Cloudflare Pages 快取配置
├── src/
│   ├── components/     # React 組件
│   │   ├── Hero/      # 首頁英雄區
│   │   ├── About/     # 關於我們
│   │   ├── Members/   # 成員介紹
│   │   └── Contact/   # 聯絡資訊
│   ├── pages/         # 頁面組件
│   ├── styles/        # 樣式文件
│   └── App.js         # 應用程式入口
└── package.json       # 項目配置
```

## 🚀 開始使用

1. 克隆專案
```bash
git clone https://github.com/H8Y8/dog_web.git
cd dog_web
```

2. 安裝依賴
```bash
npm install
```

3. 啟動開發服務器
```bash
npm start
```

4. 構建生產版本
```bash
npm run build
```

## 🔧 配置說明

### Cloudflare Pages 配置
- 構建命令: `npm run build`
- 構建輸出目錄: `build`
- 環境變量: 無需特殊配置

### 路由配置
- 使用 React Router 進行客戶端路由
- 配置 Cloudflare Pages 的 `_redirects` 文件處理 SPA 路由

## 📱 響應式設計斷點

- 手機版 (< 768px)
- 平板版 (768px - 1024px)
- 桌面版 (> 1024px)

## 🎨 設計系統

### 顏色系統
- Primary: 主題色（金色系）
- Earth: 大地色系
- 輔助色系統

### 字體系統
- 標題: 粗體
- 內文: 常規字重
- 響應式字體大小

## 🔄 持續整合/持續部署 (CI/CD)

- 使用 GitHub Actions 進行自動化測試
- Cloudflare Pages 自動部署
- ESLint 代碼質量控制

## 📈 性能優化

- 圖片懶加載
- 組件按需加載
- 樣式優化
- 快取策略

## 🤝 貢獻指南

1. Fork 本專案
2. 創建特性分支
3. 提交更改
4. 發起 Pull Request

## 📄 授權

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 文件了解詳情

## 👥 團隊

- 前端開發
- UI/UX 設計
- 內容策劃

## 📞 聯絡我們

- 網站: [https://dog-web-1y6.pages.dev/](https://dog-web-1y6.pages.dev/)
- Email: [您的郵箱]
- 社交媒體連結 