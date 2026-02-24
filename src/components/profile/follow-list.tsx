'use client'

import { Card } from '@/components/common/card'
import { IGetSocialResponse } from '@/models/profile.models'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus } from 'lucide-react'

interface Props {
  following: IGetSocialResponse
  followers: IGetSocialResponse
}

export function FollowList({ following, followers }: Props) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers')

  const currentList = activeTab === 'followers' ? followers : following

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-0 overflow-hidden bg-card/80 backdrop-blur-sm border-muted-light h-full min-h-[400px] flex flex-col">
        {/* Tabs Header */}
        <div className="flex w-full border-b border-muted-light/50 bg-muted/20">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'followers' ? 'text-accent' : 'text-gray hover:text-foreground'
              }`}
          >
            <Users size={16} />
            Followers
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs text-foreground">
              {followers?.profiles.length || 0}
            </span>
            {activeTab === 'followers' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'following' ? 'text-accent' : 'text-gray hover:text-foreground'
              }`}
          >
            <UserPlus size={16} />
            Following
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs text-foreground">
              {following?.profiles.length || 0}
            </span>
            {activeTab === 'following' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-muted-light">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {currentList?.profiles.length === 0 ? (
                <div className="text-center text-gray py-8 text-sm">
                  No {activeTab} yet.
                </div>
              ) : (
                currentList?.profiles.map((item, index) => (
                  <ListEntry key={index} username={item.username} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}

function ListEntry({ username }: { username: string }) {
  return (
    <Link
      href={`/${username}`}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm">
          {username.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-sm group-hover:text-accent transition-colors">
          @{username}
        </span>
      </div>
    </Link>
  )
}
