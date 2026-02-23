'use client'

import { ICommentsResponse } from '@/models/comment.models'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  targetProfileId: string
  requestingProfileId?: string
}

export const useGetComments = ({
  targetProfileId,
  requestingProfileId,
}: Props) => {
  const [data, setData] = useState<ICommentsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let url = `/api/comments?targetProfileId=${targetProfileId}`
      if (requestingProfileId) {
        url += `&requestingProfileId=${requestingProfileId}`
      }

      const response = await fetch(url, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch comments')
      }

      setData(result)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [targetProfileId, requestingProfileId])

  useEffect(() => {
    if (targetProfileId) {
      fetchComments()
    }
  }, [fetchComments, targetProfileId])

  return { data, loading, error, refetch: fetchComments }
}
