'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const menuItems = [
    { title: '關於我們', href: '/about' },
    { title: '日誌', href: '/diary' },
    { title: '新生幼犬', href: '/puppies' },
    { title: '聯絡我們', href: '/contact' },
  ]

  const isActive = (path: string) => {
    if (!pathname) return false
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed w-full z-50 px-0 sm:px-6 lg:px-8 top-0 sm:top-6">
      <nav className="max-w-7xl mx-auto bg-earth-600/90 sm:rounded-full text-earth-50 backdrop-blur-sm sm:border sm:border-earth-500/50 shadow-lg">
        <div className="px-4 sm:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                onClick={handleLogoClick}
                className="text-lg sm:text-xl font-bold text-primary-900 hover:text-primary-800 transition duration-300"
              >
                蔡毛的狗窩
              </Link>
            </div>
            
            {/* 桌面版選單 */}
            <div className="hidden md:flex items-center space-x-10">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base md:text-lg font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-300 font-bold'
                      : 'text-earth-100 hover:text-primary-200'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* 手機版選單按鈕 */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-earth-100 hover:text-primary-200 transition duration-200 p-2"
                aria-label={isOpen ? '關閉選單' : '開啟選單'}
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 手機版下拉選單 */}
        {isOpen && (
          <div className="md:hidden bg-earth-600/95 sm:rounded-2xl mt-0 sm:mt-2 overflow-hidden sm:border sm:border-earth-500/50 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 text-base transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-300 font-semibold'
                      : 'text-earth-100 hover:text-primary-200'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar 