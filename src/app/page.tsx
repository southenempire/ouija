'use client'

import { Skull, Ghost, Flame, TrendingDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const containerRef = useRef(null)
  const [stats, setStats] = useState({
    confessions: '...',
    totalLost: '...',
    fsPressed: '...'
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/confessions?t=${new Date().getTime()}`, {
          cache: 'no-store',
          next: { revalidate: 0 }
        })
        const data = await res.json()
        if (data.confessions) {
          const confessions = data.confessions
          let totalLostVal = 0
          let totalFs = 0

          confessions.forEach((c: any) => {
            const parsed = parseFloat(c.lossAmount.replace(/[^0-9.]/g, ''))
            if (!isNaN(parsed)) totalLostVal += parsed
            if (c.likes) totalFs += c.likes
          })

          const formatCurrency = (val: number) => {
            if (val === 0) return '$$$'
            if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
            if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
            return `$${val.toLocaleString()}`
          }

          setStats({
            confessions: confessions.length.toString(),
            totalLost: formatCurrency(totalLostVal),
            fsPressed: totalFs.toString()
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
  }, [])
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="flex flex-col items-center min-h-[calc(100vh-80px)] overflow-hidden relative bg-zinc-950 w-full max-w-[100vw]">
      {/* Fog Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen opacity-60">
        <motion.div
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
          animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/2 left-0 right-0 h-full bg-gradient-to-t from-zinc-900 via-zinc-800/50 to-transparent blur-3xl saturate-0"
          animate={{ x: [-100, 100, -100], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-tr from-accent/10 via-transparent to-transparent blur-3xl opacity-60"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center flex-grow pt-20 px-4">
        <motion.div
          className="relative mb-4"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
        >
          <motion.div
            animate={{ y: [-10, -10, 0, 0, -10] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.49, 0.5, 0.99, 1] }}
          >
            <div
              className="relative w-48 h-48 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] mix-blend-screen"
              style={{ maskImage: 'radial-gradient(circle closest-side, black 80%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle closest-side, black 85%, transparent 100%)' }}
            >
              <Image
                src="/pixel-ghost.png"
                alt="Ouija Ghost"
                fill
                sizes="192px"
                className="object-contain filter contrast-125 brightness-110"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-center text-zinc-100 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Confess Your<br />Crypto <span className="text-zinc-500 line-through decoration-error decoration-8 opacity-80">Losses</span> Sins
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl mb-12 leading-relaxed text-center drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          The onchain graveyard built on <span className="text-white font-bold">Tapestry</span>.
          Share your worst trading mistakes and let the community press F.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/confess"
            className="group relative inline-flex items-center justify-center h-16 px-10 rounded bg-accent text-white font-bold text-xl overflow-hidden shadow-[0_4px_0_0_#7e22ce,0_10px_20px_rgba(168,85,247,0.4)] active:shadow-[0_0px_0_0_#7e22ce,0_0px_0_rgba(168,85,247,0.4)] active:translate-y-[4px] border-2 border-white/20 transition-all tracking-wider"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent"></span>
            BURY A BAG <Flame className="ml-3 w-6 h-6 text-orange-400 group-hover:animate-pulse drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
          </Link>
          <Link
            href="/graveyard"
            className="group inline-flex items-center justify-center h-16 px-10 rounded bg-zinc-900 text-zinc-300 font-bold text-xl border-4 border-zinc-700 shadow-[0_4px_0_0_#3f3f46,0_10px_20px_rgba(0,0,0,0.5)] active:shadow-[0_0px_0_0_#3f3f46,0_0px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all tracking-wider"
          >
            ENTER GRAVEYARD
          </Link>
        </motion.div>
      </main>

      {/* Tombstone Stats Bar */}
      <motion.div
        className="w-full relative z-20 mt-20 border-t-8 border-zinc-800 bg-zinc-950 pt-10 pb-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex-grow"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-600 to-transparent opacity-30"></div>
        <div className="absolute top-0 right-10 -translate-y-[95%]">
          {/* Background decorative tombstone silhouettes sitting on the wall */}
          <div className="w-24 h-32 bg-zinc-800 rounded-t-full absolute right-40 bottom-0 opacity-50 z-0 border-t-4 border-l-4 border-zinc-700"></div>
          <div className="w-16 h-20 bg-zinc-800 rounded-t-full absolute right-12 bottom-0 opacity-30 z-0 border-t-2 border-l-2 border-zinc-700"></div>
          <div className="w-20 h-28 bg-zinc-800/80 rounded-t-sm absolute right-72 bottom-0 -rotate-12 opacity-40 z-0 border-t-4 border-zinc-700"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { label: "BODIES BURIED", value: stats.confessions, icon: <Ghost className="w-8 h-8 text-zinc-500 mb-4 mx-auto" />, color: 'text-zinc-200' },
            { label: "WEALTH DESTROYED", value: stats.totalLost, icon: <TrendingDown className="w-8 h-8 text-error mb-4 mx-auto" />, color: 'text-error drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
            { label: "RESPECTS PAID", value: stats.fsPressed, icon: <Skull className="w-8 h-8 text-success mb-4 mx-auto" />, color: 'text-success drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]' }
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-end relative h-64 p-8 group"
            >
              {/* Tombstone Shape Background */}
              <div className="absolute bottom-0 w-full max-w-[240px] h-[110%] bg-zinc-900 rounded-t-[100px] border-4 border-b-0 border-zinc-800 shadow-[inset_0_10px_30px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-500 group-hover:-translate-y-2">
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/5 to-transparent rounded-t-[100px]" />

                {/* Cracks / Texture for Tombstone */}
                <div className="absolute top-1/4 left-1/4 w-12 h-0.5 bg-zinc-950 -rotate-12 opacity-50" />
                <div className="absolute top-1/3 right-1/4 w-16 h-0.5 bg-zinc-950 rotate-45 opacity-30" />
                <div className="absolute bottom-1/4 left-1/3 w-8 h-0.5 bg-zinc-950 rotate-12 opacity-40" />

                <div className="h-full w-full flex flex-col items-center justify-start pt-12 pb-8 px-6 text-center z-10 relative">
                  {stat.icon}
                  <span className={`text-3xl md:text-5xl font-black mb-2 tracking-widest ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-zinc-500 font-bold tracking-widest text-xs md:text-sm uppercase opacity-80 border-t border-zinc-700 pt-2 w-3/4">
                    {stat.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
