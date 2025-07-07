import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '管理後台 | 蘇格蘭㹴犬舍',
  description: '蘇格蘭㹴犬舍管理後台',
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