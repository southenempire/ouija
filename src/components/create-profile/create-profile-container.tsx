'use client'

import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import Dialog from '@/components/common/dialog'
import { CreateProfile } from '@/components/profile/create-profile'
import { useEffect, useState } from 'react'

interface CreateProfileContainerProps {
  setIsProfileCreated: (val: boolean) => void
  setProfileUsername: (val: string) => void
  profilesLoading: boolean
}

export function CreateProfileContainer({
  setIsProfileCreated,
  setProfileUsername,
  profilesLoading,
}: CreateProfileContainerProps) {
  const [createProfileDialog, setCreateProfileDialog] = useState(false)

  const { walletAddress, mainUsername, loadingMainUsername } =
    useCurrentWallet()

  useEffect(() => {
    // Before we forcefully pop open the dialog, ensure that:
    // 1. The wallet is connected
    // 2. We don't have a mainUsername
    // 3. We are done checking Tapestry
    // 4. We double check local storage to ensure the profile isn't just taking a second to propagate
    if (walletAddress && !mainUsername && !loadingMainUsername && !profilesLoading) {
      const cached = localStorage.getItem(`tapestry_profile_${walletAddress}`)
      if (!cached) {
        setCreateProfileDialog(true)
      }
    }
  }, [walletAddress, mainUsername, loadingMainUsername, profilesLoading])

  return (
    <Dialog isOpen={createProfileDialog} setIsOpen={setCreateProfileDialog}>
      <CreateProfile setCreateProfileDialog={setCreateProfileDialog} setIsProfileCreated={setIsProfileCreated} setProfileUsername={setProfileUsername} />
    </Dialog>
  )
}
