import React from 'react'

export default function DiaryPage() {
  return (
    <div className="pt-32 min-h-screen">
      <div className="py-16 bg-earth-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary-700 mb-8 text-center">日誌</h1>
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-lg text-earth-700 mb-8">
                Diary組件正在從React遷移到Next.js中...
              </p>
              <div className="bg-earth-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-primary-600 mb-4">
                  即將推出的功能
                </h3>
                <ul className="text-earth-600 space-y-2">
                  <li>• 日誌文章瀏覽</li>
                  <li>• 管理員文章發布</li>
                  <li>• 圖片上傳功能</li>
                  <li>• 評論互動系統</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 