import { NextResponse } from 'next/server'
import { getConfessionsData } from '../confessions/route'

export async function GET() {
    try {
        // Fetch confessions directly using the exported data logic
        // This avoids making a local fetch to /api/confessions which
        // notoriously causes Next.js ECONNRESET timeouts locally.
        const allConfessions = await getConfessionsData()

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
