import React, { useState } from 'react';
import { cn } from './utils';
import { Button } from './Button';

// 導航項目類型
export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  active?: boolean;
  badge?: string | number;
  children?: NavigationItem[];
}

// 側邊欄Props
export interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  navigationItems: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
  footer?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

// 圖標組件
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// 導航項目組件
const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  level?: number;
  collapsed?: boolean;
  onItemClick?: (item: NavigationItem) => void;
}> = ({ item, level = 0, collapsed, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onItemClick?.(item);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
          item.active && 'bg-blue-100 text-blue-700',
          !item.active && 'text-gray-600 hover:text-gray-900',
          level > 0 && 'ml-4'
        )}
      >
        {item.icon && (
          <span className="mr-3 flex-shrink-0 h-5 w-5">
            {item.icon}
          </span>
        )}
        
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            
            {item.badge && (
              <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                {item.badge}
              </span>
            )}
            
            {hasChildren && (
              <ChevronRightIcon
                className={cn(
                  'ml-2 h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            )}
          </>
        )}
      </button>
      
      {hasChildren && isOpen && !collapsed && (
        <div className="mt-1 ml-4">
          {item.children?.map((child) => (
            <NavigationItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              collapsed={collapsed}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 用戶資訊組件
const UserProfile: React.FC<{
  user: { name: string; email: string; avatar?: string };
  collapsed?: boolean;
}> = ({ user, collapsed }) => {
  if (collapsed) {
    return (
      <div className="p-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-gray-200">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

// 側邊欄組件
export const Sidebar: React.FC<SidebarProps> = ({
  className,
  collapsed = false,
  onCollapsedChange,
  navigationItems,
  onItemClick,
  footer,
  user,
}) => {
  const toggleCollapsed = () => {
    onCollapsedChange?.(!collapsed);
  };

  return (
    <div
      className={cn(
        'h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* 頂部控制區域 */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-gray-900">
              蘇格蘭㹴犬舍
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="p-1 h-8 w-8"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 導航區域 */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavigationItemComponent
            key={item.id}
            item={item}
            collapsed={collapsed}
            onItemClick={onItemClick}
          />
        ))}
      </nav>

      {/* 底部區域 */}
      <div className="flex-shrink-0">
        {user && (
          <UserProfile user={user} collapsed={collapsed} />
        )}
        {footer && !collapsed && (
          <div className="p-3 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// 默認導出
export default Sidebar; 