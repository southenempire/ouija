import { FollowList } from '@/components/profile/follow-list'
import { MyProfile } from '@/components/profile/my-profile'
import { getFollowers, getFollowing } from '@/lib/tapestry'

interface Props {
  username: string
}

export async function ProfileContent({ username }: Props) {
  const followers = await getFollowers({
    username,
  })

  const following = await getFollowing({
    username,
  })

  return (
    <div className="space-y-4">
      <MyProfile username={username} />
      <div className="flex w-full justify-between space-x-4">
        <FollowList followers={followers} following={following} />
      </div>
    </div>
  )
}
