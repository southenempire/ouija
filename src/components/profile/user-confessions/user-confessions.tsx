'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/common/card'
import { Button } from '@/components/common/button'
import { motion } from 'framer-motion'
import { Skull, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { useGetProfiles } from '@/components/auth/hooks/use-get-profiles'
import { useSfx } from '@/hooks/use-sfx'

interface Props {
    profileId: string
}

export function UserConfessions({ profileId }: Props) {
    const [confessions, setConfessions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { walletAddress } = useCurrentWallet()
    const { profiles } = useGetProfiles({ walletAddress: walletAddress || '' })
    const { playPressF } = useSfx()

    useEffect(() => {
        if (!profileId) return

        const fetchUserConfessions = async () => {
            try {
                const res = await fetch(`/api/comments?targetProfileId=${profileId}`)
                const data = await res.json()
                if (data.comments) {
                    // Parse out the structured content [MOOD] | Lost [AMOUNT] on [TOKEN] | [STORY]
                    const formatted = data.comments.map((c: any) => {
                        const parsed = {
                            id: c.id,
                            text: c.text,
                            mood: '🪦',
                            lossAmount: 'Unknown',
                            token: 'Unknown Token',
                            story: c.text,
                            likes: c.likes_count || 0,
                            createdAt: c.created_at || new Date().toISOString(),
                            txHash: c.tx_hash
                        }

                        try {
                            if (c.text?.includes(' | ')) {
                                const parts = c.text.split(' | ')
                                if (parts.length >= 3) {
                                    const mood = parts[0].trim()
                                    const lossStr = parts[1].trim()
                                    const lossMatch = lossStr.match(/Lost\s+(.+?)\s+on\s+(.+)/i)

                                    if (lossMatch) {
                                        parsed.mood = mood
                                        parsed.lossAmount = lossMatch[1]
                                        parsed.token = lossMatch[2]
                                        parsed.story = parts.slice(2).join(' | ').trim()
                                    }
                                }
                            }
                        } catch {
                            // Ignore parsing errors
                        }
                        return parsed
                    })

                    setConfessions(formatted)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchUserConfessions()
    }, [profileId])

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
                    startId: profiles[0].profile.id,
                    nodeId: confessionId,
                })
            })

            if (!res.ok) throw new Error('Failed to pay respects')

            playPressF()
            toast.success('Respects paid. F.', { icon: '🕯️' })

            setConfessions(prev => prev.map(c =>
                c.id === confessionId ? { ...c, likes: c.likes + 1 } : c
            ))
        } catch (e: any) {
            toast.error(e.message || 'Failed to like')
        }
    }

    let content

    if (loading) {
        content = (
            <div className="flex justify-center p-8">
                <Skull className="animate-pulse text-accent w-8 h-8" />
            </div>
        )
    } else if (confessions.length === 0) {
        content = (
            <Card className="p-8 text-center bg-muted/50 border-muted-light">
                <p className="text-gray">No confessions yet.</p>
            </Card>
        )
    } else {
        content = (
            <div className="space-y-4">
                {confessions.map((confession, idx) => (
                    <motion.div
                        key={confession.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                        <Card className="p-5 bg-muted/80 backdrop-blur border-muted-light">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 border-4 border-muted-light bg-background flex items-center justify-center text-xl shadow-[4px_4px_0_0_#18181b]">
                                        {confession.mood}
                                    </div>
                                    <div className="font-bold flex items-center gap-2 text-sm">
                                        <span className="text-error">Lost {confession.lossAmount}</span>
                                        <span className="text-gray font-normal">on {confession.token}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 text-foreground/90 whitespace-pre-wrap text-sm">
                                &quot;{confession.story}&quot;
                            </div>

                            <div className="flex items-center justify-between border-t border-muted-light pt-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Button
                                        variant="ghost"
                                        onClick={() => handlePressF(confession.id)}
                                        className="text-gray hover:text-success gap-2 h-8 px-2 group/btn transition-colors"
                                    >
                                        <span className="font-bold font-pixel text-xl group-hover/btn:scale-125 transition-transform duration-300">F</span>
                                        <span className="bg-background border-2 border-muted-light px-2 py-0.5 rounded-none font-bold font-pixel text-xs shadow-none">{confession.likes}</span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            const text = `I just found this brutal crypto confession in the Solana Graveyard 🪦\n\n${confession.authorUsername || 'Some poor soul'} lost ${confession.lossAmount} on ${confession.token} 😭\n\nPress F to pay respects: https://ouija-omega.vercel.app/graveyard\n\n@usetapestry @ouijadotfun #SolanaGraveyardHackathon`
                                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
                                        }}
                                        className="text-gray hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 gap-2 h-8 px-2 transition-colors"
                                    >
                                        <div title="Share to X" className="flex items-center gap-2">
                                            <Share2 size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Share</span>
                                        </div>
                                    </Button>
                                </div>

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
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Skull size={20} className="text-accent" /> Tombstones
            </h3>
            {content}
        </div>
    )
}
