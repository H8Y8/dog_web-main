'use client'

import { useEffect, useRef, useState } from 'react';

const ScrollText = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [shouldHideDog, setShouldHideDog] = useState<boolean>(false);
  const lastScrollTop = useRef<number>(0);
  const prevActiveIndex = useRef<number>(-1);
  const [dotSpacing, setDotSpacing] = useState<number>(95);
  const [activeDistance, setActiveDistance] = useState<number>(50);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateSpacingAndDistance = () => {
      if (window.innerWidth < 768) {  // md breakpoint
        setDotSpacing(71);  // 手機版較小的間距
        setActiveDistance(40);  // 手機版較嚴格的判斷距離
      } else if (window.innerWidth < 1024) {
        setDotSpacing(82);  // 平板和桌面版保持原來的間距
        setActiveDistance(60);  // 平板和桌面版較嚴格的判斷距離
      } else {
        setDotSpacing(95);  // 平板和桌面版保持原來的間距
        setActiveDistance(80);  // 平板和桌面版較嚴格的判斷距離
      }
    };

    updateSpacingAndDistance();
    window.addEventListener('resize', updateSpacingAndDistance);
    return () => window.removeEventListener('resize', updateSpacingAndDistance);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!titleRef.current || !listRef.current || !sectionRef.current) return;

      // 檢測滾動方向
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingUp = st < lastScrollTop.current;
      lastScrollTop.current = st <= 0 ? 0 : st;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const windowCenter = window.innerHeight / 2;
      
      // 計算「我們能夠」的動態位置
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      const sectionCenter = sectionTop + sectionHeight / 2;
      
      let titlePosition = 0;
      
      const items = listRef.current.querySelectorAll('li');
      
      // 動態定位邏輯 - 平滑從下方進入到文字列表中間位置
      const viewportHeight = window.innerHeight;
      
      // 計算第4項（進行行為訓練）的位置作為參考
      const middleItemIndex = 3; // 第4項 (0-based index)
      const middleItemRect = items[middleItemIndex].getBoundingClientRect();
      const middleItemPositionInSection = middleItemRect.top - sectionTop;
      
      // 目標位置：讓標題與文字列表中間項目對齊
      const finalTargetPosition = middleItemPositionInSection - 80; // 減去標題高度的一半
      
      if (sectionTop >= viewportHeight) {
        // Section 還在視窗下方，標題從螢幕下方開始
        titlePosition = viewportHeight + 100; // 從視窗下方100px開始
      } else if (sectionTop > viewportHeight / 2) {
        // Section 開始進入視窗，標題從下方平滑上升
        const progress = (viewportHeight - sectionTop) / (viewportHeight / 2);
        titlePosition = (viewportHeight + 100) * (1 - progress);
      } else if (sectionTop > -200) {
        // Section 繼續進入，標題移動到螢幕中心
        const progress = (viewportHeight / 2 - sectionTop) / (viewportHeight / 2 + 200);
        const centerPosition = viewportHeight / 2 - 80;
        titlePosition = centerPosition * progress;
      } else if (sectionTop > -400) {
        // 平滑過渡：從螢幕中心移動到文字列表中間位置
        const centerPosition = viewportHeight / 2 - 80;
        const progress = (-200 - sectionTop) / 200; // 200px的過渡距離
        titlePosition = centerPosition + (finalTargetPosition - centerPosition) * progress;
      } else if (sectionTop > -(sectionHeight - 200)) {
        // Section 在視窗中，標題停在文字列表中心位置
        titlePosition = finalTargetPosition;
      } else {
        // Section 即將離開，標題跟隨移動並準備淡出
        const beyondCenter = Math.abs(sectionTop) - (sectionHeight - 200);
        titlePosition = finalTargetPosition + beyondCenter;
      }
      
      // 應用標題位置，添加平滑過渡
      titleRef.current.style.transform = `translateY(${titlePosition}px)`;
      titleRef.current.style.transition = 'transform 0.05s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      const lastItem = items[items.length - 1];
      const lastItemRect = lastItem.getBoundingClientRect();
      const lastItemCenter = lastItemRect.top + lastItemRect.height / 2;
      
      // Debug: 檢查關鍵位置
      const centerPosition = viewportHeight / 2 - 80;
      console.log('ScrollText: 位置資訊', { 
        sectionTop: sectionTop.toFixed(0), 
        titlePosition: titlePosition.toFixed(0),
        finalTargetPosition: finalTargetPosition.toFixed(0),
        centerPosition: centerPosition.toFixed(0),
        phase: sectionTop >= viewportHeight ? '1-準備' : 
               sectionTop > viewportHeight / 2 ? '2-上升' :
               sectionTop > -200 ? '3-到中心' :
               sectionTop > -400 ? '4-過渡' :
               sectionTop > -(sectionHeight - 200) ? '5-停在列表' : '6-離開'
      });
      
      // 找出最接近標題中心的項目
      let minDistance = Infinity;
      let newActiveIndex = -1;  // 預設為 -1
      
      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        
        // 修正：使用視窗中心作為參考點，而不是 titleCenter
        const distance = Math.abs(windowCenter - itemCenter);

        if (distance < minDistance) {
          minDistance = distance;
          // 使用動態的判斷距離，確保只有一個項目被選中
          newActiveIndex = (distance < activeDistance && index < 8) ? index : -1;
        }
      });

      // 第二次遍歷：只有最接近中心的項目會被高亮
      items.forEach((item, index) => {
        if (index === newActiveIndex) {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'scale(1.05)';
          (item as HTMLElement).style.color = '#ecc565'; // 直接使用primary-400顏色
          (item as HTMLElement).style.textShadow = '0 0 20px rgba(236, 197, 101, 0.2)';
          console.log('ScrollText: 文字高亮', { index, minDistance: minDistance.toFixed(0), activeDistance });
        } else {
          (item as HTMLElement).style.opacity = '0.15';
          (item as HTMLElement).style.transform = 'scale(1)';
          (item as HTMLElement).style.color = '#e8b744'; // 恢復原本的primary-500顏色
          (item as HTMLElement).style.textShadow = 'none';
        }
      });

      // 計算最後一個項目與視窗中心的距離
      const lastItemDistance = lastItemCenter - windowCenter;

      // 當最後一個項目開始向上移動時，計算標題的透明度
      if (lastItemDistance < 0) {
        const opacity = Math.max(0, 1 + lastItemDistance / 200); // 200px 的淡化距離
        titleRef.current.style.opacity = opacity.toString();
      } else {
        titleRef.current.style.opacity = '1';
      }

      // 特殊情況處理：向上滾動且即將離開路徑
      if (isScrollingUp && prevActiveIndex.current >= 0 && newActiveIndex === -1) {
        // 將要滾動出路徑時立即隱藏小狗
        setShouldHideDog(true);
      } else if (newActiveIndex >= 0) {
        // 在路徑上時顯示小狗
        setShouldHideDog(false);
      } else {
        // 不在路徑上時隱藏小狗
        setShouldHideDog(true);
      }

      prevActiveIndex.current = newActiveIndex;
      setActiveIndex(newActiveIndex);
      
      // Debug: 檢查activeIndex變化
      console.log('ScrollText: activeIndex更新', { 
        newActiveIndex, 
        shouldHideDog, 
        minDistance: minDistance.toFixed(0), 
        activeDistance,
        windowCenter
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化時執行一次

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dotSpacing, activeDistance]);

  return (
    <section ref={sectionRef} className="relative bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex pt-32">
          {/* 左側固定文字 */}
          <div className="w-1/4 relative">
            <div ref={titleRef} className="absolute top-0 transition-opacity duration-700">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-earth-900">
                我們<br />能夠
              </h2>
            </div>
          </div>
          
          {/* 右側滾動列表 */}
          <div className="w-3/4 pl-8 relative">
            <div className="h-[10px] md:h-[10px]"></div>

            {/* 互動式路徑 - 只在 md 以上顯示 */}
            <div 
              className="absolute hidden md:block left-[6%] top-[50px] w-px bg-primary-200"
              style={{ height: `${7 * dotSpacing }px` }}
            >
              <div className="relative h-full">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className={`absolute left-0 w-4 h-4 rounded-full -ml-[7px] transition-all duration-700 ${
                      index === activeIndex 
                        ? 'bg-primary-500 scale-125 shadow-lg shadow-primary-500/50' 
                        : 'bg-primary-200'
                    }`}
                    style={{ 
                      top: `${index * dotSpacing}px`,
                      transform: 'translate(0%, 0%)',
                      transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                ))}
              </div>
              
              {/* 移動的小狗圖標 */}
              <div
                className="absolute -ml-6"
                style={{
                  top: `${activeIndex >= 0 ? activeIndex * dotSpacing : 0}px`,
                  transform: 'translate(25%, -75%)',
                  opacity: shouldHideDog ? '0' : '1',
                  visibility: shouldHideDog ? 'hidden' : 'visible',
                  pointerEvents: 'none',
                  transition: `
                    opacity ${shouldHideDog ? '0s' : '0.7s'} cubic-bezier(0.4, 0, 0.2, 1),
                    top 0.5s cubic-bezier(0.4, 0, 0.2, 1)
                  `
                }}
              >
                <div className="animate-bounce text-3xl">🐕</div>
              </div>
            </div>

            {/* 文字列表 */}
            <div className="pl-[0%] md:pl-[15%]">
              <ul ref={listRef} className="space-y-9 pb-32 relative z-10">
                <li className="text-2xl md:text-5xl lg:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform">
                  提供專業育種服務
                </li>
                <li className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform">
                  培育優質幼犬
                </li>
                <li className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform">
                  提供健康保障
                </li>
                <li className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform">
                  進行行為訓練
                </li>
                <li className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform">
                  提供寄宿服務
                </li>
                <li className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform">
                  進行疾病預防
                </li>
                <li className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform">
                  提供飼養指導
                </li>
                <li className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform">
                  創造快樂回憶
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollText; 