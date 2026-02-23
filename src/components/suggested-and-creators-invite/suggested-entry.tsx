import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { abbreviateWalletAddress } from '@/components/common/tools'
import { FollowButton } from '@/components/profile/follow-button'
import { ISuggestedProfile } from '@/models/profile.models'

import { User } from 'lucide-react'
import Image from 'next/image'

interface Props {
  title: string
  data?: ISuggestedProfile[]
  type: 'follow' | 'suggestedGlobal'
}

export function SuggestedEntry({ title, data, type }: Props) {
  const { walletAddress, mainUsername } = useCurrentWallet()

  return (
    <div className="mb-6">
      <p className="mb-2 text-md">{title}</p>
      <div>
        {data && data.length > 0 ? (
          <ul className="overflow-auto max-h-[200px] space-y-3">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-secondary-foreground rounded-sm flex items-center px-2 py-3 justify-between"
              >
                <div className="flex items-center space-x-4">
                  {item?.profile?.image ? (
                    <Image
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      src={item?.profile?.image}
                      alt={item?.profile?.username || 'Profil'}
                    />
                  ) : (
                    <div className="bg-muted-foreground w-[40px] h-[40px] rounded-full flex items-center justify-center">
                      <User />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <p className="text-md truncate">
                      {item?.profile?.username}
                    </p>
                    {item?.wallet?.address && (
                      <p className="text-xs text-muted-foreground">
                        {abbreviateWalletAddress({
                          address: item?.wallet?.address,
                        })}
                      </p>
                    )}

                    {item.namespaces && item.namespaces.length > 0 && (
                      <ul className="mt-2 flex items-center space-x-2">
                        <p className="text-xs">your friend from:</p>
                        {item.namespaces.map((namespace) => (
                          <li key={namespace.name}>
                            <Image
                              src={namespace.faviconURL}
                              alt={`${namespace.readableName} logo`}
                              className="border border-white rounded-full aspect-square h-[18px] w-[18px]"
                              width={18}
                              height={18}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  {type === 'follow' && mainUsername && walletAddress && (
                    <FollowButton username={item.profile.username} />
                  )}
                  {/* {type === 'suggestedGlobal' && <Button disabled>invite</Button>} */}
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">no data</p>
        )}
      </div>
    </div>
  )
}
