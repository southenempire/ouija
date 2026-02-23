'use client'

import { useState } from 'react'
import { Button } from '@/components/common/button'
import { Card } from '@/components/common/card'
import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { Wallet, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Token {
    id: string
    symbol: string
    balance: number
    decimals: number
    name: string
    image: string | null
}

interface Props {
    onSelect: (token: Token) => void
}

export function TokenVerification({ onSelect }: Props) {
    const { walletAddress } = useCurrentWallet()
    const [tokens, setTokens] = useState<Token[]>([])
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)

    const verifyWallet = async () => {
        if (!walletAddress) {
            toast.error('Connect wallet first')
            return
        }

        setLoading(true)
        setHasSearched(true)

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress })
            })

            if (!res.ok) throw new Error('Failed to verify tokens')

            const data = await res.json()
            setTokens(data.tokens || [])
        } catch (e: any) {
            toast.error(e.message || 'Error scanning wallet')
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = (token: Token) => {
        setSelectedTokenId(token.id)
        onSelect(token)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold flex items-center gap-2">
                        <Wallet size={18} className="text-accent" /> Prove Your Bags
                    </h4>
                    <p className="text-sm text-gray">Scan your wallet for dead tokens to attach to your confession.</p>
                </div>

                <Button
                    type="button"
                    onClick={verifyWallet}
                    disabled={loading || !walletAddress}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-white"
                >
                    {loading ? 'Scanning...' : 'Scan Wallet'}
                </Button>
            </div>

            {hasSearched && !loading && tokens.length === 0 && (
                <Card className="p-4 bg-muted border-muted-light text-center">
                    <AlertCircle className="mx-auto text-gray mb-2 w-8 h-8 opacity-50" />
                    <p className="text-sm text-gray">No tokens found in this wallet.</p>
                </Card>
            )}

            {tokens.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {tokens.map((token) => (
                        <Card
                            key={token.id}
                            onClick={() => handleSelect(token)}
                            className={`p-3 cursor-pointer transition-all flex items-center justify-between group ${selectedTokenId === token.id
                                ? 'border-accent bg-accent/10 ring-1 ring-accent'
                                : 'border-muted-light bg-background hover:border-gray'
                                }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                {token.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={token.image} alt={token.symbol} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-muted-light flex items-center justify-center text-xs font-bold border border-muted">
                                        {token.symbol.substring(0, 2)}
                                    </div>
                                )}
                                <div className="overflow-hidden">
                                    <div className="font-bold truncate text-sm">{token.symbol}</div>
                                    <div className="text-xs text-gray truncate">{token.name}</div>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <div className="text-sm font-medium">
                                    {((token.balance || 0) / Math.pow(10, token.decimals || 0)).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                </div>
                                {selectedTokenId === token.id && (
                                    <CheckCircle2 size={14} className="text-accent ml-auto mt-1" />
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
