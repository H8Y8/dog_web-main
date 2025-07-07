'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSInit() {
  useEffect(() => {
    // 確保只在客戶端執行
    if (typeof window !== 'undefined') {
      AOS.init({
        duration: 1000, // 動畫持續時間
        once: true, // 只執行一次動畫
        offset: 100, // 距離視窗多少距離開始動畫
        easing: 'ease-in-out', // 動畫緩動效果
      })
    }
  }, [])

  return null // 這個組件不渲染任何 UI
} 