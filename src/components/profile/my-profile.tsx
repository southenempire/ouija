'use client'

import { Card } from '@/components/common/card'
import { CopyPaste } from '@/components/common/copy-paste'
import { useGetProfileInfo } from '@/components/profile/hooks/use-get-profile-info'
import { UserConfessions } from './user-confessions/user-confessions'
import { EditProfileModal } from './edit-profile-modal'
import { User, Users, Link as LinkIcon, Quote } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Props {
  username: string
}

export function MyProfile({ username }: Props) {
  const { data, refetch } = useGetProfileInfo({ username })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden p-0 border-muted-light bg-card/80 backdrop-blur-sm">
        {/* Banner Area */}
        <div className="h-32 bg-gradient-to-r from-accent/20 via-background to-accent/10 border-b border-muted-light/50 relative">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="px-6 pb-6 relative">
          {/* Avatar overhanging the banner */}
          <div className="relative -mt-16 mb-4 flex justify-between items-end">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-card bg-muted flex items-center justify-center shadow-xl">
              {data?.profile?.image ? (
                <Image
                  src={data.profile.image}
                  fill
                  alt="avatar"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <User className="w-12 h-12 text-gray" />
              )}
            </div>

            {/* Actions / Edit Profile Button Area */}
            <div className="mb-2">
              <EditProfileModal username={username} data={data as any} refetch={refetch} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="font-black text-2xl tracking-wide">{username}</h2>
              {data?.walletAddress && (
                <div className="flex items-center space-x-2 text-gray mt-1 text-sm bg-muted/50 w-fit px-3 py-1 rounded-full border border-muted-light/50">
                  <span className="truncate max-w-[150px] sm:max-w-xs block">
                    {data.walletAddress}
                  </span>
                  <CopyPaste content={data.walletAddress} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-accent" />
                <span className="text-foreground font-semibold">
                  {data?.socialCounts.followers || 0}
                </span>{' '}
                followers
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-accent" />
                <span className="text-foreground font-semibold">
                  {data?.socialCounts.following || 0}
                </span>{' '}
                following
              </div>
            </div>

            <div className="pt-4 border-t border-muted-light/50">
              <div className="flex items-start gap-3 mt-4 text-gray">
                <Quote size={20} className="text-accent/50 shrink-0 mt-1" />
                <p className="leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {data?.profile?.bio ? data.profile.bio : 'No epitaph written.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Confessions Section below Profile Header */}
      {data?.profile?.id && (
        <UserConfessions profileId={data.profile.id} />
      )}
    </motion.div>
  )
}
