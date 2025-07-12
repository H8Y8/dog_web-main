'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

// 動畫變體定義
const animationVariants = {
  fadeIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    needsWrapper: false
  },
  fadeUp: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    child: {
      initial: { y: 40 },
      animate: { y: 0 }
    },
    needsWrapper: true
  },
  fadeDown: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    child: {
      initial: { y: -40 },
      animate: { y: 0 }
    },
    needsWrapper: true
  },
  fadeLeft: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    child: {
      initial: { x: -40 },
      animate: { x: 0 }
    },
    needsWrapper: true
  },
  fadeRight: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    child: {
      initial: { x: 40 },
      animate: { x: 0 }
    },
    needsWrapper: true
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    needsWrapper: false
  }
}

// 動畫類型
type AnimationType = keyof typeof animationVariants

// MotionWrapper 組件 props
interface MotionWrapperProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView'> {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  once?: boolean
  className?: string
}

/**
 * Motion 動畫包裝組件
 * 解決幽靈捲軸問題：使用多層結構 + overflow: clip
 */
export default function MotionWrapper({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.8,
  once = true,
  className,
  ...props
}: MotionWrapperProps) {
  const variant = animationVariants[animation]

  // 需要位移的動畫使用雙層結構
  if (variant.needsWrapper && 'child' in variant) {
    return (
      <div className="overflow-clip motion-container">
        <motion.div
          initial={variant.child.initial}
          whileInView={variant.child.animate}
          viewport={{ once, margin: "-10%" }}
          transition={{ 
            duration,
            delay,
            ease: 'easeOut'
          }}
          style={{ willChange: 'transform' }}
          className={className}
          {...props}
        >
          {children}
        </motion.div>
      </div>
    )
  }

  // 純淡入/縮放動畫直接使用單層
  return (
    <motion.div
      initial={variant.initial}
      whileInView={variant.animate}
      viewport={{ once, margin: "-10%" }}
      transition={{ 
        duration,
        delay,
        ease: 'easeOut'
      }}
      style={{ willChange: 'transform, opacity' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// 快捷組件
export const FadeIn = ({ children, delay = 0, duration = 0.8, className, ...props }: Omit<MotionWrapperProps, 'animation'>) => (
  <MotionWrapper animation="fadeIn" delay={delay} duration={duration} className={className} {...props}>
    {children}
  </MotionWrapper>
)

export const FadeUp = ({ children, delay = 0, duration = 0.8, className, ...props }: Omit<MotionWrapperProps, 'animation'>) => (
  <MotionWrapper animation="fadeUp" delay={delay} duration={duration} className={className} {...props}>
    {children}
  </MotionWrapper>
)

export const FadeDown = ({ children, delay = 0, duration = 0.8, className, ...props }: Omit<MotionWrapperProps, 'animation'>) => (
  <MotionWrapper animation="fadeDown" delay={delay} duration={duration} className={className} {...props}>
    {children}
  </MotionWrapper>
)

export const FadeLeft = ({ children, delay = 0, duration = 0.8, className, ...props }: Omit<MotionWrapperProps, 'animation'>) => (
  <MotionWrapper animation="fadeLeft" delay={delay} duration={duration} className={className} {...props}>
    {children}
  </MotionWrapper>
)

export const FadeRight = ({ children, delay = 0, duration = 0.8, className, ...props }: Omit<MotionWrapperProps, 'animation'>) => (
  <MotionWrapper animation="fadeRight" delay={delay} duration={duration} className={className} {...props}>
    {children}
  </MotionWrapper>
)

export const ScaleUp = ({ children, delay = 0, duration = 0.8, className, ...props }: Omit<MotionWrapperProps, 'animation'>) => (
  <MotionWrapper animation="scaleUp" delay={delay} duration={duration} className={className} {...props}>
    {children}
  </MotionWrapper>
)