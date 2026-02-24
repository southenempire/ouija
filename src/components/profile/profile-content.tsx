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
    <div className="w-full max-w-6xl mx-auto md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Profile details and Confessions */}
        <div className="w-full md:w-2/3 space-y-6">
          <MyProfile username={username} />
        </div>

        {/* Right Column: Follow List */}
        <div className="w-full md:w-1/3 space-y-6">
          <FollowList followers={followers} following={following} />
        </div>
      </div>
    </div>
  )
}
