import { ConfessionForm } from '@/components/confession/confession-form'

export default function ConfessPage() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-gray bg-clip-text text-transparent mb-4">
                    Unburden Your Bag
                </h1>
                <p className="text-gray">
                    Tell us about the token that died, the money you lost, and the lesson you (probably didn't) learn.
                </p>
            </div>

            <div className="w-full max-w-xl bg-muted border border-muted-light rounded-2xl p-6 shadow-2xl">
                <ConfessionForm />
            </div>
        </div>
    )
}
