'use client'

import { Button } from '@/components/common/button'
import { abbreviateWalletAddress } from '@/components/common/tools'
import { useLogin, usePrivy } from '@privy-io/react-auth'
import {
  Check,
  Clipboard,
  LogOut,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useCurrentWallet } from '../auth/hooks/use-current-wallet'
import { useGetProfiles } from '../auth/hooks/use-get-profiles'
import { CreateProfileContainer } from '../create-profile/create-profile-container'

export function Header() {
  const { walletAddress } = useCurrentWallet()
  const [mainUsername, setMainUsername] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`tapestry_profile_${walletAddress}`)
      if (cached) {
        try {
          return JSON.parse(cached).username
        } catch {
          return null
        }
      }
    }
    return null
  })

  // Check login states
  const [isProfileCreated, setIsProfileCreated] = useState<boolean>(false)
  const [profileUsername, setProfileUsername] = useState<string | null>(null)
  const { profiles, loading: profilesLoading } = useGetProfiles({
    walletAddress: walletAddress || '',
  })
  const { ready, authenticated, logout } = usePrivy()
  const { login } = useLogin()
  const disableLogin = !ready || (ready && authenticated)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        (dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        return
      }
      setIsDropdownOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setMainUsername(profiles[0].profile.username)
    }

    if (isProfileCreated && profileUsername) {
      setMainUsername(profileUsername)
      setIsProfileCreated(false)
      setProfileUsername(null)
    }
  }, [profiles, isProfileCreated, profileUsername])

  return (
    <>
      <div className="border-b border-muted bg-background/80 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-center w-full p-3">
        <div className="max-w-6xl w-full flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors overflow-hidden">
              <Image
                src="/logo.png"
                alt="Ouija Logo"
                width={48}
                height={48}
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-accent/20 blur-md rounded-xl -z-10 group-hover:bg-accent/40 transition-colors" />
            </div>
            <h1 className="text-2xl font-black tracking-widest text-white drop-shadow-md">
              OUIJA
            </h1>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/graveyard" className="hidden sm:inline-flex items-center justify-center h-10 px-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm">
              Graveyard
            </Link>
            {ready && authenticated ? (
              mainUsername ? (
                <div className="flex items-center relative" ref={dropdownRef}>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="space-x-2 border border-muted hover:border-accent transition-colors rounded-full px-4"
                    >
                      <User size={16} className="text-gray" />
                      <p className="truncate font-bold">{mainUsername}</p>
                    </Button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-muted border border-muted-light shadow-2xl rounded-md overflow-hidden z-50">
                        <div className="border-b border-muted-light">
                          <Button
                            variant="ghost"
                            className="px-4 py-2 hover:bg-muted-light w-full text-left justify-start"
                            onClick={() => handleCopy(walletAddress)}
                          >
                            {copied ? (
                              <Check size={16} className="mr-2 text-success" />
                            ) : (
                              <Clipboard size={16} className="mr-2 text-gray" />
                            )}
                            <span className="text-gray text-sm">
                              {abbreviateWalletAddress({
                                address: walletAddress,
                              })}
                            </span>
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            router.push(`/${mainUsername}`)
                            setIsDropdownOpen(false)
                          }}
                          className="px-4 py-2 hover:bg-muted-light w-full text-left justify-start"
                        >
                          <User size={16} className="mr-2 text-accent" /> Profile
                        </Button>

                        <Button
                          variant="ghost"
                          className="px-4 py-2 hover:bg-muted-light w-full text-left justify-start text-error"
                          onClick={logout}
                        >
                          <LogOut size={16} className="mr-2" /> Disconnect
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : profilesLoading ? (
                <div className="flex items-center justify-center h-10 px-6 rounded-full bg-muted/50 border border-muted-light animate-pulse">
                  <div className="w-20 h-4 bg-muted rounded"></div>
                </div>
              ) : (
                <CreateProfileContainer
                  setIsProfileCreated={setIsProfileCreated}
                  setProfileUsername={setProfileUsername}
                  profilesLoading={profilesLoading}
                />
              )
            ) : (
              <Button
                className="bg-accent hover:bg-accent-hover text-white rounded-full px-6 transition-transform hover:scale-105"
                disabled={disableLogin}
                onClick={() =>
                  login({
                    loginMethods: ['wallet'],
                    walletChainType: 'ethereum-and-solana',
                    disableSignup: false,
                  })
                }
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
