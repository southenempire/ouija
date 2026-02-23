import { RPCResponse, TokenResponse } from '@/models/token.models'
import { NextResponse } from 'next/server'

const RPC_URL = process.env.RPC_URL || ''

async function fetchTokenInfoServer(id: string): Promise<TokenResponse | null> {
  try {
    if (!RPC_URL) {
      throw new Error('RPC_URL is not configured')
    }

    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAsset',
        params: { id },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: RPCResponse = await response.json()

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`)
    }

    if (!data.result) {
      throw new Error('No token data found')
    }

    return {
      jsonrpc: data.jsonrpc,
      id: data.id,
      result: data.result,
    }
  } catch (error) {
    console.error('Error fetching token info:', error)
    return null
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
  }

  const tokenInfo = await fetchTokenInfoServer(id)

  if (!tokenInfo) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }

  return NextResponse.json(tokenInfo)
}
