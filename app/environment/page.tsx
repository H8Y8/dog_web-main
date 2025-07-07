import React from 'react'
import Environment from '../components/Environment'

export const metadata = {
  title: '環境介紹 | 雷歐犬舍訓練工作室 - 專業蘇格蘭㹴犬舍',
  description: '專業的犬舍環境，為蘇格蘭㹴提供最舒適的生活空間。配備完善的設施、專業醫療設備，確保每隻狗狗的健康與安全。',
  keywords: '蘇格蘭㹴, 犬舍環境, 寵物住宿, 專業設備, 安全防護',
}

export default function EnvironmentPage() {
  return (
    <div className="pt-32 min-h-screen">
      <Environment />
    </div>
  )
} 