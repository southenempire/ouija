'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/common/card'
import { Button } from '@/components/common/button'
import { motion } from 'framer-motion'
import { Skull, ExternalLink } from 'lucide-react'
import { abbreviateWalletAddress } from '@/components/common/tools'
import { toast } from 'sonner'
import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { useGetProfiles } from '@/components/auth/hooks/use-get-profiles'
import { useSfx } from '@/hooks/use-sfx'

export function Feed() {
    const [confessions, setConfessions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { walletAddress } = useCurrentWallet()
    const { profiles } = useGetProfiles({ walletAddress: walletAddress || '' })
    const { playPressF } = useSfx()

    const fetchConfessions = async () => {
        try {
            const res = await fetch(`/api/confessions?t=${new Date().getTime()}`, {
                cache: 'no-store',
                next: { revalidate: 0 }
            })
            const data = await res.json()
            if (data.confessions) {
                setConfessions(data.confessions)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConfessions()
    }, [])

    const handlePressF = async (confessionId: string) => {
        if (!profiles || profiles.length === 0) {
            toast.error('Connect your wallet and create a profile to press F')
            return
        }

        try {
            const res = await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileId: profiles[0].profile.id,
                    commentId: confessionId,
                })
            })

            if (!res.ok) throw new Error('Failed to pay respects')

            playPressF()
            toast.success('Respects paid. F.', { icon: '🕯️' })

            // Optimistic update
            setConfessions(prev => prev.map(c =>
                c.id === confessionId ? { ...c, likes: c.likes + 1 } : c
            ))
        } catch (e: any) {
            toast.error(e.message || 'Failed to like')
        }
    }

    // Render logic
    let content

    if (loading) {
        content = null // Suspense handles fallback
    } else if (confessions.length === 0) {
        content = (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
            >
                <Card className="p-16 text-center glass-card border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-50" />
                    <Skull className="w-20 h-20 text-zinc-600 mx-auto mb-6 group-hover:text-accent group-hover:animate-pulse transition-colors duration-500" />
                    <h3 className="text-3xl font-black mb-3 text-white tracking-tight">No Confessions Yet</h3>
                    <p className="text-zinc-400 text-lg max-w-md mx-auto">Be the first to post a loss and let the community press F.</p>
                </Card>
            </motion.div>
        )
    } else {
        content = (
            <div className="space-y-6">
                {confessions.map((confession, idx) => (
                    <motion.div
                        key={confession.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                        <Card className="p-6 glass-card border-white/5 hover:border-accent/40 transition-all duration-500 group relative overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)] hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-900/80 flex items-center justify-center border-4 border-muted-light text-2xl group-hover:scale-110 transition-transform duration-500 shadow-[4px_4px_0_0_#18181b]">
                                            {confession.mood}
                                        </div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2 text-lg">
                                                <span className="text-error drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">Lost {confession.lossAmount}</span>
                                                <span className="text-zinc-500 font-medium">on <span className="text-zinc-300">{confession.token}</span></span>
                                            </div>
                                            <div className="text-sm text-zinc-500 flex items-center gap-1.5 mt-0.5">
                                                <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[8px]">👤</span>
                                                {confession.author.username} <span className="opacity-50">•</span> {abbreviateWalletAddress({ address: confession.author.wallet_address })}
                                            </div>
                                        </div>
                                    </div>

                                    {confession.txHash && (
                                        <a
                                            href={`https://explorer.solana.com/tx/${confession.txHash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-zinc-500 hover:text-accent transition-colors bg-white/5 p-2 rounded-full hover:bg-accent/20"
                                            title="View on Explorer"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>

                                <div className="mb-6 text-zinc-200 text-lg leading-relaxed whitespace-pre-wrap font-medium pl-14 relative">
                                    <span className="text-6xl text-white/5 absolute -top-4 left-0 font-serif">&quot;</span>
                                    {confession.story}
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4 pl-14">
                                    <Button
                                        variant="ghost"
                                        onClick={() => handlePressF(confession.id)}
                                        className="text-zinc-400 hover:text-success hover:bg-success/10 gap-2 flex-grow sm:flex-grow-0 group/btn transition-colors"
                                    >
                                        <span className="font-black text-xl group-hover/btn:scale-125 transition-transform duration-300 shadow-none font-pixel">F</span>
                                        <span className="bg-zinc-900 border-2 border-muted-light px-3 py-1 text-xs font-bold font-pixel flex items-center gap-1">
                                            <Skull size={10} className={confession.likes > 0 ? "text-success" : "text-zinc-600"} />
                                            {confession.likes}
                                        </span>
                                    </Button>

                                    <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
                                        {new Date(confession.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        )
    }

    return (
        <div className="w-full">
            {content}
        </div>
    )
}
