'use client'

import { useCallback, useRef } from 'react'

export function useSfx() {
    const audioCtxRef = useRef<AudioContext | null>(null)

    const getCtx = () => {
        if (typeof window === 'undefined') return null
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext
            if (AudioContext) {
                audioCtxRef.current = new AudioContext()
            }
        }
        if (audioCtxRef.current?.state === 'suspended') {
            audioCtxRef.current.resume()
        }
        return audioCtxRef.current
    }

    const playPressF = useCallback(() => {
        try {
            const ctx = getCtx()
            if (!ctx) return

            // Spooky 8-bit low bell/coin sound
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'square'
            osc.frequency.setValueAtTime(220, ctx.currentTime) // A3
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3) // Drops down an octave

            gain.gain.setValueAtTime(0.1, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start()
            osc.stop(ctx.currentTime + 0.3)
        } catch (e) {
            console.error("Audio playback failed", e)
        }
    }, [])

    const playConfess = useCallback(() => {
        try {
            const ctx = getCtx()
            if (!ctx) return

            // Gruesome 8-bit thunder/impact sound
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'sawtooth'
            osc.frequency.setValueAtTime(80, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.8)

            // Use noise to make it gritty
            const noise = ctx.createBufferSource();
            const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            noise.buffer = buffer;
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)

            osc.connect(gain)
            noise.connect(noiseGain)
            gain.connect(ctx.destination)
            noiseGain.connect(ctx.destination)

            osc.start()
            noise.start()
            osc.stop(ctx.currentTime + 0.8)
            noise.stop(ctx.currentTime + 0.8)
        } catch (e) {
            console.error("Audio playback failed", e)
        }
    }, [])

    return { playPressF, playConfess }
}
