import { ConfessionForm } from '@/components/confession/confession-form'

export default function ConfessPage() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 relative">
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-error/5 to-transparent pointer-events-none -z-10" />

            <div className="max-w-2xl w-full text-center mb-10 relative">
                <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-48 h-48 bg-error/10 rounded-full blur-[80px] -z-10" />
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent mb-4 tracking-tight">
                    Unburden Your Bag
                </h1>
                <p className="text-zinc-400 text-lg font-medium">
                    Tell us about the token that died, the money you lost, and the lesson you (probably didn&apos;t) learn.
                </p>
            </div>

            <div className="w-full max-w-xl glass-card rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <ConfessionForm />
                </div>
            </div>
        </div>
    )
}
