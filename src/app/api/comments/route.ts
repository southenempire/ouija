import { socialfi } from '@/utils/socialfi'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const targetProfileId = searchParams.get('targetProfileId')
  const requestingProfileId = searchParams.get('requestingProfileId')

  try {
    const response = await socialfi.comments.commentsList({
      apiKey: process.env.TAPESTRY_API_KEY || '',
      requestingProfileId: requestingProfileId || '',
      targetProfileId: targetProfileId || '',
    })

    if (!response) {
      throw new Error('Failed to fetch comments')
    }

    return NextResponse.json(response)
  } catch (error: any) {
    if (error?.message?.includes('404') || error?.response?.status === 404) {
      return NextResponse.json({ comments: [] })
    }

    console.error('[Get Comments Error]:', error)

    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, targetProfileId, text, commentId } = body

    if (!profileId || !targetProfileId || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const response = await socialfi.comments.commentsCreate(
      {
        apiKey: process.env.TAPESTRY_API_KEY || '',
      },
      {
        profileId,
        targetProfileId: targetProfileId,
        text,
        commentId,
      },
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Create Comment Error]:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create comment',
      },
      { status: 500 },
    )
  }
}
