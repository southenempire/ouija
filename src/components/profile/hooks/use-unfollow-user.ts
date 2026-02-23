'use client'

import { useState } from 'react'

interface UnfollowUserProps {
  followerUsername: string
  followeeUsername: string
}

export const useUnfollowUser = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const unfollowUser = async ({
    followerUsername,
    followeeUsername,
  }: UnfollowUserProps) => {
    setLoading(true)
    setError(null)
    setData(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/followers/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerUser: { username: followerUsername },
          followeeUser: { username: followeeUsername },
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to follow user')
      }

      setData(result)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return { unfollowUser, loading, error, success, data }
}
