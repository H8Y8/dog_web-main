const Diary = () => {
  const diaryEntries = [
    {
      id: 1,
      title: "蘇格蘭㹴的倔強性格初體驗",
      date: "2024-03-15",
      content: "今天和新來的蘇格蘭㹴小黑進行了第一次訓練。這個小傢伙完美展現了蘇格蘭㹴著名的倔強性格，當我試圖教他「坐下」指令時，他用一種「我考慮考慮」的眼神看著我。經過耐心引導和獎勵，終於在一個小時後達成了目標。這讓我再次體會到，與蘇格蘭㹴相處最重要的是耐心和堅持。",
      image: "/images/diary/training-1.jpg",
      tags: ["訓練經驗", "性格特點"]
    },
    {
      id: 2,
      title: "蘇格蘭㹴的美容大冒險",
      date: "2024-03-10",
      content: "第一次幫小白進行專業美容，這個過程既有趣又充滿挑戰。蘇格蘭㹴獨特的雙層被毛需要特別的護理技巧，今天特別分享如何正確修剪他們標誌性的鬍鬚和眉毛。記住，修剪時要特別小心，因為這些特徵是蘇格蘭㹴迷人外表的重要組成部分。",
      image: "/images/diary/grooming-1.jpg",
      tags: ["美容護理", "日常照顧"]
    },
    {
      id: 3,
      title: "蘇格蘭㹴的社交課程",
      date: "2024-03-05",
      content: "帶著三個月大的小虎參加了寵物社交課。蘇格蘭㹴雖然對陌生人有些保守，但今天他表現得出奇地好！透過適當的引導，他學會了如何與其他狗狗友好相處。這再次證明了早期社會化的重要性，特別是對於天生獨立的蘇格蘭㹴而言。",
      image: "/images/diary/socialization.jpg",
      tags: ["社會化", "幼犬培育"]
    },
    {
      id: 4,
      title: "居家訓練的秘訣",
      date: "2024-02-28",
      content: "分享一個實用的居家訓練技巧：蘇格蘭㹴對聲音特別敏感，我們可以利用這一點來進行訓練。今天嘗試使用不同音調的口令，發現他們對高音調的正面鼓勵特別有反應。但要注意不要過度使用，以免降低效果。",
      image: "/images/diary/home-training.jpg",
      tags: ["訓練技巧", "行為調教"]
    },
    {
      id: 5,
      title: "蘇格蘭㹴的飲食調整",
      date: "2024-02-20",
      content: "今天要談談蘇格蘭㹴的飲食習慣。由於他們的高能量需求，我們特別設計了營養均衡的餐點。有趣的發現是，適量添加蔬菜不僅可以幫助消化，還能預防一些常見的健康問題。記得要根據狗狗的年齡和活動量來調整食量。",
      image: "/images/diary/diet.jpg",
      tags: ["飲食營養", "健康管理"]
    },
    {
      id: 6,
      title: "下雨天的室內活動",
      date: "2024-02-15",
      content: "連續下雨的一週，不能出門運動，但我們發明了一些有趣的室內遊戲。蘇格蘭㹴的聰明才智在這時候特別派上用場，像是躲藏零食的尋寶遊戲，不僅能訓練他們的嗅覺，還能消耗過剩的精力。",
      image: "/images/diary/indoor-play.jpg",
      tags: ["室內活動", "互動遊戲"]
    },
    {
      id: 7,
      title: "新手爸媽必讀：蘇格蘭㹴的固執應對",
      date: "2024-02-10",
      content: "很多新手飼主都被蘇格蘭㹴的固執嚇到，今天分享一個小技巧：當他們表現出固執行為時，不要直接對抗，而是轉移注意力，用正面引導的方式達到目的。這個方法在今天的訓練中又一次證明了它的效果。",
      image: "/images/diary/stubborn.jpg",
      tags: ["行為引導", "新手教學"]
    },
    {
      id: 8,
      title: "蘇格蘭㹴的季節性護理",
      date: "2024-02-05",
      content: "換季時期，特別要注意蘇格蘭㹴的被毛護理。他們的雙層被毛在季節交替時會大量脫落，需要更頻繁的梳理。今天示範了一些實用的梳理技巧，幫助大家度過換毛期。",
      image: "/images/diary/seasonal-care.jpg",
      tags: ["季節護理", "美容技巧"]
    },
    {
      id: 9,
      title: "蘇格蘭㹴的敏捷訓練",
      date: "2024-01-30",
      content: "今天嘗試了一些簡單的敏捷訓練，蘇格蘭㹴的運動天賦真的很驚人！從簡單的跨欄到複雜的隧道穿越，他們都展現出極強的學習能力。這不僅能鍛鍊身體，還能增進彼此的信任關係。",
      image: "/images/diary/agility.jpg",
      tags: ["運動訓練", "互動活動"]
    },
    {
      id: 10,
      title: "與蘇格蘭㹴的第一年",
      date: "2024-01-25",
      content: "回顧與小黑相處的第一年，真是充滿了歡樂與感動。從最初的適應期到現在形影不離的夥伴關係，蘇格蘭㹴用他們特有的方式向我們展示了什麼是真正的忠誠。這一年的點點滴滴，都成為了最珍貴的回憶。",
      image: "/images/diary/first-year.jpg",
      tags: ["成長記錄", "心得分享"]
    }
  ];

  return (
    <section className="py-16 bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-earth-900 mb-4" data-aos="fade-up">日誌分享</h2>
          <p className="text-xl text-earth-700" data-aos="fade-up" data-aos-delay="100">
            記錄與蘇格蘭㹴的每一個精彩時刻
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {diaryEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={entry.id * 100}
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-earth-900">{entry.title}</h3>
                  <span className="text-sm text-earth-600">{entry.date}</span>
                </div>
                <p className="text-earth-700 mb-4 line-clamp-3">
                  {entry.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-earth-100 text-earth-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Diary; 