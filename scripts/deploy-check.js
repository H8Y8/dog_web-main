#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * 檢查照片大小
 */
function checkPhotoSizes() {
  const photoDirs = [
    'public/images/gallery',
    'public/images/puppies-detail', 
    'public/images/environment-detail',
    'public/images/diary-photos',
    'public/images/hero'
  ]
  
  let totalSize = 0
  let totalCount = 0
  const oversizedFiles = []
  
  console.log('📊 檢查照片大小...\n')
  
  photoDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`📂 ${dir} - 目錄不存在，跳過`)
      return
    }
    
    const files = fs.readdirSync(dir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    
    let dirSize = 0
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stats = fs.statSync(filePath)
      const sizeKB = Math.round(stats.size / 1024)
      
      dirSize += stats.size
      totalSize += stats.size
      totalCount++
      
      // 檢查過大的檔案
      if (sizeKB > 300) {
        oversizedFiles.push({ path: filePath, size: sizeKB })
      }
    })
    
    console.log(`📁 ${dir}: ${files.length} 檔案, ${Math.round(dirSize / 1024)}KB`)
  })
  
  const totalMB = Math.round(totalSize / 1024 / 1024 * 100) / 100
  
  console.log(`\n📈 總計: ${totalCount} 張照片, ${totalMB}MB`)
  
  // 警告過大的檔案
  if (oversizedFiles.length > 0) {
    console.log('\n⚠️  發現過大的檔案:')
    oversizedFiles.forEach(file => {
      console.log(`   ${file.path} - ${file.size}KB`)
    })
    console.log('\n💡 建議重新優化這些檔案')
  }
  
  // 建議
  if (totalMB > 10) {
    console.log('\n⚠️  照片總大小超過10MB，可能影響載入速度')
  } else {
    console.log('\n✅ 照片大小符合部署要求')
  }
  
  return { totalMB, totalCount, oversizedFiles }
}

/**
 * 檢查是否有原始照片誤放
 */
function checkForSourcePhotos() {
  console.log('\n🔍 檢查是否有原始照片誤放...\n')
  
  const publicImages = 'public/images'
  let hasLargeFiles = false
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return
    
    const items = fs.readdirSync(dir)
    
    items.forEach(item => {
      const itemPath = path.join(dir, item)
      const stats = fs.statSync(itemPath)
      
      if (stats.isDirectory()) {
        scanDirectory(itemPath)
      } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(item)) {
        const sizeMB = stats.size / 1024 / 1024
        
        if (sizeMB > 1) { // 大於1MB的照片
          console.log(`⚠️  大檔案: ${itemPath} - ${Math.round(sizeMB * 100) / 100}MB`)
          hasLargeFiles = true
        }
      }
    })
  }
  
  scanDirectory(publicImages)
  
  if (!hasLargeFiles) {
    console.log('✅ 沒有發現過大的照片檔案')
  }
  
  return !hasLargeFiles
}

/**
 * 生成部署報告
 */
function generateDeployReport() {
  console.log('\n📋 部署前檢查報告')
  console.log('==================\n')
  
  const photoCheck = checkPhotoSizes()
  const sizeCheck = checkForSourcePhotos()
  
  console.log('\n📊 摘要:')
  console.log(`• 照片總數: ${photoCheck.totalCount || 0}`)
  console.log(`• 照片總大小: ${photoCheck.totalMB}MB`)
  console.log(`• 過大檔案: ${photoCheck.oversizedFiles.length}個`)
  console.log(`• 大小檢查: ${sizeCheck ? '通過' : '未通過'}`)
  
  if (photoCheck.totalMB > 20) {
    console.log('\n❌ 建議: 照片總大小過大，不建議部署')
    return false
  } else if (photoCheck.oversizedFiles.length > 0) {
    console.log('\n⚠️  建議: 優化過大的檔案後再部署') 
    return false
  } else {
    console.log('\n✅ 可以安全部署!')
    return true
  }
}

/**
 * 主函數
 */
function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📦 部署前檢查工具

用法:
  node scripts/deploy-check.js          # 完整檢查
  node scripts/deploy-check.js --size   # 只檢查照片大小
  node scripts/deploy-check.js --large  # 只檢查大檔案

此工具會檢查:
• 照片檔案大小是否合適部署
• 是否有原始照片誤放在public目錄
• 生成部署建議報告
`)
    return
  }
  
  if (args.includes('--size')) {
    checkPhotoSizes()
  } else if (args.includes('--large')) {
    checkForSourcePhotos()
  } else {
    generateDeployReport()
  }
}

main() 