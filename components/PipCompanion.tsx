'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'

export type PipMood = 'idle' | 'happy' | 'eating' | 'speaking' | 'sleeping' | 'excited'

export interface PipCompanionProps {
  childName?: string
  isPaused?: boolean
  seeds?: number
  onFeed?: () => void
  reducedMotion?: boolean
  onSpeakReady?: (speak: (text: string) => void) => void
}

type WindowWithAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

const SEED_EMOJIS = ['🌱', '🌰', '🌾', '🌽']

export default function PipCompanion({
  childName = 'Explorer',
  isPaused = false,
  seeds = 5,
  onFeed,
  reducedMotion = false,
  onSpeakReady,
}: PipCompanionProps) {
  const [mounted, setMounted] = useState(false)
  const [mood, setMood] = useState<PipMood>('idle')
  const [speechBubble, setSpeechBubble] = useState<string | null>(null)
  const [seedCount, setSeedCount] = useState<number>(seeds)
  const [activeSeeds, setActiveSeeds] = useState<
    Array<{ id: number; emoji: string; leftPercent: number }>
  >([])
  const [isSnoozed, setIsSnoozed] = useState<boolean>(false)
  const [snoozeLeft, setSnoozeLeft] = useState<number>(0)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const speechTimerRef = useRef<NodeJS.Timeout | null>(null)
  const moodTimerRef = useRef<NodeJS.Timeout | null>(null)
  const snoozeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isSleepingRef = useRef<boolean>(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const storedPosition = localStorage.getItem('onesimos_pip_pos')
      if (storedPosition) {
        try {
          setPosition(JSON.parse(storedPosition))
        } catch {
          setPosition({ x: window.innerWidth - 140, y: window.innerHeight - 200 })
        }
      } else {
        setPosition({ x: window.innerWidth - 140, y: window.innerHeight - 200 })
      }
    }
  }, [])

  useEffect(() => {
    setSeedCount(seeds)
  }, [seeds])

  const chirp = useCallback((type: 'happy' | 'chirp' | 'feed' | 'snore' = 'chirp') => {
    if (typeof window === 'undefined') return
    try {
      const win = window as WindowWithAudio
      const AudioCtx = win.AudioContext || win.webkitAudioContext
      if (!AudioCtx) return
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        void ctx.resume()
      }

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'happy') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(600, now)
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
        osc.start(now)
        osc.stop(now + 0.15)
      } else if (type === 'feed') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(400, now)
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
        osc.start(now)
        osc.stop(now + 0.1)
      } else if (type === 'snore') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(180, now)
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.4)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.4)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(700, now)
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.08)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
        osc.start(now)
        osc.stop(now + 0.08)
      }
    } catch (e) {
      console.warn('Audio play error:', e)
    }
  }, [])

  const setMoodFor = useCallback((newMood: PipMood, durationMs = 2500) => {
    if (isSleepingRef.current && newMood !== 'sleeping') return
    setMood(newMood)
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
    if (durationMs > 0) {
      moodTimerRef.current = setTimeout(() => {
        if (!isSleepingRef.current) {
          setMood('idle')
        }
      }, durationMs)
    }
  }, [])

  const speak = useCallback(
    (text: string, durationMs = 3500) => {
      if (isSleepingRef.current) return
      setSpeechBubble(text)
      setMoodFor('speaking', durationMs)
      chirp('chirp')

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel()
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.pitch = 1.8
          utterance.rate = 1.2
          window.speechSynthesis.speak(utterance)
        } catch {
          // Web Speech API fallback silently ignored
        }
      }

      if (speechTimerRef.current) clearTimeout(speechTimerRef.current)
      speechTimerRef.current = setTimeout(() => {
        setSpeechBubble(null)
      }, durationMs)
    },
    [chirp, setMoodFor]
  )

  useEffect(() => {
    if (onSpeakReady) {
      onSpeakReady(speak)
    }
  }, [onSpeakReady, speak])

  const feedPip = useCallback(() => {
    if (isSleepingRef.current) return
    if (seedCount <= 0) {
      speak("No seeds left! Complete a story to get more! 🌟")
      return
    }
    setSeedCount((prev) => Math.max(0, prev - 1))
    if (onFeed) onFeed()

    const emoji = SEED_EMOJIS[Math.floor(Math.random() * SEED_EMOJIS.length)]
    const id = Date.now()
    const leftPercent = 20 + Math.random() * 60
    setActiveSeeds((prev) => [...prev, { id, emoji, leftPercent }])

    chirp('feed')
    setMoodFor('eating', 2200)
    setSpeechBubble('Yum! Seeds! 🌿')

    setTimeout(() => {
      setActiveSeeds((prev) => prev.filter((s) => s.id !== id))
    }, 1200)

    if (speechTimerRef.current) clearTimeout(speechTimerRef.current)
    speechTimerRef.current = setTimeout(() => {
      setSpeechBubble(null)
    }, 2200)
  }, [seedCount, onFeed, chirp, setMoodFor, speak])

  const toggleSnooze = useCallback(() => {
    if (isSnoozed) {
      setIsSnoozed(false)
      isSleepingRef.current = false
      setSnoozeLeft(0)
      if (snoozeIntervalRef.current) clearInterval(snoozeIntervalRef.current)
      setMood('idle')
      speak("I'm awake! Ready to read! ☀️")
    } else {
      setIsSnoozed(true)
      isSleepingRef.current = true
      setMood('sleeping')
      setSpeechBubble('Zzz... 20m break 💤')
      const targetTime = Date.now() + 20 * 60 * 1000
      setSnoozeLeft(20 * 60)
      chirp('snore')

      if (snoozeIntervalRef.current) clearInterval(snoozeIntervalRef.current)
      snoozeIntervalRef.current = setInterval(() => {
        const diff = Math.max(0, Math.round((targetTime - Date.now()) / 1000))
        setSnoozeLeft(diff)
        if (diff % 30 === 0 && diff > 0) {
          chirp('snore')
        }
        if (diff <= 0) {
          setIsSnoozed(false)
          isSleepingRef.current = false
          if (snoozeIntervalRef.current) clearInterval(snoozeIntervalRef.current)
          setMood('idle')
          speak("Good nap! Let's learn! 🌈")
        }
      }, 1000)
    }
  }, [isSnoozed, chirp, speak])

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      const newX = Math.max(10, Math.min(window.innerWidth - 120, e.clientX - dragOffset.x))
      const newY = Math.max(10, Math.min(window.innerHeight - 150, e.clientY - dragOffset.y))
      setPosition({ x: newX, y: newY })
    }

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false)
        if (position) {
          localStorage.setItem('onesimos_pip_pos', JSON.stringify(position))
        }
      }
    }

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, dragOffset, position])

  if (!mounted || isPaused) return null

  const posX = position?.x ?? 20
  const posY = position?.y ?? 300

  const node = (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${posX}px`,
        top: `${posY}px`,
        zIndex: 9999,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className="group select-none"
    >
      {/* Speech Bubble */}
      {speechBubble && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white px-3.5 py-1.5 font-achiko text-xs font-bold text-[#2D2418] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),0_10px_25px_rgba(100,90,160,0.2)] ring-2 ring-purple-100 animate-fade-up">
          {speechBubble}
          <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white ring-b-2 ring-r-2 ring-purple-100" />
        </div>
      )}

      {/* Falling Seed Animations */}
      {activeSeeds.map((seed) => (
        <span
          key={seed.id}
          style={{ left: `${seed.leftPercent}%` }}
          className="absolute top-0 text-xl animate-bounce"
        >
          {seed.emoji}
        </span>
      ))}

      {/* Clay Mascot Visual - PIP */}
      <div
        onClick={() => {
          if (!isDragging && !isSleepingRef.current) {
            chirp('happy')
            setMoodFor('happy', 1200)
          }
        }}
        className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-transform duration-300 ${
          reducedMotion ? '' : 'animate-pip-float'
        } ${mood === 'happy' ? 'scale-110 -translate-y-2' : ''}`}
      >
        {/* 3D Soft Radial Clay Ground Shadow */}
        <div className="absolute -bottom-2 h-4 w-16 rounded-full bg-purple-900/15 blur-sm pip-floating-shadow" />

        {/* Clay Parrot Mascot Graphic */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFD043] via-[#FFA000] to-[#E68A00] shadow-[inset_0_3px_6px_rgba(255,255,255,0.8),inset_-3px_-3px_8px_rgba(0,0,0,0.2),0_14px_28px_rgba(245,183,49,0.35)] ring-4 ring-white/90">
          {/* Crown Feather */}
          <div className="absolute -top-2 h-4 w-3 rounded-t-full bg-emerald-400 shadow-sm" />

          {/* Eyes */}
          <div className="absolute top-5 flex w-12 justify-between px-1">
            <div className="h-3.5 w-3.5 rounded-full bg-[#2D2418] shadow-inner">
              <div className="ml-0.5 mt-0.5 h-1.5 w-1.5 rounded-full bg-white" />
            </div>
            <div className="h-3.5 w-3.5 rounded-full bg-[#2D2418] shadow-inner">
              <div className="ml-0.5 mt-0.5 h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </div>

          {/* Beak */}
          <div className="absolute top-9 h-4 w-5 rounded-b-xl bg-orange-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]" />

          {/* Cheek Blush */}
          <div className="absolute top-8 flex w-16 justify-between px-0.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400/60 blur-[0.5px]" />
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400/60 blur-[0.5px]" />
          </div>

          {/* Expression overlay depending on mood */}
          {mood === 'sleeping' && (
            <span className="absolute -right-1 -top-2 text-base font-extrabold text-purple-600 animate-pulse">
              💤
            </span>
          )}
          {mood === 'happy' && (
            <span className="absolute -right-2 -top-2 text-base animate-bounce">⭐</span>
          )}
          {mood === 'eating' && (
            <span className="absolute -bottom-1 -right-1 text-sm">🌿</span>
          )}
        </div>
      </div>

      {/* Controls Overlay Bar (Seed Feed + Snooze) */}
      <div className="mt-1 flex items-center justify-center gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={feedPip}
          className="flex h-7 px-2.5 items-center justify-center gap-1 rounded-full bg-white font-switzer text-[10px] font-black text-[#2D2418] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.1)] transition hover:scale-105 active:scale-95"
          title="Feed Pip a seed"
        >
          <span>🌾</span>
          <span>{seedCount}</span>
        </button>

        <button
          type="button"
          onClick={toggleSnooze}
          className="flex h-7 px-2 items-center justify-center gap-1 rounded-full bg-white font-switzer text-[10px] font-black text-[#2D2418] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.1)] transition hover:scale-105 active:scale-95"
          title={isSnoozed ? 'Wake Pip up' : 'Snooze Pip for 20 mins'}
        >
          <span>{isSnoozed ? '⏰' : '💤'}</span>
          {isSnoozed && (
            <span>{Math.floor(snoozeLeft / 60)}m</span>
          )}
        </button>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
