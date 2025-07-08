import React from 'react';
import { cn } from './utils';

// 按鈕變體類型
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 按鈕Props接口
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

// 基本按鈕樣式
const baseButtonClasses = `
  inline-flex items-center justify-center
  font-medium transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  select-none
`;

// 變體樣式
const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-blue-600 hover:bg-blue-700 active:bg-blue-800
    text-white border border-transparent
    focus:ring-blue-500
    shadow-sm hover:shadow-md
  `,
  secondary: `
    bg-gray-100 hover:bg-gray-200 active:bg-gray-300
    text-gray-900 border border-gray-200
    focus:ring-gray-500
    shadow-sm hover:shadow-md
  `,
  outline: `
    bg-transparent hover:bg-blue-50 active:bg-blue-100
    text-blue-600 border border-blue-600
    focus:ring-blue-500
  `,
  ghost: `
    bg-transparent hover:bg-gray-100 active:bg-gray-200
    text-gray-700 border border-transparent
    focus:ring-gray-500
  `,
  link: `
    bg-transparent hover:bg-transparent active:bg-transparent
    text-blue-600 hover:text-blue-700 border border-transparent
    focus:ring-blue-500 underline-offset-4 hover:underline
    shadow-none
  `,
  danger: `
    bg-red-600 hover:bg-red-700 active:bg-red-800
    text-white border border-transparent
    focus:ring-red-500
    shadow-sm hover:shadow-md
  `,
};

// 尺寸樣式
const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs rounded-sm h-6',
  sm: 'px-3 py-1.5 text-sm rounded-md h-8',
  md: 'px-4 py-2 text-sm rounded-md h-10',
  lg: 'px-6 py-3 text-base rounded-lg h-12',
  xl: 'px-8 py-4 text-lg rounded-lg h-14',
};

// 載入圖標組件
const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// 按鈕組件
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        baseButtonClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && <LoadingIcon className="w-4 h-4 mr-2" />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      
      <span>{children}</span>
      
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

// 默認導出
export default Button; 