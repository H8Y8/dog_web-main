'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { useEffect, useRef, useCallback } from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [

  {
    image: '/images/hero/首頁輪播003.jpg',
  },
  {
    image: '/images/hero/首頁輪播004.jpg',
  },
  {
    image: '/images/hero/首頁輪播006.jpg',
  },
  {
    image: '/images/hero/首頁輪播007.jpg',
  },
  {
    image: '/images/hero/首頁輪播008.jpg',
  },
  {
    image: '/images/hero/首頁輪播009.jpg',
  },
  {
    image: '/images/hero/首頁輪播010.jpg',
  }
];

const HeroSlider = () => {
  const swiperRef = useRef<HTMLElement | null>(null);

  const getRandomTransform = useCallback(() => {
    const transforms = [
      { x: '1%', y: '1%' },
      { x: '-1%', y: '1%' },
      { x: '1%', y: '-1%' },
      { x: '-1%', y: '-1%' },
      { x: '0', y: '1%' },
      { x: '0', y: '-1%' },
      { x: '1%', y: '0' },
      { x: '-1%', y: '0' },
    ];
    return transforms[Math.floor(Math.random() * transforms.length)];
  }, []);

  // 為所有圖片設置初始變換
  const initializeAllSlides = useCallback(() => {
    const slides = document.querySelectorAll('.swiper-slide img');
    slides.forEach(slide => {
      const { x, y } = getRandomTransform();
      (slide as HTMLElement).style.setProperty('--translate-x', x);
      (slide as HTMLElement).style.setProperty('--translate-y', y);
    });
  }, [getRandomTransform]);

  useEffect(() => {
    if (swiperRef.current) {
      // 初始化時為所有圖片設置變換
      initializeAllSlides();

      // 監聽輪播切換事件
      swiperRef.current.addEventListener('slidechange', () => {
        const activeSlide = document.querySelector('.swiper-slide-active img');
        if (activeSlide) {
          const { x, y } = getRandomTransform();
          (activeSlide as HTMLElement).style.setProperty('--translate-x', x);
          (activeSlide as HTMLElement).style.setProperty('--translate-y', y);
        }
      });
    }
  }, [initializeAllSlides, getRandomTransform]);

  return (
    <div className="absolute inset-0 z-0 h-screen">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        navigation={true}
        className="h-full w-full hero-swiper"
        onSwiper={(swiper) => {
          swiperRef.current = swiper.el as HTMLElement;
          // 初始化所有圖片的變換效果
          initializeAllSlides();
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={slide.image}
                alt="雷歐犬舍訓練工作室 - 專業蘇格蘭㹴犬舍"
                className="w-full h-full object-cover object-center slide-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-earth-800/20 via-earth-700/10 to-earth-800/20"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider; 