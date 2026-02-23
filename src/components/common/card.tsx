import classNames from 'classnames'
import { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function Card({ children, className, ...props }: Props) {
  return (
    <div className={classNames('bg-muted rounded-xl p-4', className)} {...props}>
      {children}
    </div>
  )
}
