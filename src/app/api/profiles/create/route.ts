import { socialfi } from '@/utils/socialfi'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const username = formData.get('username')?.toString()
  const ownerWalletAddress = formData.get('ownerWalletAddress')?.toString()
  const bio = formData.get('bio')?.toString()
  const image = formData.get('image')?.toString()

  if (!username || !ownerWalletAddress) {
    return NextResponse.json(
      { error: 'Username and owner wallet address are required' },
      { status: 400 },
    )
  }
  try {
    const profile = await socialfi.profiles.findOrCreateCreate(
      {
        apiKey: process.env.TAPESTRY_API_KEY || '',
      },
      {
        walletAddress: ownerWalletAddress,
        username,
        bio,
        image,
        blockchain: 'SOLANA',
      },
    )

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Error creating profile:', error)
    // Tapestry API throws 404 if it fails to find the target profile or fails to create it 
    // due to conflict. Sometimes it returns a 400 string.
    if (error?.message?.includes('404') || error?.response?.status === 404 || error?.message?.includes('400')) {
      // Aggressive fallback: The profile might literally already exist in this namespace for this wallet.
      // Let's try to forcefully fetch it. If we find it, just return it as a success!
      try {
        const existing = await socialfi.profiles.profilesDetail({
          apiKey: process.env.TAPESTRY_API_KEY || '',
          id: ownerWalletAddress,
        })
        if (existing && existing.profile) {
          return NextResponse.json(existing)
        }
      } catch {
        // Fall through to error
      }

      return NextResponse.json(
        { error: 'Username may already be taken or invalid, and no profile is linked to this wallet.' },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 500 },
    )
  }
}

export const dynamic = 'force-dynamic'
