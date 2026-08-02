'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Heart, ExternalLink, Loader2, X, Skull, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/common/button'
import { Input } from '@/components/ui/form/input'
import { toast } from 'sonner'
import { useSolanaWallets, usePrivy } from '@privy-io/react-auth'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { abbreviateWalletAddress } from '@/components/common/tools'

interface TipModalProps {
    isOpen: boolean
    onClose: () => void
    authorUsername: string
    authorAddress: string
    confessionId: string
}

const PRESET_AMOUNTS = [0.01, 0.05, 0.1, 0.25]

export function TipModal({ isOpen, onClose, authorUsername, authorAddress, confessionId }: TipModalProps) {
    const [amount, setAmount] = useState<string>('0.05')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [txHash, setTxHash] = useState<string | null>(null)
    const { wallets } = useSolanaWallets()
    const { authenticated, login } = usePrivy()

    if (!isOpen) return null

    const handleTip = async () => {
        if (!authenticated) {
            toast.error('Please connect your wallet first')
            login({ loginMethods: ['wallet'] })
            return
        }

        const solAmount = parseFloat(amount)
        if (isNaN(solAmount) || solAmount <= 0) {
            toast.error('Please enter a valid SOL amount')
            return
        }

        if (!authorAddress || authorAddress === 'Unknown' || authorAddress.length < 32) {
            toast.error('Invalid author wallet address for tipping')
            return
        }

        let recipientPubkey: PublicKey
        try {
            recipientPubkey = new PublicKey(authorAddress)
        } catch {
            toast.error('Author address is not a valid Solana wallet address')
            return
        }

        setIsSubmitting(true)
        setTxHash(null)

        try {
            const wallet = wallets?.[0] || (window as any).solana

            if (!wallet) {
                throw new Error('No Solana wallet detected. Please connect Phantom, Solflare, or Privy wallet.')
            }

            const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com'
            const connection = new Connection(rpcUrl, 'confirmed')

            const senderAddress = wallet.address || wallet.publicKey?.toString()
            if (!senderAddress) {
                throw new Error('Wallet address not available')
            }

            const senderPubkey = new PublicKey(senderAddress)
            const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL)

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: senderPubkey,
                    toPubkey: recipientPubkey,
                    lamports,
                })
            )

            const { blockhash } = await connection.getLatestBlockhash()
            transaction.recentBlockhash = blockhash
            transaction.feePayer = senderPubkey

            let signature: string
            if (wallet.sendTransaction) {
                signature = await wallet.sendTransaction(transaction, connection)
            } else if (wallet.signAndSendTransaction) {
                const res = await wallet.signAndSendTransaction(transaction)
                signature = res.signature || res
            } else {
                throw new Error('Wallet provider does not support sending transactions')
            }

            setTxHash(signature)
            toast.success(`Tipped ${solAmount} SOL to @${authorUsername}! 💸`, { icon: '🕯️' })

            // Notify backend of tip event (non-blocking)
            fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipient_id: authorAddress,
                    actor_id: senderAddress,
                    actor_username: 'Anonymous Degen',
                    type: 'TIP',
                    reference_id: confessionId,
                })
            }).catch(() => { })

        } catch (error: any) {
            console.error('Tipping transaction failed:', error)
            toast.error(error.message || 'Failed to send tip transaction')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                                <Coins size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg flex items-center gap-1.5">
                                    Sympathy Tip <Heart size={16} className="text-error fill-error" />
                                </h3>
                                <p className="text-xs text-zinc-400">
                                    Send SOL to <span className="text-accent font-semibold">@{authorUsername}</span> ({abbreviateWalletAddress({ address: authorAddress })})
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {txHash ? (
                        <div className="py-8 text-center space-y-4 relative z-10">
                            <CheckCircle2 className="w-16 h-16 text-success mx-auto animate-bounce" />
                            <h4 className="text-xl font-black text-white">Respects & SOL Delivered!</h4>
                            <p className="text-sm text-zinc-400">
                                Your tip of <span className="text-success font-bold">{amount} SOL</span> was successfully sent on Solana.
                            </p>
                            <div className="pt-2 flex justify-center gap-3">
                                <a
                                    href={`https://explorer.solana.com/tx/${txHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-accent rounded-xl border border-accent/20 transition-colors"
                                >
                                    View Tx on Solana Explorer <ExternalLink size={14} />
                                </a>
                                <Button variant="secondary" onClick={onClose} className="text-xs">
                                    Done
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    Select Tip Amount (SOL)
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {PRESET_AMOUNTS.map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setAmount(val.toString())}
                                            className={`py-2 rounded-xl text-sm font-bold border transition-all ${amount === val.toString()
                                                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105'
                                                    : 'bg-zinc-900 border-white/5 text-zinc-300 hover:border-accent/40'
                                                }`}
                                        >
                                            {val} SOL
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    Custom Amount
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.001"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.05"
                                        className="bg-zinc-900 border-white/10 pr-16 font-bold text-white"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                                        SOL
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handleTip}
                                disabled={isSubmitting}
                                className="w-full bg-accent hover:bg-accent-hover text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Confirming Transaction...
                                    </>
                                ) : (
                                    <>
                                        Send {amount} SOL Tip <Coins size={18} />
                                    </>
                                )}
                            </Button>

                            <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
                                <Skull size={12} /> Direct peer-to-peer on Solana mainnet. 100% goes to author.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
