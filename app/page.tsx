import React from 'react'
import HeroSlider from './components/HeroSlider'
import ScrollText from './components/ScrollText'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-b from-primary-50 to-earth-50 flex items-center justify-center">
        <HeroSlider />
        <div className="text-center">
          <h1 
            className="text-4xl md:text-6xl font-bold text-primary-700 mb-4"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            蔡毛的狗窩
          </h1>
          <h2 
            className="text-2xl md:text-3xl text-earth-600 mb-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Scottish Terrier Kennel
          </h2>
          <p 
            className="text-lg text-earth-700 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            專業的蘇格蘭㹴犬舍，提供優質的蘇格蘭㹴幼犬、專業飼養建議、健康認證及完整的犬隻訓練服務。
          </p>
        </div>
      </div>
      
      {/* About Section - 暫時占位符 */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 
            className="text-3xl font-bold text-primary-700 mb-4"
            data-aos="fade-up"
          >
            關於我們
          </h3>
          <p 
            className="text-earth-600"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            組件正在從React遷移中...
          </p>
        </div>
      </div>
      
      {/* ScrollText Section */}
      <ScrollText />
      
      {/* Contact Section - 暫時占位符 */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 
            className="text-3xl font-bold text-primary-700 mb-4"
            data-aos="fade-up"
          >
            聯絡我們
          </h3>
          <p 
            className="text-earth-600"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Contact組件正在遷移中...
          </p>
        </div>
      </div>
    </div>
  )
} 