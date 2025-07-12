'use client'

import React, { useState } from 'react'
import Head from 'next/head'
import { useMembers } from '../../lib/hooks/useMembers'
import { MemberRole, ROLE_LABELS } from '../../lib/types'
import DogMemberCard from '@/app/components/DogMemberCard'
import { FadeUp, FadeLeft, FadeRight } from '../components/MotionWrapper'

export default function AboutPage() {
  const [, setActiveId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<MemberRole | 'all'>('all')
  
  // 獲取成員資料
  const { members, loading, error } = useMembers()

  // 根據角色篩選成員
  const filteredMembers = selectedRole === 'all' 
    ? members 
    : members.filter(member => member.role === selectedRole)

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

  // 獲取可用的角色選項
  const availableRoles = Array.from(new Set(members.map(member => member.role)))
  const roleOptions = [
    { value: 'all', label: '全部' },
    ...availableRoles.map(role => ({ value: role, label: ROLE_LABELS[role] }))
  ]

  return (
    <>
      <Head>
        <title>關於我們 - 蔡毛的蘇格蘭㹴專業犬舍</title>
        <meta name="description" content="認識蔡毛的蘇格蘭㹴專業犬舍，我們擁有超過十年的育種經驗，專注於培育優質、健康的蘇格蘭㹴幼犬。了解我們的專業團隊、優秀成員和嚴格的基因檢測流程。" />
        <meta name="keywords" content="蘇格蘭㹴,專業犬舍,狗狗繁育,寵物,蔡毛,基因檢測,健康狗狗" />
        <meta property="og:title" content="關於我們 - 蔡毛的蘇格蘭㹴專業犬舍" />
        <meta property="og:description" content="認識我們專業的蘇格蘭㹴犬舍，擁有優秀的種犬和專業的繁育經驗。" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="蔡毛的蘇格蘭㹴專業犬舍" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="關於我們 - 蔡毛的蘇格蘭㹴專業犬舍" />
        <meta name="twitter:description" content="認識我們專業的蘇格蘭㹴犬舍，擁有優秀的種犬和專業的繁育經驗。" />
        <link rel="canonical" href="/about" />
      </Head>
      <div className="pt-32 min-h-screen bg-earth-50">
        {/* 背景裝飾效果 */}


        {/* Hero Section */}
        <section className="relative py-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-earth-200/5 to-earth-300/5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* 裝飾線條 */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-earth-300 to-transparent w-24"></div>
              <div className="mx-4 w-3 h-3 bg-earth-400 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-earth-300 to-transparent w-24"></div>
            </div>

            {/* 主標題 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-earth-800 via-earth-600 to-earth-800 bg-clip-text text-transparent">
                關於我們
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-earth-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              蔡毛的蘇格蘭㹴專業犬舍
            </p>

            {/* 統計信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-earth-800 mb-2">10+</div>
                <div className="text-earth-600">年專業育種經驗</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-earth-800 mb-2">100%</div>
                <div className="text-earth-600">基因健康保證</div>
              </div>
            </div>
          </div>
        </section>

      {/* About Section */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
      
      {/* Certificate Section */}
      <section className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeUp>
              <h2 className="text-4xl font-bold text-earth-900 mb-6">基因檢測證書</h2>
            </FadeUp>
            <FadeUp delay={0.1} className="max-w-3xl mx-auto">
              <p className="text-lg text-earth-700 mb-4 leading-relaxed">
                我們堅信健康的基因是培育優秀蘇格蘭㹴的基石。
              </p>
              <p className="text-lg text-earth-700 leading-relaxed">
                這些嚴謹的基因檢測流程不僅確保了我們犬隻的遺傳優勢，也為後續的繁殖計畫提供了科學依據。所有檢測結果均以正式證書形式出具，讓每位選擇我們犬舍的家庭都能安心享受專業、透明且值得信賴的服務。
              </p>
            </FadeUp>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <FadeUp
                key={cert.id}
                delay={cert.id * 0.1}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
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
              </FadeUp>
            ))}
          </div>

          <FadeUp className="mt-16 text-center">
            <p className="text-earth-600 italic">
              * 所有證書都可供查驗，確保完全透明的育種過程
            </p>
          </FadeUp>
        </div>
      </section>
      
      {/* Members Section */}
      <section className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeUp>
              <h2 className="text-4xl font-bold text-earth-900 mb-4">成員介紹</h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-xl text-earth-700 mb-8">
                認識我們可愛的蘇格蘭㹴家族
              </p>
            </FadeUp>
            
            {/* 角色篩選標籤 */}
            <FadeUp delay={0.2} className="flex flex-wrap justify-center gap-3 mb-8">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedRole(option.value as MemberRole | 'all')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    selectedRole === option.value
                      ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                      : 'bg-white text-earth-700 hover:bg-primary-50 hover:text-primary-700 shadow-md'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </FadeUp>
          </div>
          
          {/* 載入狀態 */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <span className="ml-4 text-earth-700 text-lg">載入成員資料中...</span>
            </div>
          )}
          
          {/* 錯誤狀態 */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-earth-900 mb-2">載入失敗</h3>
              <p className="text-earth-600 mb-4">{error.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors duration-300"
              >
                重新載入
              </button>
            </div>
          )}
          
          {/* 成員列表 */}
          {!loading && !error && (
            <>
              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-earth-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-earth-900 mb-2">暫無成員</h3>
                  <p className="text-earth-600">
                    {selectedRole === 'all' ? '還沒有新增任何成員' : `沒有符合「${roleOptions.find(r => r.value === selectedRole)?.label}」條件的成員`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {filteredMembers.map((member, index) => (
                    <FadeUp
                      key={member.id}
                      delay={index * 0.2}
                    >
                      <DogMemberCard
                        member={member}
                        onMouseEnter={() => setActiveId(parseInt(member.id))}
                        onMouseLeave={() => setActiveId(null)}
                      />
                    </FadeUp>
                  ))}
                </div>
              )}
              
              {/* 統計資訊 */}
              {filteredMembers.length > 0 && (
                <div className="text-center mt-12 pt-8 border-t border-earth-200">
                  <p className="text-earth-600">
                    總共 {members.length} 位成員
                    {selectedRole !== 'all' && ` • 顯示 ${filteredMembers.length} 位符合條件的成員`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
    </>
  )
} 