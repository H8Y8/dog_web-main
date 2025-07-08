'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // 如果是後台頁面，不顯示導航欄
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  return <Navbar />
} 