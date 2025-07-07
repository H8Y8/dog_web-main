#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// 照片類型配置
const photoConfigs = {
  gallery: { width: 1200, height: 800, quality: 85, maxSize: 200 },
  puppies: { width: 800, height: 600, quality: 90, maxSize: 150 },
  environment: { width: 1200, height: 800, quality: 85, maxSize: 200 },
  diary: { width: 600, height: 400, quality: 80, maxSize: 100 },
  hero: { width: 1920, height: 1080, quality: 82, maxSize: 300 }
}

/**
 * 優化單張照片
 * @param {string} inputPath - 輸入照片路徑
 * @param {string} outputPath - 輸出照片路徑  
 * @param {object} config - 優化配置
 */
async function optimizePhoto(inputPath, outputPath, config) {
  try {
    const { width, height, quality } = config
    
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: quality,
        progressive: true 
      })
      .toFile(outputPath)
    
    // 檢查檔案大小
    const stats = fs.statSync(outputPath)
    const sizeKB = Math.round(stats.size / 1024)
    
    console.log(`✅ ${path.basename(outputPath)} - ${sizeKB}KB`)
    
    if (sizeKB > config.maxSize) {
      console.warn(`⚠️  檔案大小 ${sizeKB}KB 超過建議的 ${config.maxSize}KB`)
    }
    
    return true
  } catch (error) {
    console.error(`❌ 處理失敗 ${inputPath}:`, error.message)
    return false
  }
}

/**
 * 批量處理照片
 * @param {string} type - 照片類型 (gallery, puppies, environment, diary)
 */
async function processPhotos(type) {
  const config = photoConfigs[type]
  if (!config) {
    console.error(`❌ 不支援的照片類型: ${type}`)
    return
  }
  
  const inputDir = `photos-source/candidates/${type}`
  const outputDir = `public/images/${type === 'puppies' ? 'puppies-detail' : 
                                    type === 'environment' ? 'environment-detail' : 
                                    type === 'diary' ? 'diary-photos' : 
                                    type === 'hero' ? 'hero' : 'gallery'}`
  
  // 檢查輸入目錄
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ 輸入目錄不存在: ${inputDir}`)
    console.log(`💡 請先在 ${inputDir} 放入要處理的照片`)
    return
  }
  
  // 創建輸出目錄
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  const files = fs.readdirSync(inputDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
  
  if (files.length === 0) {
    console.log(`📂 ${inputDir} 目錄中沒有找到照片檔案`)
    return
  }
  
  console.log(`🚀 開始處理 ${files.length} 張 ${type} 照片...`)
  
  let successCount = 0
  for (const file of files) {
    const inputPath = path.join(inputDir, file)
    const outputName = path.parse(file).name + '.jpg'
    const outputPath = path.join(outputDir, outputName)
    
    const success = await optimizePhoto(inputPath, outputPath, config)
    if (success) successCount++
  }
  
  console.log(`\n✨ 完成！成功處理 ${successCount}/${files.length} 張照片`)
  console.log(`📁 輸出位置: ${outputDir}`)
}

/**
 * 主函數
 */
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
📸 照片優化工具使用說明

用法: node scripts/optimize-photos.js <類型>

照片類型:
  gallery      - 畫廊展示照片 (1200x800, 85%品質)
  puppies      - 幼犬詳細照片 (800x600, 90%品質)  
  environment  - 環境介紹照片 (1200x800, 85%品質)
  diary        - 日誌文章照片 (600x400, 80%品質)
  hero         - 首頁輪播照片 (1920x1080, 90%品質)
  all          - 處理所有類型

範例:
  node scripts/optimize-photos.js hero
  node scripts/optimize-photos.js gallery
  node scripts/optimize-photos.js all

📂 請確保照片已放置在對應的 photos-source/candidates/ 子目錄中
`)
    return
  }
  
  const type = args[0].toLowerCase()
  
  if (type === 'all') {
    for (const photoType of Object.keys(photoConfigs)) {
      console.log(`\n--- 處理 ${photoType} 照片 ---`)
      await processPhotos(photoType)
    }
  } else {
    await processPhotos(type)
  }
}

// 檢查是否安裝了 sharp
try {
  require.resolve('sharp')
} catch (e) {
  console.error(`❌ 請先安裝 sharp 套件: npm install sharp`)
  process.exit(1)
}

main().catch(console.error) 