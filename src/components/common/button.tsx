'use client'

import { cn } from '@/utils/utils'
import { ReactNode } from 'react'

type IVariant = 'default' | 'secondary' | 'ghost' | 'outline'

interface Props {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: IVariant
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

function getButtonStyles(variant?: IVariant) {
  switch (variant) {
    case 'secondary':
      return 'h-10 px-4 bg-accent text-white border-b-4 border-r-4 border-accent-hover hover:bg-accent-hover active:translate-y-1 active:border-b-0 active:border-r-0 transition-all rounded-none font-bold uppercase tracking-widest'
    case 'ghost':
      return 'text-foreground hover:bg-white/5 rounded-none font-bold tracking-widest'
    case 'outline':
      return 'h-10 px-4 border-2 border-foreground bg-transparent hover:bg-white/5 active:translate-y-1 border-b-4 border-r-4 transition-all rounded-none font-bold uppercase tracking-widest'
    case 'default':
    default:
      return 'h-10 px-4 bg-white text-black border-b-4 border-r-4 border-gray-400 hover:bg-gray-200 active:translate-y-1 active:border-b-0 active:border-r-0 transition-all rounded-none font-bold uppercase tracking-widest'
  }
}

export function Button({
  children,
  disabled,
  variant = 'default',
  className,
  type = 'button',
  onClick,
}: Props) {
  return (
    <button
      className={cn(
        className,
        'py-2 cursor-pointer flex items-center',
        getButtonStyles(variant),
        disabled ? 'opacity-50! cursor-not-allowed!' : '',
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
