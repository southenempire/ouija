import { IProfileList } from '@/models/profile.models'
import { useEffect, useState } from 'react'

interface Props {
  walletAddress: string
  shouldIncludeExternalProfiles?: boolean
}

export function useGetProfiles({
  walletAddress,
  shouldIncludeExternalProfiles,
}: Props) {
  const [profiles, setProfiles] = useState<IProfileList[]>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!walletAddress) return

    const fetchProfiles = async () => {
      setLoading(true)
      try {
        const url = new URL(`/api/profiles`, window.location.origin)
        url.searchParams.append('walletAddress', walletAddress)

        if (shouldIncludeExternalProfiles) {
          url.searchParams.append('includeExternal', 'true')
        }

        const res = await fetch(url.toString())
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch profiles')
        }
        const data = await res.json()
        setProfiles(data.profiles)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [walletAddress, shouldIncludeExternalProfiles])

  return { profiles, loading, error }
}
