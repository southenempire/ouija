import { Header } from '@/components/common/header'
import { PrivyClientProvider } from '@/components/provider/PrivyClientProvider'
import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import './globals.css'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ouija | Solana Confessional',
  description: 'Confess your dead crypto bags onchain. Built on Tapestry.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${vt323.className} bg-background text-foreground min-h-screen selection:bg-accent/30 selection:text-white antialiased text-xl overflow-x-hidden relative`}>
        <PrivyClientProvider>
          <Header />
          <Toaster />
          <main className="max-w-6xl mx-auto pt-12 pb-22 relative overflow-hidden">
            {children}
          </main>
        </PrivyClientProvider>
      </body>
    </html>
  )
}
