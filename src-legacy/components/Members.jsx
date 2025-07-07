import { useState } from 'react';

const Members = () => {
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

  const [, setActiveId] = useState(null);

  return (
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
  );
};

export default Members; 