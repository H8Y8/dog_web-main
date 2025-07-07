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

  useEffect(() => {
    const updateSpacingAndDistance = () => {
      if (window.innerWidth < 768) {  // md breakpoint
        setDotSpacing(71);  // 手機版較小的間距
        setActiveDistance(35);  // 手機版較小的判斷距離
      } else if (window.innerWidth < 1024) {
        setDotSpacing(82);  // 平板和桌面版保持原來的間距
        setActiveDistance(50);  // 平板和桌面版原來的判斷距離
      } else {
        setDotSpacing(95);  // 平板和桌面版保持原來的間距
        setActiveDistance(50);  // 平板和桌面版原來的判斷距離
      }
    };

    updateSpacingAndDistance();
    window.addEventListener('resize', updateSpacingAndDistance);
    return () => window.removeEventListener('resize', updateSpacingAndDistance);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!titleRef.current || !listRef.current) return;

      // 檢測滾動方向
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingUp = st < lastScrollTop.current;
      lastScrollTop.current = st <= 0 ? 0 : st;

      const titleRect = titleRef.current.getBoundingClientRect();
      const titleCenter = titleRect.top + titleRect.height / 2;
      const items = listRef.current.querySelectorAll('li');
      const lastItem = items[items.length - 1];
      const lastItemRect = lastItem.getBoundingClientRect();
      const lastItemCenter = lastItemRect.top + lastItemRect.height / 2;

      const windowCenter = window.innerHeight / 2;
      
      // 找出最接近標題中心的項目
      let minDistance = Infinity;
      let newActiveIndex = -1;  // 預設為 -1
      
      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(titleCenter - itemCenter);

        if (distance < minDistance) {
          minDistance = distance;
          // 使用動態的判斷距離
          newActiveIndex = (distance < activeDistance && index < 8) ? index : -1;
        }

        // 使用動態的判斷距離
        if (distance < activeDistance) {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'scale(1.05)';
          (item as HTMLElement).style.color = 'var(--primary-400)';
          (item as HTMLElement).style.textShadow = '0 0 20px rgba(236, 197, 101, 0.2)';
        } else {
          (item as HTMLElement).style.opacity = '0.15';
          (item as HTMLElement).style.transform = 'scale(1)';
          (item as HTMLElement).style.color = '';
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
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化時執行一次

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dotSpacing, activeDistance]);

  return (
    <section className="relative bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex pt-32">
          {/* 左側固定文字 */}
          <div className="w-1/4 relative">
            <div ref={titleRef} className="sticky top-1/2 -translate-y-1/2 transition-opacity duration-700">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-earth-900">
                我們<br />能夠
              </h2>
            </div>
          </div>
          
          {/* 右側滾動列表 */}
          <div className="w-3/4 pl-8 relative">
            <div className="h-[400px] md:h-[400px]"></div>

            {/* 互動式路徑 - 只在 md 以上顯示 */}
            <div className="absolute hidden md:block left-[6%] top-[430px] md:h-[580px] lg:h-[680px] w-px bg-primary-200">
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
                <div className="animate-bounce text-3xl">
                  <img src="/images/SCROLL.png" alt="小狗" className="w-64 h-6" />
                </div>
              </div>
            </div>

            {/* 文字列表 */}
            <div className="pl-[0%] md:pl-[15%]">
              <ul ref={listRef} className="space-y-9 pb-[50vh] relative z-10">
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