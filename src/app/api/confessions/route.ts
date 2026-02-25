import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { getConfessionsData } from '@/lib/confessions'

export async function GET() {
    try {
        const { formatted: confessions, debugState } = await getConfessionsData()
        return NextResponse.json(
            { confessions, debugState },
            {
                headers: {
                    // Cache for 10 seconds at the edge, serve stale while revalidating for another 59s
                    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
                }
            }
        )
    } catch (error: any) {
        console.error('Failed to get confessions in route:', error)
        return NextResponse.json({ error: 'Failed to fetch confessions', confessions: [] }, { status: 500 })
    }
}
