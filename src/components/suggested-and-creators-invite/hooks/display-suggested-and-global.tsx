'use client'

import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { Card } from '@/components/common/card'
import { useSuggested } from '@/components/suggested-and-creators-invite/hooks/use-suggested'
import { useSuggestedGlobal } from '@/components/suggested-and-creators-invite/hooks/use-suggested-global'
import { SuggestedEntry } from '@/components/suggested-and-creators-invite/suggested-entry'
import { useEffect } from 'react'

export function DisplaySuggestedAndGlobal({ username }: { username: string }) {
  const { walletAddress, mainUsername } = useCurrentWallet()
  const { profiles: suggestedProfiles, getSuggested } = useSuggested()
  const { profiles: suggestedGlobalProfiles, getSuggestedGlobal } =
    useSuggestedGlobal()

  useEffect(() => {
    if (walletAddress) {
      getSuggested(walletAddress)
      getSuggestedGlobal(walletAddress)
    }
  }, [walletAddress, getSuggested, getSuggestedGlobal])

  if (mainUsername !== username) {
    return null
  }

  return (
    <div className="w-1/2">
      <Card className="min-h-[600px] flex flex-col justify-between">
        <SuggestedEntry
          title="Suggested friends"
          data={suggestedProfiles}
          type="follow"
        />

        <SuggestedEntry
          title="Suggested global profiles"
          data={suggestedGlobalProfiles}
          type="suggestedGlobal"
        />
      </Card>
    </div>
  )
}
