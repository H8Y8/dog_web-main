import React from 'react'
import HeroSlider from './components/HeroSlider'
import ScrollText from './components/ScrollText'
import { FadeIn, FadeLeft, FadeRight } from './components/MotionWrapper'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-b from-primary-50 to-earth-50 flex items-center justify-center">
        <HeroSlider />
        <div className="text-center">
          <FadeIn delay={0.1} className="text-4xl md:text-6xl font-bold text-white mb-4">
            雷歐犬舍訓練工作室
          </FadeIn>
          <FadeIn delay={0.2} className="text-2xl md:text-3xl text-white mb-8">
            Scottish Terrier Kennel
          </FadeIn>
          <FadeIn delay={0.3} className="text-lg text-white max-w-2xl mx-auto">
            專業的蘇格蘭㹴犬舍，提供優質的蘇格蘭㹴幼犬、專業飼養建議、健康認證及完整的犬隻訓練服務。
          </FadeIn>
        </div>
      </div>
      
      {/* About Section - 完整內容 */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-4xl font-bold text-earth-900 mb-4">關於我們</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-xl text-earth-700 mb-8">
                蘇格蘭㹴專業犬舍
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <FadeRight className="relative">
              <img
                src="/images/about-us/about-scottie.jpg"
                alt="蘇格蘭㹴"
                className="rounded-lg shadow-xl w-full h-80 md:h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/20 to-transparent rounded-lg"></div>
            </FadeRight>

            <FadeLeft className="space-y-4">
              <p className="text-lg text-earth-800 leading-relaxed">
                我們是一個專注於蘇格蘭㹴繁育的專業犬舍，擁有超過十年的育種經驗。結合傳統工藝與現代科技，致力於培育優質的蘇格蘭㹴幼犬。
              </p>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-earth-900">我們的三大堅持</h3>
                
                <div className="space-y-4">
                  <div className="bg-earth-100 p-6 rounded-lg">
                    <h4 className="text-xl font-semibold text-earth-900 mb-2">完美性格培育</h4>
                    <p className="text-earth-700">
                      蘇格蘭㹴以其忠誠、聰明和獨立的性格聞名。我們特別注重幼犬的早期社會化，確保每一隻狗狗都能成為理想的家庭伴侶。
                    </p>
                  </div>
                  
                  <div className="bg-earth-100 p-6 rounded-lg">
                    <h4 className="text-xl font-semibold text-earth-900 mb-2">優良血統傳承</h4>
                    <p className="text-earth-700">
                      我們的種犬均來自國際認證的純種血統，定期進行健康檢查，確保基因的純正與健康，為下一代奠定優良基礎。
                    </p>
                  </div>
                  
                  <div className="bg-earth-100 p-6 rounded-lg">
                    <h4 className="text-xl font-semibold text-earth-900 mb-2">專業醫療團隊</h4>
                    <p className="text-earth-700">
                      與專業獸醫團隊長期合作，提供完整的疫苗注射和健康檢查，確保每一隻幼犬都能健康茁壯成長。
                    </p>
                  </div>
                </div>
              </div>
            </FadeLeft>
          </div>

          {/* 專業訓練師介紹區塊 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeRight className="space-y-4">
              <h3 className="text-3xl font-bold text-earth-900 mb-4">專業訓練團隊</h3>
              <p className="text-lg text-earth-800 leading-relaxed mb-6">
                我們的訓練師團隊擁有豐富的蘇格蘭㹴培育經驗，專注於培養每一隻幼犬的優良特質。透過科學化的訓練方法，我們致力於發展狗狗的天賦潛能。
              </p>
              
              <div className="space-y-4">
                <div className="bg-earth-100 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-earth-900 mb-2">專業認證</h4>
                  <ul className="text-earth-700 space-y-2">
                    <li>• 國際認證寵物行為訓練師</li>
                    <li>• 蘇格蘭㹴專業育種認證</li>
                    <li>• 寵物美容師高級證照</li>
                    <li>• 犬隻行為矯正專家</li>
                  </ul>
                </div>
                
                <div className="bg-earth-100 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-earth-900 mb-2">持續服務</h4>
                  <p className="text-earth-700">
                    我們不只是賣家，更是您終身的訓練夥伴。定期舉辦飼主交流會，分享專業知識與經驗，協助您建立與愛犬的美好關係。提供：
                  </p>
                  <ul className="text-earth-700 mt-2 space-y-1">
                    <li>• 一對一專業訓練指導</li>
                    <li>• 定期寵物社交活動</li>
                    <li>• 行為問題諮詢服務</li>
                    <li>• 美容護理教學課程</li>
                  </ul>
                </div>
              </div>
            </FadeRight>

            <FadeLeft className="relative">
              <img
                src="/images/about-us/trainer-scottie.jpg"
                alt="專業訓練師"
                className="rounded-lg shadow-xl w-full h-80 md:h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/20 to-transparent rounded-lg"></div>
            </FadeLeft>
          </div>
        </div>
      </section>
      
      {/* ScrollText Section */}
      <ScrollText />
      
      {/* Contact Section - 完整內容 */}
      <section className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn className="flex justify-center mb-4">
              <img 
                src="/images/contact-icon.png" 
                alt="聯絡我們" 
                className="w-48 h-48"
              />
            </FadeIn>
            <FadeIn>
              <h2 className="text-4xl font-bold text-earth-900 mb-4">聯絡我們</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-xl text-earth-700">
                歡迎與我們聯繫，了解更多關於蘇格蘭㹴的資訊
              </p>
            </FadeIn>
          </div>

          <div className="max-w-6xl mx-auto">
            <FadeIn className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-xl card-motion">
              {/* 左側圖片 */}
              <div className="relative h-full min-h-[400px] bg-earth-100">
                <img
                  src="/images/contact-scottie.jpg"
                  alt="蘇格蘭㹴"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-earth-900/20 to-transparent"></div>
              </div>

              {/* 右側聯絡資訊 */}
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-earth-900 mb-6">雷歐犬舍訓練工作室</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-earth-800">0909-634-112</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-earth-800">service@scottie.com</span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-earth-800">嘉義市西區大仁街57號</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-earth-800">營業時間：週一至週日 10:00-18:00</span>
                  </div>

                  <div className="pt-6 border-t border-earth-100">
                    <p className="text-earth-800 font-medium mb-4">社群媒體</p>
                    <div className="flex space-x-4">
                      <a 
                        href="https://www.facebook.com/profile.php?id=61573037511186" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://www.instagram.com/scottishreosora" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://lin.ee/8BYovZD" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.365 9.863c.349 0 .63.285.631.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.193 0-.379-.078-.511-.217l-2.443-3.338v2.928c0 .346-.282.629-.631.629-.345 0-.63-.283-.63-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.075.507.215l2.462 3.338V8.108c0-.345.282-.63.63-.63.346 0 .63.285.63.63l-.007 4.771zm-3.088 0c0 .346-.282.629-.63.629-.345 0-.63-.283-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.771zm-2.906 0c0 .346-.282.629-.631.629H6.63c-.346 0-.63-.283-.63-.629V8.108c0-.345.284-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .63.283.63.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* 底部裝飾元素 */}
          <FadeIn className="mt-16 text-center text-earth-600">
            <p>歡迎來電詢問，我們將為您提供最專業的服務</p>
          </FadeIn>
        </div>
      </section>
    </div>
  )
} 