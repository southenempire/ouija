import { NextRequest, NextResponse } from 'next/server'

// Helius DAS API endpoint
const HELIUS_RPC = process.env.NEXT_PUBLIC_HELIUS_RPC_URL

export async function POST(req: NextRequest) {
    try {
        const { walletAddress } = await req.json()

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            )
        }

        if (!HELIUS_RPC) {
            return NextResponse.json(
                { error: 'Helius RPC URL not configured' },
                { status: 500 }
            )
        }

        // Use Helius DAS API to get all fungible tokens for the wallet
        const response = await fetch(HELIUS_RPC, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'ouija-verify',
                method: 'searchAssets',
                params: {
                    ownerAddress: walletAddress,
                    tokenType: 'fungible',
                    page: 1,
                    limit: 1000,
                },
            }),
        })

        if (!response.ok) {
            throw new Error(`Helius API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
            throw new Error(`RPC error: ${data.error.message}`)
        }

        // Filter and format the tokens
        const tokens = data.result?.items?.map((item: any) => {
            const tokenInfo = item.token_info

            return {
                id: item.id,
                symbol: tokenInfo?.symbol || 'Unknown',
                balance: tokenInfo?.balance || 0,
                decimals: tokenInfo?.decimals || 0,
                price_info: tokenInfo?.price_info,
                name: item.content?.metadata?.name || 'Unknown Token',
                image: item.content?.links?.image || null
            }
        }) || []

        // Sort by value (if available) or balance
        tokens.sort((a: any, b: any) => {
            const valA = (a.balance / Math.pow(10, a.decimals)) * (a.price_info?.price_per_token || 0)
            const valB = (b.balance / Math.pow(10, b.decimals)) * (b.price_info?.price_per_token || 0)

            if (valA !== valB) return valB - valA
            return b.balance - a.balance
        })

        return NextResponse.json({ tokens })
    } catch (error: any) {
        console.error('[Token Verification Error]:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to verify tokens' },
            { status: 500 }
        )
    }
}
