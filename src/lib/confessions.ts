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
        throw error // Rethrow unexpected errors
    }

    if (!profilesResponse || !profilesResponse.profiles) {
        return []
    }

    const allProfiles = profilesResponse.profiles

    // 2. For each profile, fetch their comments (confessions)
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
                authorUsername: c.author.username,
                authorId: c.author.id,
                authorAddress: c.author.wallet_address || c.author.username, // Using username as fallback
                authorAvatar: c.author.image || null
            }

            try {
                if (c.text?.includes(' | ')) {
                    const parts = c.text.split(' | ')
                    if (parts.length >= 3) {
                        const mood = parts[0].trim()
                        const lossStr = parts[1].trim()
                        const lossMatch = lossStr.match(/Lost\s+(.+?)\s+on\s+(.+)/i)

                        if (lossMatch) {
                            parsed.mood = mood
                            parsed.lossAmount = lossMatch[1]
                            parsed.token = lossMatch[2]
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
