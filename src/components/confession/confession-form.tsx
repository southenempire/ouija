'use client'

import { useState } from 'react'
import { Button } from '@/components/common/button'
import { Input } from '@/components/ui/form/input'
import { usePrivy } from '@privy-io/react-auth'
import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { useGetProfiles } from '@/components/auth/hooks/use-get-profiles'
import { Skull, AlertTriangle, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function ConfessionForm() {
    const { ready, authenticated, login } = usePrivy()
    const { walletAddress } = useCurrentWallet()
    const { profiles, loading: profilesLoading } = useGetProfiles({
        walletAddress: walletAddress || '',
    })
    const router = useRouter()

    const [token, setToken] = useState('')
    const [lossAmount, setLossAmount] = useState('')
    const [story, setStory] = useState('')
    const [mood, setMood] = useState('😭')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Derived state
    const hasProfile = profiles && profiles.length > 0
    const profileId = hasProfile ? profiles[0].profile?.id : null

    const disableLogin = !ready || (ready && authenticated)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!profileId) {
            toast.error('You need a profile to confess')
            return
        }

        if (!token || !lossAmount || !story) {
            toast.error('Please fill out all fields')
            return
        }

        setIsSubmitting(true)

        try {
            // Format: [MOOD] I lost [AMOUNT] on [TOKEN]. [STORY]
            const confessionText = `${mood} | Lost ${lossAmount} on ${token} | ${story}`

            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profileId,
                    targetProfileId: profileId, // Posting to our own profile
                    text: confessionText
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to post confession')
            }

            toast.success('Your confession has been immortalized onchain.', {
                icon: '🪦'
            })

            router.push('/graveyard')
        } catch (error: any) {
            toast.error(error.message || 'Failed to confess')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Render logic based on state
    let content

    if (ready && authenticated && profilesLoading) {
        content = (
            <div className="flex justify-center p-8">
                <div className="animate-spin text-accent">
                    <Skull size={32} />
                </div>
            </div>
        )
    } else if (!authenticated) {
        content = (
            <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">You must connect your wallet to confess.</h3>
                <Button
                    className="bg-accent hover:bg-accent-hover text-white rounded-full px-8 h-12"
                    disabled={disableLogin}
                    onClick={() =>
                        login({
                            loginMethods: ['wallet'],
                            walletChainType: 'ethereum-and-solana',
                        })
                    }
                >
                    Connect Wallet
                </Button>
            </div>
        )
    } else if (authenticated && !hasProfile) {
        content = (
            <div className="text-center py-10 flex flex-col items-center">
                <Skull className="w-16 h-16 text-zinc-600 mb-6 drop-shadow-md" />
                <h3 className="text-2xl font-black text-white mb-2">Anonymous Ghosts Cannot Speak</h3>
                <p className="text-zinc-400 max-w-sm mb-6 leading-relaxed">
                    You must create a Tapestry profile before you can immortalize your dead bags onchain.
                </p>
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-accent font-medium">
                    Please use the <strong>Profile</strong> button in the top right header to create your identity.
                </div>
            </div>
        )
    } else {
        content = (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Dead Token Ticker</label>
                        <Input
                            required
                            placeholder="e.g. LUNA, FTT, SAFE..."
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="bg-background border-muted hover:border-accent focus:border-accent"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Amount Lost</label>
                        <Input
                            required
                            placeholder="e.g. $50,000 or 100 SOL"
                            value={lossAmount}
                            onChange={(e) => setLossAmount(e.target.value)}
                            className="bg-background border-muted hover:border-accent focus:border-accent"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">The Story</label>
                    <textarea
                        required
                        placeholder="I thought it was going to the moon. I remortgaged my house..."
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        className="w-full h-32 px-3 py-2 text-sm bg-background border border-muted rounded-md text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mood</label>
                    <div className="flex gap-2">
                        {['😭', '💀', '🤡', '💸', '🗑️', '📉'].map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => setMood(emoji)}
                                className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${mood === emoji
                                    ? 'bg-accent scale-110 shadow-lg shadow-accent/20'
                                    : 'bg-background hover:bg-muted-light'
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent-hover text-white font-bold h-14 rounded-xl mt-8 transition-transform transform active:scale-95 flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <Skull className="animate-spin" size={20} /> Carving Tombstone...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Submit Confession <Send size={20} />
                        </span>
                    )}
                </Button>
            </form>
        )
    }

    return (
        <div className="w-full">
            {content}
        </div>
    )
}
