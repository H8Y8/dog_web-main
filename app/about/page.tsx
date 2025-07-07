'use client'

import React, { useState } from 'react'

export default function AboutPage() {
  const [, setActiveId] = useState<number | null>(null);

  const certificates = [
    {
      id: 1,
      title: "基因疾病篩檢",
      description: "委託美國知名檢測單位進行全面性遺傳疾病篩查",
      items: ["CEA 眼睛異常", "CMO 顎骨異常", "CD 犬白內障", "MDRI 藥物敏感", "HUU 尿酸代謝"],
      image: "/images/certificates/gene-test.jpg"
    },
    {
      id: 2,
      title: "骨骼發育評估",
      description: "通過美國 OFA 關節健康評估認證",
      items: ["髖關節檢測", "肘關節檢測", "膝蓋骨評估", "脊椎發育檢查"],
      image: "/images/certificates/bone-test.jpg"
    },
    {
      id: 3,
      title: "血統認證",
      description: "嚴格的血統審查與登記制度",
      items: ["純種血統證明", "國際血統登記", "品種特徵評估", "遺傳特性分析"],
      image: "/images/certificates/pedigree.jpg"
    }
  ];

  const members = [
    {
      id: 1,
      name: "小狗一號",
      age: "約3歲",
      gender: "男孩",
      description: "是一隻充滿活力與好奇心的蘇格蘭㹴，經過嚴格基因檢測篩選，擁有絕佳的健康基因。他個性堅毅、聰明且樂於探索，無論是家庭的日常散步還是戶外冒險，總能展現出蘇格蘭㹴特有的靈敏反應與活力。經過專業訓練，不僅在服從訓練上表現出色，更在與家人互動中充滿溫情，是每個家庭理想的忠實守護者與好夥伴。",
      image: "/images/members/1.jpg",
      traits: ["活力充沛", "聰明好學", "忠誠護主", "愛好冒險"]
    },
    {
      id: 2,
      name: "小狗二號",
      age: "約2.5歲",
      gender: "女孩",
      description: "她溫柔、聰慧的性格贏得了無數喜愛，同樣通過嚴謹的基因檢測，確保了她健康的血統與活潑的天性。她擁有蘇格蘭㹴獨有的優雅風範，不僅在家中成為大家的心靈慰藉，也在專業訓練中展示了卓越的學習能力。喜歡與人互動，溫暖的眼神與甜美的叫聲能瞬間拉近與家人之間的距離，讓每一天都充滿了無限的愛與活力。",
      image: "/images/members/2.jpg",
      traits: ["優雅溫柔", "聰慧伶俐", "親人友善", "學習力強"]
    }
  ];

  return (
    <div className="pt-32 min-h-screen">
      {/* About Section */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-earth-900 mb-4" data-aos="fade-up">關於我們</h2>
            <p className="text-xl text-earth-700 mb-8" data-aos="fade-up" data-aos-delay="100">
              蔡毛的蘇格蘭㹴專業犬舍
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                      <div className="relative" data-aos="fade-right">
            <img
              src="/images/about-us/about-scottie.jpg"
              alt="蘇格蘭㹴"
              className="rounded-lg shadow-xl w-full h-80 md:h-96 lg:h-[500px] object-cover"
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
              src="/images/about-us/trainer-scottie.jpg"
              alt="專業訓練師"
              className="rounded-lg shadow-xl w-full h-80 md:h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-900/20 to-transparent rounded-lg"></div>
          </div>
          </div>
        </div>
      </section>
      
      {/* Certificate Section */}
      <section className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-earth-900 mb-6" data-aos="fade-up">基因檢測證書</h2>
            <div className="max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              <p className="text-lg text-earth-700 mb-4 leading-relaxed">
                我們堅信健康的基因是培育優秀蘇格蘭㹴的基石。
              </p>
              <p className="text-lg text-earth-700 leading-relaxed">
                這些嚴謹的基因檢測流程不僅確保了我們犬隻的遺傳優勢，也為後續的繁殖計畫提供了科學依據。所有檢測結果均以正式證書形式出具，讓每位選擇我們犬舍的家庭都能安心享受專業、透明且值得信賴的服務。
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay={cert.id * 100}
              >
                <div className="relative h-40">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-earth-900 mb-3">{cert.title}</h3>
                  <p className="text-earth-700 mb-4">{cert.description}</p>
                  <ul className="space-y-2">
                    {cert.items.map((item, index) => (
                      <li key={index} className="flex items-center text-earth-600">
                        <svg className="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center" data-aos="fade-up">
            <p className="text-earth-600 italic">
              * 所有證書都可供查驗，確保完全透明的育種過程
            </p>
          </div>
        </div>
      </section>
      
      {/* Members Section */}
      <section className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-earth-900 mb-4" data-aos="fade-up">成員介紹</h2>
            <p className="text-xl text-earth-700" data-aos="fade-up" data-aos-delay="100">
              認識我們可愛的蘇格蘭㹴家族
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {members.map((member) => (
              <div
                key={member.id}
                className="relative group"
                data-aos="fade-up"
                data-aos-delay={member.id * 200}
                onMouseEnter={() => setActiveId(member.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-102">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:saturate-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-earth-900/40 to-transparent 
                      transition-opacity duration-500 group-hover:opacity-75"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold group-hover:text-primary-200 transition-colors duration-300">
                          {member.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-primary-500/80 backdrop-blur-sm rounded-full text-sm">
                            {member.gender}
                          </span>
                          <span className="px-3 py-1 bg-primary-500/80 backdrop-blur-sm rounded-full text-sm">
                            {member.age}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.traits.map((trait, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-earth-700/50 backdrop-blur-sm rounded-full text-sm 
                              transform transition-transform duration-300 hover:scale-105"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-earth-700 leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>

                {/* 裝飾元素 */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-xl 
                  transition-all duration-300 group-hover:scale-125 group-hover:bg-primary-500/30"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-earth-500/20 rounded-full blur-xl 
                  transition-all duration-300 group-hover:scale-125 group-hover:bg-earth-500/30"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 