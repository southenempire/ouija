'use client'

import { X } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: ReactNode
}

export default function Dialog({ isOpen, setIsOpen, children }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[100]">
      <div className="bg-muted p-6 rounded-md shadow-2xl relative min-h-[200px] min-w-[350px] max-h-[90vh] overflow-y-auto border border-white/10 backdrop-blur-md">
        <button
          className="absolute top-2 right-2 text-foreground hover:text-gray-200"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}
