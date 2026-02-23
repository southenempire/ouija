'use client'

import { Card } from '@/components/common/card'
import { Flame, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Leaderboard() {
    const [data, setData] = useState<{ topLiked: any[], biggestLosses: any[] } | null>(null)
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
        <Card className="p-0 overflow-hidden bg-background border-muted-light shadow-xl">
            <div className="bg-accent/10 border-b border-accent/20 p-4 flex items-center gap-2">
                <Trophy className="text-accent" />
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
                                <span className="font-bold truncate text-sm">@{confession.author.username}</span>
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
    )
}
