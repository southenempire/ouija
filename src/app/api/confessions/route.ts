import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { getConfessionsData } from '@/lib/confessions'

export async function GET() {
    try {
        const { formatted: confessions, debugState } = await getConfessionsData()
        return NextResponse.json({ confessions, debugState })
    } catch (error: any) {
        console.error('Failed to get confessions in route:', error)
        return NextResponse.json({ error: 'Failed to fetch confessions', confessions: [] }, { status: 500 })
    }
}
