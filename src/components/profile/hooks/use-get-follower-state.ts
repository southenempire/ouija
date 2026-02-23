'use client'

import { IGetFollowersStateResponse } from '@/models/profile.models'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  followeeUsername: string
  followerUsername: string
}

export const useGetFollowersState = ({
  followeeUsername,
  followerUsername,
}: Props) => {
  const [data, setData] = useState<IGetFollowersStateResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFollowersState = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/followers/state?startId=${followerUsername}&endId=${followeeUsername}`,
        {
          method: 'GET',
        },
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch followers state')
      }

      setData(result)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [followeeUsername, followerUsername])

  useEffect(() => {
    if (followeeUsername && followerUsername) {
      fetchFollowersState()
    }
  }, [fetchFollowersState, followeeUsername, followerUsername])

  return { data, loading, error, refetch: fetchFollowersState }
}
