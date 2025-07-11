'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSInit() {
  useEffect(() => {
    // 確保只在客戶端執行
    if (typeof window !== 'undefined') {
      console.log('🔍 AOSInit: 初始化前 overflow 狀態')
      console.log('📋 html overflow:', window.getComputedStyle(document.documentElement).overflow)
      console.log('📋 body overflow:', window.getComputedStyle(document.body).overflow)
      console.log('📋 html overflow-x:', window.getComputedStyle(document.documentElement).overflowX)
      console.log('📋 html overflow-y:', window.getComputedStyle(document.documentElement).overflowY)
      console.log('📋 body overflow-x:', window.getComputedStyle(document.body).overflowX)
      console.log('📋 body overflow-y:', window.getComputedStyle(document.body).overflowY)
      
      AOS.init({
        duration: 1000, // 動畫持續時間
        once: true, // 只執行一次動畫
        offset: 100, // 距離視窗多少距離開始動畫
        easing: 'ease-in-out', // 動畫緩動效果
      })
      
      // AOS 初始化後檢查
      setTimeout(() => {
        console.log('🔍 AOSInit: 初始化後 overflow 狀態')
        console.log('📋 html overflow:', window.getComputedStyle(document.documentElement).overflow)
        console.log('📋 body overflow:', window.getComputedStyle(document.body).overflow)
        console.log('📋 html overflow-x:', window.getComputedStyle(document.documentElement).overflowX)
        console.log('📋 html overflow-y:', window.getComputedStyle(document.documentElement).overflowY)
        console.log('📋 body overflow-x:', window.getComputedStyle(document.body).overflowX)
        console.log('📋 body overflow-y:', window.getComputedStyle(document.body).overflowY)
      }, 100)
    }
  }, [])

  return null // 這個組件不渲染任何 UI
} 