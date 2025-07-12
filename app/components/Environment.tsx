'use client'

import Image from 'next/image'
import { FadeUp } from './MotionWrapper'

const Environment = () => {
  // 環境區域配置
  const environmentAreas = [
    {
      id: 'classroom',
      title: '專業訓練教室',
      description: '配備完善的室內訓練空間，為蘇格蘭㹴提供專業的行為訓練和社會化教育',
      images: [
        { src: '/images/environment-detail/教室.jpg', alt: '主要訓練教室' },
        { src: '/images/environment-detail/教室1.jpg', alt: '訓練設備區' },
        { src: '/images/environment-detail/教室2.jpg', alt: '社會化訓練空間' }
      ],
      features: ['專業訓練設備', '安全防護措施', '舒適的學習環境', '個別化訓練空間']
    },
    {
      id: 'accommodation',
      title: '舒適住宿區',
      description: '溫馨舒適的住宿環境，確保每隻蘇格蘭㹴都能享受到家一般的溫暖與照護',
      images: [
        { src: '/images/environment-detail/住宿區.jpg', alt: '住宿區主要空間' },
        { src: '/images/environment-detail/住宿區2.jpg', alt: '個別住宿間' },
        { src: '/images/environment-detail/住宿區3.jpg', alt: '休息區域' }
      ],
      features: ['恆溫恆濕系統', '24小時監控', '舒適寢具', '定期清潔消毒']
    },
    {
      id: 'playground',
      title: '陽台遊戲區',
      description: '寬敞的戶外活動空間，讓蘇格蘭㹴們能夠盡情玩耍，享受自然陽光與新鮮空氣',
      images: [
        { src: '/images/environment-detail/陽台遊戲區.jpg', alt: '戶外活動區' },
        { src: '/images/environment-detail/陽台遊戲區2.jpg', alt: '遊戲設施' },
        { src: '/images/environment-detail/陽台遊戲區3.jpg', alt: '戶外活動區' }
      ],
      features: ['安全圍欄設計', '充足陽光照射', '良好通風', '防滑地面']
    }
  ]

  return (
    <section className="py-16 bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-16">
          <FadeUp>
            <h2 className="text-4xl font-bold text-earth-900 mb-4">
              專業犬舍環境介紹
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-xl text-earth-700 mb-8">
              為蘇格蘭㹴提供最專業、最舒適的生活與訓練環境
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
          </FadeUp>
        </div>

        {/* 環境區域展示 */}
        {environmentAreas.map((area, index) => (
          <div key={area.id} className={`mb-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
            {/* 區域標題和描述 */}
            <FadeUp className="text-center mb-12">
              <h3 className="text-3xl font-bold text-earth-900 mb-4">{area.title}</h3>
              <p className="text-lg text-earth-700 max-w-3xl mx-auto">{area.description}</p>
            </FadeUp>

            {/* 圖片展示 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {area.images.map((image, imgIndex) => (
                <FadeUp 
                  key={imgIndex}
                  delay={imgIndex * 0.1}
                  className="relative group overflow-hidden rounded-xl shadow-lg"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-semibold">{image.alt}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* 特色功能 */}
            <FadeUp delay={0.3} className="bg-white rounded-xl p-8 shadow-lg">

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {area.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-earth-700">{feature}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        ))}

        {/* 底部總結 */}
        <FadeUp className="bg-primary-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">專業認證的犬舍環境</h3>
          <p className="text-xl mb-6">
            我們致力於為每隻蘇格蘭㹴提供最優質的生活環境，從專業訓練到舒適住宿，每個細節都體現我們的專業與用心
          </p>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">全天候監護</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">專業</div>
              <div className="text-primary-100">認證設備</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-primary-100">安全保障</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">用心</div>
              <div className="text-primary-100">專業服務</div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

export default Environment 