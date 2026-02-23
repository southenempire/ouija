'use client'

import { IIdentitiesResponse } from '@/models/profile.models'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  walletAddress: string
}

export const useGetIdentities = ({ walletAddress }: Props) => {
  const [data, setData] = useState<IIdentitiesResponse>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIdentities = useCallback(async () => {
    if (!walletAddress) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/identities?walletAddress=${walletAddress}`,
        {
          method: 'GET',
        },
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch identities')
      }

      setData(result)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    fetchIdentities()
  }, [fetchIdentities])

  return {
    data,
    loading,
    error,
    refetch: fetchIdentities,
  }
}
