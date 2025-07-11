// 測試 ScrollText 動畫邏輯
const puppeteer = require('puppeteer');

async function testScrollAnimation() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // 前往首頁
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // 等待 ScrollText 元件載入
    await page.waitForSelector('[data-testid="scroll-text"]', { timeout: 10000 });
    
    // 滾動到 ScrollText 區域
    await page.evaluate(() => {
      const scrollTextSection = document.querySelector('section');
      if (scrollTextSection) {
        scrollTextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    // 等待一下讓動畫觸發
    await page.waitForTimeout(2000);
    
    // 檢查文字是否有高亮顯示
    const highlightedText = await page.evaluate(() => {
      const listItems = document.querySelectorAll('li');
      const highlighted = [];
      
      listItems.forEach((item, index) => {
        const opacity = window.getComputedStyle(item).opacity;
        if (parseFloat(opacity) > 0.5) {
          highlighted.push({
            index,
            text: item.textContent.trim(),
            opacity: opacity
          });
        }
      });
      
      return highlighted;
    });
    
    console.log('高亮顯示的文字:', highlightedText);
    
    // 檢查小狗圖標是否顯示
    const dogIcon = await page.evaluate(() => {
      const dogElement = document.querySelector('.animate-bounce');
      if (dogElement) {
        const parent = dogElement.parentElement;
        const style = window.getComputedStyle(parent);
        return {
          opacity: style.opacity,
          visibility: style.visibility,
          top: style.top
        };
      }
      return null;
    });
    
    console.log('小狗圖標狀態:', dogIcon);
    
    // 進行滾動測試
    await page.evaluate(() => {
      window.scrollBy(0, 200);
    });
    
    await page.waitForTimeout(1000);
    
    // 再次檢查高亮狀態
    const highlightedAfterScroll = await page.evaluate(() => {
      const listItems = document.querySelectorAll('li');
      const highlighted = [];
      
      listItems.forEach((item, index) => {
        const opacity = window.getComputedStyle(item).opacity;
        if (parseFloat(opacity) > 0.5) {
          highlighted.push({
            index,
            text: item.textContent.trim(),
            opacity: opacity
          });
        }
      });
      
      return highlighted;
    });
    
    console.log('滾動後高亮顯示的文字:', highlightedAfterScroll);
    
    console.log('動畫測試完成');
    
    // 保持瀏覽器開啟以供手動檢查
    await page.waitForTimeout(5000);
    await browser.close();
    
  } catch (error) {
    console.error('測試失敗:', error);
  }
}

// 檢查是否有 puppeteer
try {
  testScrollAnimation();
} catch (error) {
  console.log('無法運行自動化測試，請手動檢查 http://localhost:3000');
  console.log('滾動到 ScrollText 區域並檢查：');
  console.log('1. 文字是否會隨滾動高亮顯示');
  console.log('2. 小狗圖標是否會移動');
  console.log('3. 過渡動畫是否流暢');
}