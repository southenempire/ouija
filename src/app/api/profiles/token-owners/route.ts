import { socialfi } from '@/utils/socialfi'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tokenAddress = searchParams.get('tokenAddress')

  if (!tokenAddress) {
    return NextResponse.json(
      { error: 'TokenAddress is required' },
      { status: 400 },
    )
  }

  try {
    const response = await socialfi.profiles.tokenOwnersDetail({
      apiKey: process.env.TAPESTRY_API_KEY || '',
      tokenAddress,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching profile token details:', error)

    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile token details' },
      { status: 500 },
    )
  }
}
