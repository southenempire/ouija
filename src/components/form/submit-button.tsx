'use client'

import { useFormStatus } from 'react-dom'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isSubmitting?: boolean
}

export function SubmitButton({ children, isSubmitting, className = '', disabled, ...props }: Props) {
  const { pending } = useFormStatus()
  const isPending = pending || isSubmitting

  return (
    <button
      type="submit"
      className={`bg-foreground text-background h-10 p-2 hover:opacity-80 rounded-sm ${className}`}
      disabled={isPending || disabled}
      {...props}
    >
      {children}
    </button>
  )
}
