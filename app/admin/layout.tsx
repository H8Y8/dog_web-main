import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '管理後台 | 雷歐犬舍訓練工作室',
  description: '雷歐犬舍訓練工作室管理後台 - 專業的犬舍管理平台',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
} 