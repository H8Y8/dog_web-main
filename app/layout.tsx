import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AOSInit from './components/AOSInit'

export const metadata: Metadata = {
  metadataBase: new URL('https://scottish-terrier-kennel.com'),
  title: '雷歐犬舍訓練工作室 | Leo Kennel Training Studio',
  description: '專業的蘇格蘭㹴犬舍，提供優質的蘇格蘭㹴幼犬、專業飼養建議、健康認證及完整的犬隻訓練服務。',
  keywords: '蘇格蘭㹴,犬舍,幼犬,寵物,狗,Scottish Terrier',
  authors: [{ name: '雷歐犬舍訓練工作室' }],
  creator: '雷歐犬舍訓練工作室',
  publisher: '雷歐犬舍訓練工作室',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://scottish-terrier-kennel.com',
    title: '雷歐犬舍訓練工作室 | Leo Kennel Training Studio',
    description: '專業的蘇格蘭㹴犬舍，提供優質的蘇格蘭㹴幼犬、專業飼養建議、健康認證及完整的犬隻訓練服務。',
    siteName: '雷歐犬舍訓練工作室',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo512.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#e8b744" />
      </head>
      <body className="antialiased bg-earth-50">
        <AOSInit />
        <div className="min-h-screen flex flex-col bg-earth-50">
          {/* Navigation Bar */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow bg-earth-50">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  )
} 