import classNames from 'classnames'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: Props) {
  return (
    <div className={classNames('bg-muted rounded-sm p-4', className)}>
      {children}
    </div>
  )
}
