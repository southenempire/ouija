import { Suspense } from 'react'
import { Feed } from '@/components/graveyard/feed'
import { Leaderboard } from '@/components/graveyard/leaderboard/leaderboard'
import { Skull } from 'lucide-react'

export default function GraveyardPage() {
    return (
        <div className="flex flex-col items-center py-12 px-4 w-full relative">

            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none -z-10" />

            <div className="max-w-3xl w-full text-center mb-16 relative">
                <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-32 h-32 bg-accent/20 rounded-full blur-[60px] -z-10" />
                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-br from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent mb-6 tracking-tighter">
                    The Graveyard
                </h1>
                <p className="text-zinc-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
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
