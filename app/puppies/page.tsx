import React from 'react'

export default function PuppiesPage() {
  return (
    <div className="pt-32 min-h-screen">
      <div className="py-16 bg-earth-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary-700 mb-8 text-center">新生幼犬</h1>
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-lg text-earth-700 mb-8">
                Puppies組件正在從React遷移到Next.js中...
              </p>
              <div className="bg-earth-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-primary-600 mb-4">
                  即將推出的功能
                </h3>
                <ul className="text-earth-600 space-y-2">
                  <li>• 幼犬資訊展示</li>
                  <li>• 健康記錄追蹤</li>
                  <li>• 疫苗接種時程</li>
                  <li>• 預約參觀系統</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 