import { socialfi } from '@/utils/socialfi'

export const getFollowers = async ({ username }: { username: string }) => {
  try {
    const response = await socialfi.profiles.followersList({
      id: username,
      apiKey: process.env.TAPESTRY_API_KEY || '',
    })
    return response as any
  } catch (error: any) {
    if (error?.message?.includes('404') || error?.response?.status === 404) {
      return { profiles: [], page: 1, pageSize: 10 } as any
    }
    throw new Error(error.message || 'Failed get followers list')
  }
}

export const getFollowing = async ({ username }: { username: string }) => {
  try {
    const response = await socialfi.profiles.followingList({
      id: username,
      apiKey: process.env.TAPESTRY_API_KEY || '',
    })
    return response as any
  } catch (error: any) {
    if (error?.message?.includes('404') || error?.response?.status === 404) {
      return { profiles: [], page: 1, pageSize: 10 } as any
    }
    throw new Error(error.message || 'Failed get following list')
  }
}
