import React from 'react'

export default function ContactPage() {
  return (
    <div className="pt-32 min-h-screen">
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary-700 mb-8 text-center">聯絡我們</h1>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-lg text-earth-700">
                Contact組件正在從React遷移到Next.js中...
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-earth-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-primary-600 mb-4">聯絡資訊</h3>
                <ul className="text-earth-700 space-y-2">
                  <li>📧 Email: service@scottie.com</li>
                  <li>📞 服務專線: 0912-345-678</li>
                  <li>🕐 營業時間: 週一至週日 10:00-20:00</li>
                  <li>📍 地址: 台中市北屯區崇德路二段46號</li>
                </ul>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-primary-600 mb-4">即將推出</h3>
                <ul className="text-earth-700 space-y-2">
                  <li>• 線上聯絡表單</li>
                  <li>• 即時聊天系統</li>
                  <li>• 預約參觀功能</li>
                  <li>• 地圖導航整合</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 