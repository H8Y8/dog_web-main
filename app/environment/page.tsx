import React from 'react'
import DynamicEnvironment from '../components/DynamicEnvironment'

export const metadata = {
  title: '環境介紹 | 雷歐犬舍訓練工作室 - 專業蘇格蘭㹴犬舍',
  description: '專業的犬舍環境，為蘇格蘭㹴提供最舒適的生活空間。配備完善的設施、專業醫療設備，確保每隻狗狗的健康與安全。',
  keywords: '蘇格蘭㹴, 犬舍環境, 寵物住宿, 專業設備, 安全防護',
}

export default function EnvironmentPage() {
  return (
    <div className="pt-32 min-h-screen bg-earth-50">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-clip pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-earth-200/20 to-earth-300/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-earth-200/20 to-earth-300/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <DynamicEnvironment />
    </div>
  )
} 