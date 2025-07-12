const About = () => {
  return (
    <section className="py-16 bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-earth-900 mb-4" data-aos="fade-up">關於我們</h2>
          <p className="text-xl text-earth-700 mb-8" data-aos="fade-up" data-aos-delay="100">
            雷歐犬舍訓練工作室
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative" data-aos="fade-right">
            <img
              src="/images/about-scottie.jpg"
              alt="蘇格蘭㹴"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-900/20 to-transparent rounded-lg"></div>
          </div>

          <div className="space-y-4" data-aos="fade-left">
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
          </div>
        </div>

        {/* 專業訓練師介紹區塊 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4" data-aos="fade-right">
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
          </div>

          <div className="relative" data-aos="fade-left">
            <img
              src="/images/trainer-scottie.jpg"
              alt="專業訓練師"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-900/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 