'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // 如果是後台頁面，不顯示footer
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  return <Footer />
} 