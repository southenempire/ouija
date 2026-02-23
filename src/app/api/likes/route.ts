import { socialfi } from '@/utils/socialfi'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nodeId, startId } = body

    if (!nodeId) {
      return NextResponse.json(
        { error: 'Missing required nodeId' },
        { status: 400 },
      )
    }

    const response = await socialfi.likes.likesCreate(
      {
        apiKey: process.env.TAPESTRY_API_KEY || '',
        nodeId: nodeId,
      },
      { startId },
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Create like Error]:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create like',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { nodeId, startId } = body

    if (!nodeId) {
      return NextResponse.json(
        { error: 'Missing required nodeId' },
        { status: 400 },
      )
    }

    const response = await socialfi.likes.likesDelete(
      {
        apiKey: process.env.TAPESTRY_API_KEY || '',
        nodeId: nodeId,
      },
      { startId },
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Unlike Error]:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to unlike',
      },
      { status: 500 },
    )
  }
}
