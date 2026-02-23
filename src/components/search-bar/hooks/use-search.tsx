import { useState } from 'react'

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query) {
      setError('Query is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        body: new URLSearchParams({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return {
    searchResults,
    loading,
    error,
    search,
  }
}
