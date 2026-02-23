'use client'

import { IProfileResponse } from '@/models/profile.models'
import { useCallback, useEffect, useState } from 'react'

export const useGetProfileInfo = ({ username }: { username: string }) => {
  const [data, setData] = useState<IProfileResponse>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!username) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/profiles/info?username=${username}`, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch profile')
      }

      setData(result)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { data, loading, error, refetch: fetchProfile }
}
