import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { useEffect, useRef, useCallback } from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/slider.css';

const slides = [
  {
    image: '/images/28764790_l.jpg',
  },
  {
    image: '/images/1000_F_184323995_qYc0OuK8t48JlXNp8AyIvQeFo283FG1w.jpg',
  },
  {
    image: '/images/scottish-dog-names-4843331-hero-cc1388c0fc5a4b609a9bc46dc566397e.jpg',
  },
  {
    image: '/images/Scottishterrieroutside-5af801f8056a4a00a01b032a8da8eabf.jpg',
  }
];

const HeroSlider = () => {
  const swiperRef = useRef(null);

  const getRandomTransform = useCallback(() => {
    const transforms = [
      { x: '2%', y: '2%' },
      { x: '-2%', y: '2%' },
      { x: '2%', y: '-2%' },
      { x: '-2%', y: '-2%' },
      { x: '0', y: '2%' },
      { x: '0', y: '-2%' },
      { x: '2%', y: '0' },
      { x: '-2%', y: '0' },
    ];
    return transforms[Math.floor(Math.random() * transforms.length)];
  }, []);

  // 為所有圖片設置初始變換
  const initializeAllSlides = useCallback(() => {
    const slides = document.querySelectorAll('.swiper-slide img');
    slides.forEach(slide => {
      const { x, y } = getRandomTransform();
      slide.style.setProperty('--translate-x', x);
      slide.style.setProperty('--translate-y', y);
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
          activeSlide.style.setProperty('--translate-x', x);
          activeSlide.style.setProperty('--translate-y', y);
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
        className="h-full w-full"
        onSwiper={(swiper) => {
          swiperRef.current = swiper.el;
          // 初始化所有圖片的變換效果
          initializeAllSlides();
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={slide.image}
                alt="蘇格蘭㹴"
                className="w-full h-full object-cover object-[center_35%] slide-image"
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