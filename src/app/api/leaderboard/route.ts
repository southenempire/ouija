import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Reusing the global confessions logic to derive the leaderboard
        const response = await fetch(new URL('/api/confessions', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), {
            next: { revalidate: 60 } // Cache for 1 min
        })

        if (!response.ok) throw new Error('Failed to fetch confessions')

        const data = await response.json()
        const allConfessions = data.confessions || []

        // 1. Hall of Pain (Most F's)
        const topLiked = [...allConfessions]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 5)

        // 2. Biggest Losses (Naive sorting by parsed amount, assuming standard numbers)
        // In reality, this needs normalized USD values, but we'll do our best parsing for the hackathon MVP
        const parseAmount = (amountStr: string) => {
            const cleaned = amountStr.replace(/[^0-9.]/g, '')
            return parseFloat(cleaned) || 0
        }

        const biggestLosses = [...allConfessions]
            .sort((a, b) => parseAmount(b.lossAmount) - parseAmount(a.lossAmount))
            .slice(0, 5)

        return NextResponse.json({
            topLiked,
            biggestLosses
        })
    } catch (error: any) {
        console.error('Leaderboard error:', error)
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }
}
