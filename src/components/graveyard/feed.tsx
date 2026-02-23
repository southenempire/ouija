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

export function Feed() {
    const [confessions, setConfessions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { walletAddress } = useCurrentWallet()
    const { profiles } = useGetProfiles({ walletAddress: walletAddress || '' })

    const fetchConfessions = async () => {
        try {
            const res = await fetch('/api/confessions')
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
            <Card className="p-12 text-center bg-muted/50 border-muted-light">
                <Skull className="w-16 h-16 text-gray mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">The graveyard is empty</h3>
                <p className="text-gray">Be the first to confess your sins onchain.</p>
            </Card>
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
                        <Card className="p-6 bg-muted/80 backdrop-blur border-muted-light hover:border-accent transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-muted-light text-xl shadow-inner">
                                        {confession.mood}
                                    </div>
                                    <div>
                                        <div className="font-bold flex items-center gap-2">
                                            <span className="text-error">Lost {confession.lossAmount}</span>
                                            <span className="text-sm text-gray font-normal">on {confession.token}</span>
                                        </div>
                                        <div className="text-sm text-gray">
                                            by {confession.author.username} ({abbreviateWalletAddress({ address: confession.author.wallet_address })})
                                        </div>
                                    </div>
                                </div>

                                {confession.txHash && (
                                    <a
                                        href={`https://explorer.solana.com/tx/${confession.txHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray hover:text-accent transition-colors"
                                        title="View on Explorer"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>

                            <div className="mb-6 text-foreground/90 whitespace-pre-wrap font-medium">
                                &quot;{confession.story}&quot;
                            </div>

                            <div className="flex items-center justify-between border-t border-muted-light pt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => handlePressF(confession.id)}
                                    className="text-gray hover:text-success hover:bg-success/10 gap-2 flex-grow sm:flex-grow-0"
                                >
                                    <span className="font-bold text-lg">F</span>
                                    <span className="bg-background px-2 py-0.5 rounded-full text-xs">{confession.likes}</span>
                                </Button>

                                <div className="text-xs text-gray">
                                    {new Date(confession.createdAt).toLocaleDateString()}
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
