import { socialfi } from '@/utils/socialfi'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // 1. Fetch all profiles in our namespace
        const profilesResponse = await socialfi.profiles.profilesList({
            apiKey: process.env.TAPESTRY_API_KEY || '',
        })

        if (!profilesResponse || !profilesResponse.profiles) {
            return NextResponse.json({ confessions: [] })
        }

        const allProfiles = profilesResponse.profiles

        // 2. For each profile, fetch their comments (confessions)
        // In a production app, we'd use a more robust Tapestry indexing/search API,
        // but for the hackathon MVP, we can aggregate comments from profiles.
        const confessionsPromises = allProfiles.map(async (profile: any) => {
            try {
                const commentsResponse = await socialfi.comments.commentsList({
                    apiKey: process.env.TAPESTRY_API_KEY || '',
                    targetProfileId: profile.id,
                })

                // Return comments attached with profile info
                return (commentsResponse?.comments || []).map((comment: any) => ({
                    ...comment,
                    author: profile
                }))
            } catch {
                console.error(`Failed to fetch comments for profile ${profile.id}`)
                return []
            }
        })

        const allConfessionsArrays = await Promise.all(confessionsPromises)

        // 3. Flatten, sort by newest, and format
        const allConfessions = allConfessionsArrays
            .flat()
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        // Parse out the structured content [MOOD] | Lost [AMOUNT] on [TOKEN] | [STORY]
        const formattedConfessions = allConfessions.map(c => {
            // Default fallback if it doesn't match our strict format
            const formatted = {
                id: c.id,
                author: c.author,
                text: c.text,
                mood: '🪦',
                lossAmount: 'Unknown',
                token: 'Unknown Token',
                story: c.text,
                likes: c.likes_count || 0,
                createdAt: c.created_at,
                txHash: c.tx_hash
            }

            try {
                // Try to parse our specific format
                const parts = c.text.split(' | ')
                if (parts.length >= 3) {
                    const mood = parts[0].trim()

                    // 'Lost $50k on BTC' -> extract amount and token
                    const lossStr = parts[1].trim()
                    const lossMatch = lossStr.match(/Lost\s+(.+?)\s+on\s+(.+)/i)

                    if (lossMatch) {
                        formatted.mood = mood
                        formatted.lossAmount = lossMatch[1]
                        formatted.token = lossMatch[2]
                        formatted.story = parts.slice(2).join(' | ').trim()
                    }
                }
            } catch {
                // Ignore parsing errors and use fallback
            }

            return formatted
        })

        return NextResponse.json({ confessions: formattedConfessions })
    } catch (error: any) {
        console.error('[Get All Confessions Error]:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch confessions' },
            { status: 500 },
        )
    }
}
