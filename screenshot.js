const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 監聽控制台訊息
  page.on('console', msg => {
    if (msg.text().includes('🔍') || msg.text().includes('🏗️') || msg.text().includes('📋') || msg.text().includes('📊')) {
      console.log('📺 Browser Console:', msg.text());
    }
  });
  
  console.log('🚀 導航到首頁 http://localhost:3001');
  await page.goto('http://localhost:3001');
  
  console.log('⏳ 等待 4 秒讓 AOS 初始化和 Layout 渲染');
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  console.log('📸 截圖首頁');
  await page.screenshot({ 
    path: 'homepage-screenshot.png',
    fullPage: true
  });
  
  console.log('✅ 截圖完成: homepage-screenshot.png');
  
  await browser.close();
})().catch(console.error);