import { socialfi } from '@/utils/socialfi'

export async function getConfessionsData() {
    // 1. Fetch all profiles in our namespace
    let profilesResponse: any = null
    try {
        profilesResponse = await socialfi.profiles.profilesList({
            apiKey: process.env.TAPESTRY_API_KEY || '',
        })
    } catch (error: any) {
        // Tapestry API throws a 404 if no profiles exist in the namespace
        if (error?.message?.includes('404') || error?.response?.status === 404) {
            return []
        }
        return []
    }

    if (!profilesResponse || !profilesResponse.profiles) {
        return []
    }

    // Handle nested payload structure from the Tapestry SDK
    const allProfiles = profilesResponse.profiles.map((p: any) => p.profile || p)

    // 2. For each profile, fetch their comments (confessions)
    const confessionsPromises = allProfiles.map(async (profile: any) => {
        try {
            const commentsResponse = await socialfi.comments.commentsList({
                apiKey: process.env.TAPESTRY_API_KEY || '',
                targetProfileId: profile.id,
            })

            // Return comments attached with profile info
            return (commentsResponse?.comments || []).map((comment: any) => {
                // The newest API structure sometimes nests comment text under .comment.text
                const textRaw = comment.comment?.text || comment.text || ''
                const idRaw = comment.comment?.id || comment.id
                const createdRaw = comment.comment?.created_at || comment.created_at || new Date().toISOString()
                return {
                    id: idRaw,
                    text: textRaw,
                    created_at: createdRaw,
                    likes_count: comment.socialCounts?.likeCount || comment.likes_count || 0,
                    tx_hash: comment.tx_hash,
                    author: profile
                }
            })
        } catch (error: any) {
            if (error?.message?.includes('404') || error?.response?.status === 404) {
                return []
            }
            console.error(`Failed to fetch comments for profile ${profile.id}:`, error)
            return []
        }
    })

    const nestedConfessions = await Promise.all(confessionsPromises)
    const flatConfessions = nestedConfessions.flat(1)

    if (flatConfessions.length === 0) {
        console.warn("No confessions found across all profiles.")
    }

    // 3. Process and format the raw comments
    const formatted = flatConfessions
        .map(c => {
            const parsed = {
                id: c.id,
                text: c.text,
                mood: '🪦',
                lossAmount: 'Unknown',
                token: 'Unknown Token',
                story: c.text,
                likes: c.likes_count || 0,
                createdAt: c.created_at || new Date().toISOString(),
                txHash: c.tx_hash,
                authorUsername: c.author?.username || 'Unknown',
                authorId: c.author?.id || 'unknown',
                authorAddress: c.author?.wallet_address || c.author?.username || 'Unknown', // Using username as fallback
                authorAvatar: c.author?.image || null
            }

            try {
                if (c.text?.includes(' | ')) {
                    const parts = c.text.split(' | ')
                    if (parts.length >= 3) {
                        const mood = parts[0].trim()
                        const summaryStr = parts[1].trim()
                        const match = summaryStr.match(/(?:Lost|Almost aped|Sold|Traded)\s+(.+?)\s+(?:on|into|for)\s+(.+)/i)

                        if (match) {
                            parsed.mood = mood
                            parsed.lossAmount = match[1]
                            parsed.token = match[2]
                            parsed.story = parts.slice(2).join(' | ').trim()
                        } else {
                            parsed.mood = mood
                            parsed.story = parts.slice(2).join(' | ').trim()
                        }
                    }
                }
            } catch {
                // Ignore parsing errors
            }
            return parsed
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return formatted
}
