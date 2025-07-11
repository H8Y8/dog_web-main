'use client'

import React, { useEffect, useRef, useState } from 'react'

const ScrollText = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [shouldHideDog, setShouldHideDog] = useState(false);
  const lastScrollTop = useRef(0);
  const prevActiveIndex = useRef(-1);
  const [dotSpacing, setDotSpacing] = useState(95);
  const [activeDistance, setActiveDistance] = useState(50);

  useEffect(() => {
    const updateSpacingAndDistance = () => {
      if (window.innerWidth < 768) {
        setDotSpacing(71);
        setActiveDistance(35);
      } else if (window.innerWidth < 1024) {
        setDotSpacing(82);
        setActiveDistance(50);
      } else {
        setDotSpacing(95);
        setActiveDistance(50);
      }
    };

    updateSpacingAndDistance();
    window.addEventListener('resize', updateSpacingAndDistance);
    return () => window.removeEventListener('resize', updateSpacingAndDistance);
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!titleRef.current || !listRef.current) return;

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
      
      let minDistance = Infinity;
      let newActiveIndex = -1;
      
      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(titleCenter - itemCenter);

        if (distance < minDistance) {
          minDistance = distance;
          newActiveIndex = (distance < activeDistance && index < 8) ? index : -1;
        }

        if (distance < activeDistance) {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'scale(1.05)';
          (item as HTMLElement).style.color = '#ecc565';
          (item as HTMLElement).style.textShadow = '0 0 20px rgba(236, 197, 101, 0.2)';
        } else {
          (item as HTMLElement).style.opacity = '0.15';
          (item as HTMLElement).style.transform = 'scale(1)';
          (item as HTMLElement).style.color = '#e8b744';
          (item as HTMLElement).style.textShadow = 'none';
        }
      });

      const lastItemDistance = lastItemCenter - windowCenter;

      if (lastItemDistance < 0) {
        const opacity = Math.max(0, 1 + lastItemDistance / 200);
        titleRef.current.style.opacity = opacity.toString();
      } else {
        titleRef.current.style.opacity = '1';
      }

      if (isScrollingUp && prevActiveIndex.current >= 0 && newActiveIndex === -1) {
        setShouldHideDog(true);
      } else if (newActiveIndex >= 0) {
        setShouldHideDog(false);
      } else {
        setShouldHideDog(true);
      }

          prevActiveIndex.current = newActiveIndex;
          setActiveIndex(newActiveIndex);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-earth-900 break-words">
                我們<br />能夠
              </h2>
            </div>
          </div>
          
          {/* 右側滾動列表 */}
          <div className="w-3/4 pl-4 sm:pl-6 md:pl-8 relative">
            <div className="h-[400px] md:h-[400px]"></div>

            {/* 互動式路徑 - 只在 md 以上顯示 */}
            <div className="absolute hidden md:block left-[4%] lg:left-[6%] top-[400px] md:top-[430px] md:h-[580px] lg:h-[680px] w-px bg-primary-200">
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
                
                {/* 移動的小狗圖標 */}
                <div
                  className="absolute -ml-6 transition-all duration-500 ease-in-out"
                  style={{
                    top: `${activeIndex >= 0 ? activeIndex * dotSpacing : 0}px`,
                    transform: 'translate(25%, -75%)',
                    opacity: shouldHideDog || activeIndex < 0 ? '0' : '1',
                    visibility: shouldHideDog || activeIndex < 0 ? 'hidden' : 'visible',
                    pointerEvents: 'none'
                  }}
                >
                  <div className="animate-bounce text-3xl">🐕</div>
                </div>
              </div>
            </div>

            {/* 文字列表 */}
            <div className="pl-[0%] md:pl-[12%] lg:pl-[15%]">
              <ul ref={listRef} className="space-y-6 sm:space-y-8 md:space-y-9 pb-[50vh] relative z-10">
                <li className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform break-words will-change-transform">
                  提供專業育種服務
                </li>
                <li className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform break-words will-change-transform">
                  培育優質幼犬
                </li>
                <li className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform break-words will-change-transform">
                  提供健康保障
                </li>
                <li className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform break-words will-change-transform">
                  進行行為訓練
                </li>
                <li className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform break-words will-change-transform">
                  提供寄宿服務
                </li>
                <li className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform break-words will-change-transform">
                  進行疾病預防
                </li>
                <li className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform break-words will-change-transform">
                  提供飼養指導
                </li>
                <li className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-500 transition-all duration-700 ease-out opacity-15 transform break-words will-change-transform">
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