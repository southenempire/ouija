'use client'

import { Card } from '@/components/common/card'
import { Flame, Trophy, AlertTriangle, Skull } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Leaderboard() {
    const [data, setData] = useState<{ topLiked: any[], biggestLosses: any[], mostHauntedTokens: any[] } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard')
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaderboard()
    }, [])

    if (loading) {
        return (
            <Card className="p-6 bg-muted/30 animate-pulse h-64 border-muted-light">
                <div className="h-6 w-32 bg-muted rounded mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-10 bg-muted/50 rounded"></div>)}
                </div>
            </Card>
        )
    }

    if (!data || (data.topLiked.length === 0 && data.biggestLosses.length === 0)) {
        return null
    }

    return (
        <div className="space-y-6">
            <Card className="p-0 overflow-hidden bg-background border-muted-light shadow-xl">
                <div className="bg-accent/10 border-b border-accent/20 p-4 flex items-center gap-2">
                    <Trophy className="text-accent" size={20} />
                    <h3 className="font-bold text-lg text-foreground">Hall of Pain</h3>
                </div>

                <div className="p-4 space-y-4">
                    {data.topLiked.map((confession, idx) => (
                        <div key={confession.id} className="flex items-center gap-3 border-b border-muted/50 pb-3 last:border-0 last:pb-0">
                            <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                    idx === 1 ? 'bg-gray-300/20 text-gray-300' :
                                        idx === 2 ? 'bg-amber-700/20 text-amber-700' : 'bg-muted text-gray'}
                `}>
                                #{idx + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <Link href={`/${confession.authorUsername || ''}`} className="font-bold truncate text-sm hover:underline hover:text-accent transition-colors">
                                        @{confession.authorUsername || 'tombstone'}
                                    </Link>
                                    <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                                        <Flame size={12} /> {confession.likes} F&apos;s
                                    </span>
                                </div>
                                <p className="text-xs text-error truncate">Lost {confession.lossAmount} on {confession.token}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {data.mostHauntedTokens && data.mostHauntedTokens.length > 0 && (
                <Card className="p-0 overflow-hidden bg-background border-error/20 shadow-xl">
                    <div className="bg-error/10 border-b border-error/20 p-4 flex items-center gap-2">
                        <AlertTriangle className="text-error" size={20} />
                        <div>
                            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                                Most Haunted Tickers
                            </h3>
                            <p className="text-[11px] text-zinc-400">Pre-trade Graveyard risk signals</p>
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        {data.mostHauntedTokens.map((item, idx) => (
                            <div key={item.token} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-error/30 transition-all">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-zinc-500 w-4">#{idx + 1}</span>
                                    <span className="font-black text-sm text-white tracking-wide">${item.token}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-error bg-error/10 px-2.5 py-1 rounded-full border border-error/20">
                                    <Skull size={12} />
                                    {item.count} {item.count === 1 ? 'Confession' : 'Confessions'}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}
