'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-pixel transition-all',
          'border-[3px] border-gray-900 rounded-lg',
          'shadow-[4px_4px_0px_rgba(0,0,0,0.3)]',
          'hover:translate-x-[-2px] hover:translate-y-[-2px]',
          'hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)]',
          'active:translate-x-[2px] active:translate-y-[2px]',
          'active:shadow-[2px_2px_0px_rgba(0,0,0,0.3)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'disabled:hover:translate-x-0 disabled:hover:translate-y-0',
          {
            'bg-gradient-to-r from-klix-orange to-klix-orange-light text-white': variant === 'primary',
            'bg-white text-klix-orange': variant === 'secondary',
            'bg-red-500 text-white': variant === 'danger',
            'px-4 py-2 text-[8px]': size === 'sm',
            'px-6 py-3 text-[10px]': size === 'md',
            'px-8 py-4 text-[12px]': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'