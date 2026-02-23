'use client'

import { IProfileList } from '@/models/profile.models'
import { useCallback, useEffect, useState } from 'react'

export const useGetProfilesList = () => {
  const [data, setData] = useState<IProfileList[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profiles/all-profiles')

      const result = await response.json()
      setData(result.profiles)
    } catch (err: any) {
      setError(err.message || 'Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return { data, loading, error, refetch: fetchProfiles }
}
