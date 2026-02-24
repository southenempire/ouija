'use client'

import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { Button } from '@/components/common/button'
import Dialog from '@/components/common/dialog'
import { Input } from '@/components/form/input'
import { SubmitButton } from '@/components/form/submit-button'
import { useUpdateProfileInfo } from '@/components/profile/hooks/use-update-profile'
import { IProfileResponse } from '@/models/profile.models'
import { Pencil, Link as LinkIcon, Edit2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
    username: string
    data?: IProfileResponse
    refetch: () => void
}

export function EditProfileModal({ username, data, refetch }: Props) {
    const { mainUsername } = useCurrentWallet()
    const { updateProfile, loading } = useUpdateProfileInfo({ username })
    const [isOpen, setIsOpen] = useState(false)

    const [bio, setBio] = useState(data?.profile?.bio || '')
    const [image, setImage] = useState(data?.profile?.image || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateProfile({ bio, image })
        refetch()
        setIsOpen(false)
    }

    // Only show edit button if this is our profile
    if (mainUsername !== username) return null

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="secondary"
                className="gap-2 bg-card border-muted-light hover:border-accent hover:text-accent transition-colors"
            >
                <Edit2 size={16} /> Edit Profile
            </Button>

            <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="p-6 max-w-md w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Pencil className="text-accent" /> Edit Profile
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray">Bio / Description</label>
                            <Input
                                name="bio"
                                placeholder="Tell the graveyard your story..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={160}
                                className="bg-muted/50 border-muted-light w-full p-3 rounded-xl focus:border-accent text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray flex items-center gap-2">
                                <LinkIcon size={14} /> Avatar Image URL
                            </label>
                            <Input
                                name="image"
                                placeholder="https://..."
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="bg-muted/50 border-muted-light w-full p-3 rounded-xl focus:border-accent text-white"
                            />
                            <p className="text-xs text-gray">Must be a valid direct image link.</p>
                        </div>

                        <div className="pt-4 flex gap-3 w-full">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsOpen(false)}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <SubmitButton
                                isSubmitting={loading}
                                className="flex-1"
                                disabled={loading}
                            >
                                Save Changes
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    )
}
