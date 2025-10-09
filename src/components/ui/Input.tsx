'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full px-4 py-3 font-pixel text-[9px]',
          'bg-white border-[3px] border-gray-900 rounded-md',
          'focus:outline-none focus:border-klix-orange',
          'focus:shadow-[0_0_0_3px_rgba(255,140,66,0.2)]',
          'transition-all placeholder:text-gray-400',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'