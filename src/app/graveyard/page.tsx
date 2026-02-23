import { Suspense } from 'react'
import { Feed } from '@/components/graveyard/feed'
import { Leaderboard } from '@/components/graveyard/leaderboard/leaderboard'
import { Skull } from 'lucide-react'

export default function GraveyardPage() {
    return (
        <div className="flex flex-col items-center py-12 px-4 w-full">
            <div className="max-w-2xl w-full text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-gray bg-clip-text text-transparent mb-4">
                    The Graveyard
                </h1>
                <p className="text-gray text-lg">
                    Here lies the fallen capital. May their souls rest in peace, and their bags never be mentioned again.
                </p>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                    <Suspense fallback={
                        <div className="flex justify-center p-12">
                            <Skull className="animate-pulse text-accent w-12 h-12" />
                        </div>
                    }>
                        <Feed />
                    </Suspense>
                </div>

                <div className="md:col-span-1 sticky top-24">
                    <Leaderboard />
                </div>
            </div>
        </div>
    )
}
