import { Header } from '@/components/common/header'
import { PrivyClientProvider } from '@/components/provider/PrivyClientProvider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ouija | The Tapestry Onchain Confessional',
  description: 'Confess your dead crypto bags onchain. Built natively on the Tapestry Social Protocol. Where digital ghosts finally find peace, and readers press F to pay respects.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground min-h-screen selection:bg-accent/30 selection:text-white antialiased`}>
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
