'use client'

import { LoadCircle } from '@/components/common/load-circle'
import { useGetProfilesList } from '@/components/profile/hooks/use-get-profiles-list'
import { Profile } from '@/components/profile/profile'

export function ProfilesList() {
  const { data: profiles, loading } = useGetProfilesList()

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <LoadCircle />
      </div>
    )
  }

  return (
    <div>
      {profiles?.map((elem, index) => {
        return (
          <div className="mb-4" key={elem.profile.username + index.toString()}>
            <Profile username={elem.profile.username} />
          </div>
        )
      })}
    </div>
  )
}
