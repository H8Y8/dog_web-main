import { useState } from 'react';

const DiaryList = ({ onEdit, onDelete }) => {
  // 這裡應該從API獲取數據
  const [diaries, setDiaries] = useState([
    {
      id: 1,
      title: "蘇格蘭㹴的倔強性格初體驗",
      date: "2024-03-15",
      content: "今天和新來的蘇格蘭㹴小黑進行了第一次訓練...",
      image: "/images/diary/training-1.jpg",
      tags: ["訓練經驗", "性格特點"]
    },
    {
      id: 2,
      title: "蘇格蘭㹴的美容大冒險",
      date: "2024-03-10",
      content: "第一次幫小白進行專業美容，這個過程既有趣又充滿挑戰...",
      image: "/images/diary/grooming-1.jpg",
      tags: ["美容護理", "日常照顧"]
    },
    {
      id: 3,
      title: "蘇格蘭㹴的社交課程",
      date: "2024-03-05",
      content: "帶著三個月大的小虎參加了寵物社交課...",
      image: "/images/diary/socialization.jpg",
      tags: ["社會化", "幼犬培育"]
    },
    {
      id: 4,
      title: "居家訓練的秘訣",
      date: "2024-02-28",
      content: "分享一個實用的居家訓練技巧：蘇格蘭㹴對聲音特別敏感...",
      image: "/images/diary/home-training.jpg",
      tags: ["訓練技巧", "行為調教"]
    },
    {
      id: 5,
      title: "蘇格蘭㹴的飲食調整",
      date: "2024-02-20",
      content: "今天要談談蘇格蘭㹴的飲食習慣...",
      image: "/images/diary/diet.jpg",
      tags: ["飲食營養", "健康管理"]
    },
    {
      id: 6,
      title: "下雨天的室內活動",
      date: "2024-02-15",
      content: "連續下雨的一週，不能出門運動...",
      image: "/images/diary/indoor-play.jpg",
      tags: ["室內活動", "互動遊戲"]
    },
    {
      id: 7,
      title: "新手爸媽必讀：蘇格蘭㹴的固執應對",
      date: "2024-02-10",
      content: "很多新手飼主都被蘇格蘭㹴的固執嚇到...",
      image: "/images/diary/stubborn.jpg",
      tags: ["行為引導", "新手教學"]
    },
    {
      id: 8,
      title: "蘇格蘭㹴的季節性護理",
      date: "2024-02-05",
      content: "換季時期，特別要注意蘇格蘭㹴的被毛護理...",
      image: "/images/diary/seasonal-care.jpg",
      tags: ["季節護理", "美容技巧"]
    },
    {
      id: 9,
      title: "蘇格蘭㹴的敏捷訓練",
      date: "2024-01-30",
      content: "今天嘗試了一些簡單的敏捷訓練...",
      image: "/images/diary/agility.jpg",
      tags: ["運動訓練", "互動活動"]
    },
    {
      id: 10,
      title: "與蘇格蘭㹴的第一年",
      date: "2024-01-25",
      content: "回顧與小黑相處的第一年...",
      image: "/images/diary/first-year.jpg",
      tags: ["成長記錄", "心得分享"]
    }
  ]);

  const handleDelete = (id) => {
    if (window.confirm('確定要刪除這篇日誌嗎？')) {
      onDelete(id);
      // 這裡應該調用API刪除數據
      setDiaries(diaries.filter(diary => diary.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-earth-900 mb-6">日誌管理</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr className="bg-earth-100">
              <th className="px-6 py-3 text-left text-earth-700">標題</th>
              <th className="px-6 py-3 text-left text-earth-700">日期</th>
              <th className="px-6 py-3 text-left text-earth-700">標籤</th>
              <th className="px-6 py-3 text-right text-earth-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-earth-200">
            {diaries.map((diary) => (
              <tr key={diary.id} className="hover:bg-earth-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={diary.image}
                      alt={diary.title}
                      className="h-10 w-10 rounded-lg object-cover mr-3"
                    />
                    <span className="text-earth-900">{diary.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-earth-600">
                  {diary.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {diary.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-earth-100 text-earth-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(diary)}
                    className="text-primary-600 hover:text-primary-800 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDelete(diary.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiaryList; 