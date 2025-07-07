#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// 需要優化的大檔案列表
const largeFiles = [
  'public/images/28764790_l.jpg',
  'public/images/certificates/pedigree.jpg',
  'public/images/trainer-scottie.jpg'
]

/**
 * 優化單張現有照片
 */
async function optimizeExistingPhoto(filePath) {
  try {
    // 檢查檔案是否存在
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  檔案不存在: ${filePath}`)
      return false
    }
    
    // 獲取原始檔案大小
    const originalStats = fs.statSync(filePath)
    const originalSizeMB = Math.round(originalStats.size / 1024 / 1024 * 100) / 100
    
    console.log(`🔧 正在優化: ${filePath} (${originalSizeMB}MB)`)
    
    // 創建備份
    const backupPath = filePath.replace(/(\.[^.]+)$/, '.backup$1')
    fs.copyFileSync(filePath, backupPath)
    console.log(`📋 已備份: ${backupPath}`)
    
    // 根據檔案路徑決定優化參數
    let width, quality
    if (filePath.includes('certificates')) {
      // 證書類照片保持較高品質
      width = 1200
      quality = 90
    } else {
      // 一般展示照片
      width = 1200
      quality = 85
    }
    
    // 優化照片
    await sharp(filePath)
      .resize(width, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: quality,
        progressive: true 
      })
      .toFile(filePath + '.temp')
    
    // 替換原檔案
    fs.renameSync(filePath + '.temp', filePath)
    
    // 檢查優化後大小
    const newStats = fs.statSync(filePath)
    const newSizeMB = Math.round(newStats.size / 1024 / 1024 * 100) / 100
    const reduction = Math.round((1 - newStats.size / originalStats.size) * 100)
    
    console.log(`✅ 完成: ${newSizeMB}MB (減少${reduction}%)`)
    
    return true
  } catch (error) {
    console.error(`❌ 優化失敗 ${filePath}:`, error.message)
    return false
  }
}

/**
 * 掃描並優化所有大檔案
 */
async function optimizeAllLargeFiles() {
  console.log('🚀 開始優化現有的大圖片檔案...\n')
  
  let successCount = 0
  
  for (const filePath of largeFiles) {
    const success = await optimizeExistingPhoto(filePath)
    if (success) successCount++
    console.log() // 空行分隔
  }
  
  console.log(`✨ 優化完成！成功處理 ${successCount}/${largeFiles.length} 個檔案`)
  
  if (successCount > 0) {
    console.log('\n💡 提示:')
    console.log('• 原檔案已備份為 .backup 檔案')
    console.log('• 可以執行 npm run deploy-check 重新檢查')
    console.log('• 如需還原，可以將 .backup 檔案重新命名')
  }
}

/**
 * 還原備份檔案
 */
function restoreBackups() {
  console.log('🔄 還原備份檔案...\n')
  
  let restoredCount = 0
  
  for (const filePath of largeFiles) {
    const backupPath = filePath.replace(/(\.[^.]+)$/, '.backup$1')
    
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath)
      console.log(`✅ 已還原: ${filePath}`)
      restoredCount++
    } else {
      console.log(`⚠️  備份不存在: ${backupPath}`)
    }
  }
  
  console.log(`\n✨ 還原完成！成功還原 ${restoredCount} 個檔案`)
}

/**
 * 清理備份檔案
 */
function cleanBackups() {
  console.log('🧹 清理備份檔案...\n')
  
  let cleanedCount = 0
  
  for (const filePath of largeFiles) {
    const backupPath = filePath.replace(/(\.[^.]+)$/, '.backup$1')
    
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath)
      console.log(`🗑️  已刪除: ${backupPath}`)
      cleanedCount++
    }
  }
  
  console.log(`\n✨ 清理完成！刪除 ${cleanedCount} 個備份檔案`)
}

/**
 * 主函數
 */
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🖼️  現有圖片優化工具

用法:
  node scripts/optimize-existing.js          # 優化所有大檔案
  node scripts/optimize-existing.js restore  # 還原備份檔案
  node scripts/optimize-existing.js clean    # 清理備份檔案

此工具會:
• 自動備份原檔案
• 壓縮和調整大圖片檔案
• 保持適當的品質和尺寸
`)
    return
  }
  
  if (args.includes('restore')) {
    restoreBackups()
  } else if (args.includes('clean')) {
    cleanBackups()
  } else {
    await optimizeAllLargeFiles()
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