const Certificate = () => {
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

  return (
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
  );
};

export default Certificate; 