import React from 'react'

export default function AboutPage() {
  return (
    <div className="pt-32 min-h-screen">
      {/* About Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary-700 mb-8 text-center">關於我們</h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-earth-700 text-center mb-8">
              About組件正在從React遷移到Next.js中...
            </p>
          </div>
        </div>
      </div>
      
      {/* Certificate Section */}
      <div className="py-16 bg-earth-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-700 mb-8 text-center">認證證書</h2>
          <div className="text-center">
            <p className="text-earth-600">
              Certificate組件正在遷移中...
            </p>
          </div>
        </div>
      </div>
      
      {/* Members Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-700 mb-8 text-center">團隊成員</h2>
          <div className="text-center">
            <p className="text-earth-600">
              Members組件正在遷移中...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 