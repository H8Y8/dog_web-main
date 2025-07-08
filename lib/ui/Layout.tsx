import React, { useState } from 'react';
import { cn } from './utils';
import { Sidebar, type NavigationItem } from './Sidebar';
import { Button } from './Button';

// 佈局Props
export interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
  navigationItems: NavigationItem[];
  onNavigationItemClick?: (item: NavigationItem) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSignOut?: () => void;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

// 麵包屑組件
const Breadcrumbs: React.FC<{
  items: { label: string; href?: string }[];
}> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            
            {item.href ? (
              <a
                href={item.href}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-800 text-sm font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// 頂部導航欄組件
const TopBar: React.FC<{
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSignOut?: () => void;
}> = ({ title, breadcrumbs, actions, user, onSignOut }) => {
  return (
    <header className="bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* 左側：標題和麵包屑 */}
          <div className="flex-1 min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} />
            )}
          </div>

          {/* 右側：操作按鈕和用戶資訊 */}
          <div className="flex items-center space-x-4">
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
            
            {user && onSignOut && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                登出
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// 主要佈局組件
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  className,
  navigationItems,
  onNavigationItemClick,
  user,
  onSignOut,
  title,
  breadcrumbs,
  actions,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={cn('h-screen bg-gray-50 flex overflow-hidden', className)}>
      {/* 側邊欄 - 固定位置 */}
      <div className="flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          navigationItems={navigationItems}
          onItemClick={onNavigationItemClick}
          user={user}
        />
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* 頂部導航欄 - 固定位置 */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <TopBar
            title={title}
            breadcrumbs={breadcrumbs}
            actions={actions}
            user={user}
            onSignOut={onSignOut}
          />
        </div>

        {/* 主要內容 - 可滾動 */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// 默認導出
export default AdminLayout; 