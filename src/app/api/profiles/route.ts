import { socialfi } from '@/utils/socialfi'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('walletAddress')

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'walletAddress is required' },
      { status: 400 },
    )
  }

  try {
    try {
      // 1. Direct explicit lookup bypassing Tapestry indexer lag
      const directResponse = await socialfi.profiles.profilesDetail({
        apiKey: process.env.TAPESTRY_API_KEY || '',
        id: walletAddress,
      })
      if (directResponse && directResponse.profile) {
        return NextResponse.json({ profiles: [directResponse] })
      }
    } catch {
      // Ignore direct query 404s, fall back to indexer list
    }

    // 2. Fallback to Tapestry list indexer
    const response = await socialfi.profiles.profilesList({
      apiKey: process.env.TAPESTRY_API_KEY || '',
      walletAddress,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    if (error?.message?.includes('404') || error?.response?.status === 404) {
      return NextResponse.json({ profiles: [], page: 1, pageSize: 10, totalCount: 0 })
    }
    console.error('Error fetching profiles:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profiles' },
      { status: 500 },
    )
  }
}
