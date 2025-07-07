import { Link } from 'react-router-dom';
import HeroSlider from './HeroSlider';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景輪播 */}
      <HeroSlider />

      {/* 內容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-earth-50">
        <h1 
          className="text-5xl sm:text-7xl font-bold mb-6 drop-shadow-lg text-primary-900"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          雷歐犬舍訓練工作室
        </h1>
        <p 
          className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-lg text-earth-	50"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          專業繁育優質蘇格蘭㹴，為您的家庭帶來忠誠的陪伴
        </p>
        <div 
          className="space-x-4"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <Link
            to="/puppies"
            className="inline-block bg-primary-500 text-earth-50 px-8 py-3 rounded-full font-semibold hover:bg-primary-400 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            查看幼犬
          </Link>
          <Link
            to="/about"
            className="inline-block bg-transparent border-2 border-earth-100 text-earth-50 px-8 py-3 rounded-full font-semibold hover:bg-earth-100/10 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            了解更多
          </Link>
        </div>
      </div>

      {/* 向下滾動提示 */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-earth-100 animate-bounce"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero; 