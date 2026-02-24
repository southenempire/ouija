'use client'

import { Skull, Ghost, Flame, TrendingDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12 text-center px-4 overflow-hidden relative">
      <motion.div style={{ y, opacity }} className="absolute top-1/4 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -z-10" />
      <motion.div style={{ y, opacity }} className="absolute bottom-1/4 -right-20 w-64 h-64 bg-error/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
      >
        <motion.div
          animate={{ y: [-15, -15, 0, 0, -15] }}
          transition={{ duration: 1.4, repeat: Infinity, times: [0, 0.49, 0.5, 0.99, 1] }}
        >
          <div
            className="relative w-40 h-40 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)] mix-blend-screen xl:w-48 xl:h-48"
            style={{ maskImage: 'radial-gradient(circle closest-side, black 80%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle closest-side, black 85%, transparent 100%)' }}
          >
            <Image
              src="/pixel-ghost.png"
              alt="Floating Pixel Art Ghost"
              fill
              sizes="(max-width: 768px) 160px, 192px"
              className="object-contain filter contrast-125 brightness-110"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-4 -right-4"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Skull className="w-14 h-14 text-accent drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
        </motion.div>
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-gradient-to-br from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent pb-1"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        Confess Your<br />Dead Trades
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mb-8 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        The definitive onchain confessional built on <span className="text-white font-bold">Tapestry</span>.
        Bear your soul, reveal your worst losses, and let the community press F to pay respects.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-6 relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Link
          href="/confess"
          className="group relative inline-flex items-center justify-center h-16 px-10 rounded-full bg-accent text-white font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(168,85,247,0.8)]"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[30deg] transition-all duration-700 ease-out group-hover:translate-x-[150%]"></span>
          Confess Now <Flame className="ml-3 w-5 h-5 group-hover:animate-pulse" />
        </Link>
        <Link
          href="/graveyard"
          className="inline-flex items-center justify-center h-16 px-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-white font-bold text-lg transition-all active:scale-95"
        >
          View Graveyard
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        {[
          { label: "Confessions", value: "NaN", icon: <Ghost className="w-5 h-5 text-zinc-500 mb-2" /> },
          { label: "Total Lost", value: "$$$", icon: <TrendingDown className="w-5 h-5 text-accent mb-2" /> },
          { label: "F's Pressed", value: "∞", icon: <Skull className="w-5 h-5 text-success mb-2" /> }
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {stat.icon}
            <span className={`text-4xl font-black mb-1 ${i === 1 ? 'text-accent text-glow' : i === 2 ? 'text-success text-glow-success' : 'text-white'}`}>
              {stat.value}
            </span>
            <span className="text-zinc-500 font-medium tracking-widest text-sm uppercase">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
