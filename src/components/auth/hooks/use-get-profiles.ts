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

        const res = await fetch(url.toString(), { cache: 'no-store' })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch profiles')
        }
        const data = await res.json()

        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles)
          // Refresh cache with the absolute latest real data
          localStorage.setItem(`tapestry_profile_${walletAddress}`, JSON.stringify(data.profiles[0].profile))
        } else {
          // Tapestry indexer is extremely slow (can take minutes). If their profile is empty according to 
          // the API, but we know they just created one locally, we must optimistic-load the local one.
          const cached = localStorage.getItem(`tapestry_profile_${walletAddress}`)
          if (cached) {
            try {
              const parsed = JSON.parse(cached)
              setProfiles([{ profile: parsed, socialCounts: { followers: 0, following: 0 }, walletAddress: walletAddress as string } as any])
              return // Return early if we found cache
            } catch {
              // fall through to empty
            }
          }

          // If no cache and no local namespace profiles, double check the global identity indexer.
          // Sometimes `profilesList` lags behind `identitiesDetail`.
          try {
            const idRes = await fetch(`/api/identities?walletAddress=${walletAddress}`)
            if (idRes.ok) {
              const idData = await idRes.json()
              // find our namespace profile
              if (idData?.identities) {
                for (const identity of idData.identities) {
                  const matchingProfile = identity.profiles?.find((p: any) => p.namespace?.name === 'ouija' || p.namespace?.name === 'tapestry-template')
                  if (matchingProfile) {
                    setProfiles([matchingProfile])
                    localStorage.setItem(`tapestry_profile_${walletAddress}`, JSON.stringify(matchingProfile.profile))
                    return // Return early since we found it globally
                  }
                }
              }
            }
          } catch {
            // ignore fallback error
          }

          setProfiles([]) // Finally give up
        }
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()

    const handleProfileUpdate = () => {
      fetchProfiles()
    }
    window.addEventListener('profile-updated', handleProfileUpdate)

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate)
    }
  }, [walletAddress, shouldIncludeExternalProfiles])

  return { profiles, loading, error }
}
