import classNames from 'classnames'
import { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function Card({ children, className, ...props }: Props) {
  return (
    <div className={classNames('bg-muted border-4 border-muted-light p-4 rounded-none shadow-[6px_6px_0_0_rgba(0,0,0,0.8)]', className)} {...props}>
      {children}
    </div>
  )
}
