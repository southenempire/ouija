'use client'

import { ArrowRight, Skull, Ghost } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden">
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Ghost className="w-24 h-24 text-success opacity-80 animate-pulse" />
        <Skull className="w-12 h-12 text-accent absolute -bottom-2 -right-2 animate-bounce flex-shrink-0" />
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white to-gray bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Confess Your<br />Dead Trades
      </motion.h1>

      <motion.p
        className="text-xl text-gray max-w-2xl mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        An onchain confessional built on Tapestry. Bear your soul, reveal your worst losses, and let the community press F to pay respects.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Link
          href="/confess"
          className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all transform hover:scale-105"
        >
          Confess Now <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <Link
          href="/graveyard"
          className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-muted hover:bg-muted-light text-white font-semibold transition-all"
        >
          View Graveyard
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-4xl border-t border-muted pt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-white mb-2">NaN</span>
          <span className="text-gray text-sm uppercase tracking-widest">Confessions</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-accent mb-2">$$$</span>
          <span className="text-gray text-sm uppercase tracking-widest">Total Lost</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-success mb-2">∞</span>
          <span className="text-gray text-sm uppercase tracking-widest">F&apos;s Pressed</span>
        </div>
      </motion.div>
    </div>
  )
}
