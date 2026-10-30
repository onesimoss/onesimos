'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'

type PipMood = 'idle' | 'happy' | 'eating' | 'speaking' | 'sleeping' | 'excited'

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

const SEED_EMOJIS = ['🌱', '🥜', '🍒', '🫐'] as const
const HEART_EMOJI = '💖'
const SNOOZE_MS = 20 * 60 * 1000
const CHIRP_MIN_GAP_MS = 4000
const CHIRP_MAX_GAP_MS = 12000

function preferHighVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const englishVoices = voices.filter((voice) => /en(-(US|GB|NG|AU))?/i.test(voice.lang))
  const preferred =
    englishVoices.find((voice) =>
      /female|samantha|victoria|karen|moira|tessa|zira|google us english/i.test(voice.name)
    ) ??
    englishVoices.find((voice) => /en-US/i.test(voice.lang)) ??
    englishVoices[0]

  return preferred ?? voices[0] ?? null
}

function playChirp(ctx: AudioContext, master: GainNode) {
  const now = ctx.currentTime

  const notes = [
    { frequency: 3200, offset: 0, duration: 0.045 },
    { frequency: 3800, offset: 0.05, duration: 0.04 },
    { frequency: 2900, offset: 0.1, duration: 0.055 },
    { frequency: 4100, offset: 0.16, duration: 0.035 },
  ]

  notes.forEach((note) => {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(note.frequency, now + note.offset)
    oscillator.frequency.exponentialRampToValueAtTime(note.frequency * 1.12, now + note.offset + note.duration * 0.5)
    oscillator.frequency.exponentialRampToValueAtTime(note.frequency * 0.85, now + note.offset + note.duration)

    filter.type = 'bandpass'
    filter.frequency.value = note.frequency
    filter.Q.value = 6

    gain.gain.setValueAtTime(0.0001, now + note.offset)
    gain.gain.exponentialRampToValueAtTime(0.18, now + note.offset + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.offset + note.duration)

    oscillator.connect(filter)
    filter.connect(gain)
    gain.connect(master)

    oscillator.start(now + note.offset)
    oscillator.stop(now + note.offset + note.duration + 0.02)
  })

  const bufferSize = Math.floor(ctx.sampleRate * 0.06)
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)

  for (let index = 0; index < bufferSize; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / bufferSize)
  }

  const noise = ctx.createBufferSource()
  const noiseFilter = ctx.createBiquadFilter()
  const noiseGain = ctx.createGain()

  noise.buffer = noiseBuffer
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.value = 2500

  noiseGain.gain.setValueAtTime(0.03, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(master)

  noise.start(now)
  noise.stop(now + 0.07)
}

function Clay3DMesh({ mood, isSleeping }: { mood: PipMood; isSleeping: boolean }) {
  const bodySquash = mood === 'eating' ? 0.92 : mood === 'excited' ? 1.08 : 1

  return (
    <group scale={[bodySquash, bodySquash, bodySquash]}>
      {/* Lights inside the 3D Canvas */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 8, 5]} intensity={1.4} color="#FFFFFF" />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#FFE8D6" />

      {/* Body */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial
          color="#B8E0D2"
          roughness={0.22}
          metalness={0.02}
          clearcoat={0.35}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Belly Patch */}
      <mesh position={[0, -0.25, 0.45]}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshPhysicalMaterial
          color="#FFE8D6"
          roughness={0.3}
          clearcoat={0.2}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.65, 0.05]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshPhysicalMaterial
          color="#B8E0D2"
          roughness={0.2}
          metalness={0.02}
          clearcoat={0.4}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Crest Feathers */}
      <mesh position={[-0.1, 1.3, 0]}>
        <coneGeometry args={[0.08, 0.35, 16]} />
        <meshPhysicalMaterial color="#CBBBEA" roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.38, 0.02]}>
        <coneGeometry args={[0.09, 0.42, 16]} />
        <meshPhysicalMaterial color="#F4A6A6" roughness={0.25} />
      </mesh>
      <mesh position={[0.1, 1.3, 0]}>
        <coneGeometry args={[0.08, 0.35, 16]} />
        <meshPhysicalMaterial color="#A8C5E8" roughness={0.25} />
      </mesh>

      {/* Eyes */}
      {!isSleeping ? (
        <>
          {/* Left Eye Base */}
          <mesh position={[-0.24, 0.72, 0.52]}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshPhysicalMaterial color="#FDF6F0" roughness={0.1} />
          </mesh>
          {/* Left Pupil */}
          <mesh position={[-0.22, 0.72, 0.62]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshPhysicalMaterial color="#3D3D5C" roughness={0.1} />
          </mesh>

          {/* Right Eye Base */}
          <mesh position={[0.24, 0.72, 0.52]}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshPhysicalMaterial color="#FDF6F0" roughness={0.1} />
          </mesh>
          {/* Right Pupil */}
          <mesh position={[0.22, 0.72, 0.62]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshPhysicalMaterial color="#3D3D5C" roughness={0.1} />
          </mesh>
        </>
      ) : (
        <>
          {/* Sleeping Closed Eye Lines */}
          <mesh position={[-0.24, 0.72, 0.55]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.2, 0.03, 0.04]} />
            <meshBasicMaterial color="#3D3D5C" />
          </mesh>
          <mesh position={[0.24, 0.72, 0.55]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.2, 0.03, 0.04]} />
            <meshBasicMaterial color="#3D3D5C" />
          </mesh>
        </>
      )}

      {/* Beak */}
      <mesh position={[0, 0.52, 0.62]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.14, 0.28, 16]} />
        <meshPhysicalMaterial color="#F2A488" roughness={0.2} clearcoat={0.3} />
      </mesh>

      {/* Left Wing */}
      <mesh position={[-0.78, -0.1, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshPhysicalMaterial color="#A8C5E8" roughness={0.25} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[0.78, -0.1, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshPhysicalMaterial color="#A8C5E8" roughness={0.25} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.25, -1.0, 0.1]}>
        <boxGeometry args={[0.2, 0.08, 0.3]} />
        <meshPhysicalMaterial color="#F2A488" roughness={0.3} />
      </mesh>
      <mesh position={[0.25, -1.0, 0.1]}>
        <boxGeometry args={[0.2, 0.08, 0.3]} />
        <meshPhysicalMaterial color="#F2A488" roughness={0.3} />
      </mesh>
    </group>
  )
}

function ClaySeed({ x, y, emoji, onDone }: { x: number; y: number; emoji: string; onDone: () => void }) {
  return (
    <span
      className="pointer-events-none absolute z-[60] select-none"
      style={{
        left: x,
        top: y,
        fontSize: '1.65rem',
        filter: 'drop-shadow(0 6px 10px rgba(61, 61, 92, 0.18))',
        animation: 'pip-seed-pop 0.9s cubic-bezier(0.34, 1.45, 0.64, 1) forwards',
      }}
      onAnimationEnd={onDone}
      aria-hidden
    >
      {emoji}
    </span>
  )
}

function ClayHeart({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  return (
    <span
      className="pointer-events-none absolute z-[60] select-none"
      style={{
        left: x,
        top: y,
        fontSize: '1.5rem',
        filter: 'drop-shadow(0 6px 10px rgba(244, 166, 166, 0.35))',
        animation: 'pip-heart-float 1.1s ease-out forwards',
      }}
      onAnimationEnd={onDone}
      aria-hidden
    >
      {HEART_EMOJI}
    </span>
  )
}

export default function PipCompanion({
  childName,
  isPaused = false,
  onFeed: externalOnFeed,
  reducedMotion = false,
  onSpeakReady,
}: PipCompanionProps) {
  const [mounted, setMounted] = useState(false)
  const [mood, setMood] = useState<PipMood>('idle')
  const [isSleeping, setIsSleeping] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [bubbleText, setBubbleText] = useState('')
  const [seedList, setSeedList] = useState<{ id: number; x: number; y: number; emoji: string }[]>([])
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])
  const [pos, setPos] = useState({ x: 24, y: 24 })
  const [isDragging, setIsDragging] = useState(false)
  const [snoozeLeft, setSnoozeLeft] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const seedId = useRef(0)
  const heartId = useRef(0)
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chirpTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const snoozeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const snoozeTick = useRef<ReturnType<typeof setInterval> | null>(null)
  const wakeAt = useRef(0)
  const speakingLock = useRef(false)
  const isSleepingRef = useRef(false)
  const wakeRef = useRef<() => void>(() => undefined)

  const clearBubbleTimer = useCallback(() => {
    if (bubbleTimer.current) {
      clearTimeout(bubbleTimer.current)
      bubbleTimer.current = null
    }
  }, [])

  const hideBubbleAfter = useCallback(
    (ms: number) => {
      clearBubbleTimer()
      bubbleTimer.current = setTimeout(() => {
        setShowBubble(false)
        bubbleTimer.current = null
      }, ms)
    },
    [clearBubbleTimer]
  )

  const setMoodFor = useCallback((nextMood: PipMood, ms = 800) => {
    if (moodTimer.current) {
      clearTimeout(moodTimer.current)
    }
    setMood(nextMood)
    moodTimer.current = setTimeout(() => {
      if (!isSleepingRef.current) {
        setMood('idle')
      }
    }, ms)
  }, [])

  const clearSnoozeClocks = useCallback(() => {
    if (snoozeTimer.current) clearTimeout(snoozeTimer.current)
    if (snoozeTick.current) clearInterval(snoozeTick.current)
    snoozeTimer.current = null
    snoozeTick.current = null
  }, [])

  const ensureAudio = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!audioCtxRef.current) {
      const AudioCtor = window.AudioContext ?? (window as WindowWithAudio).webkitAudioContext
      if (!AudioCtor) return null
      const ctx = new AudioCtor()
      const master = ctx.createGain()
      master.gain.value = 0.55
      master.connect(ctx.destination)
      audioCtxRef.current = ctx
      masterGainRef.current = master
    }
    if (audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const chirp = useCallback(
    (force = false) => {
      if (!force && (isSleepingRef.current || reducedMotion || isPaused)) return
      const ctx = ensureAudio()
      if (!ctx || !masterGainRef.current) return
      playChirp(ctx, masterGainRef.current)
    },
    [ensureAudio, isPaused, reducedMotion]
  )

  const scheduleChirp = useCallback(() => {
    if (chirpTimer.current) clearTimeout(chirpTimer.current)
    if (isSleepingRef.current || reducedMotion || isPaused) return

    const gap = CHIRP_MIN_GAP_MS + Math.random() * (CHIRP_MAX_GAP_MS - CHIRP_MIN_GAP_MS)
    chirpTimer.current = setTimeout(() => {
      if (!speakingLock.current && !isSleepingRef.current) {
        chirp()
        setMoodFor('happy', 700)
      }
      scheduleChirp()
    }, gap)
  }, [chirp, isPaused, reducedMotion, setMoodFor])

  const speak = useCallback(
    (text: string, options?: { force?: boolean }) => {
      if (typeof window === 'undefined') return
      if (!window.speechSynthesis) return
      if (!options?.force && (isSleepingRef.current || isPaused)) return

      ensureAudio()
      clearBubbleTimer()
      window.speechSynthesis.cancel()

      speakingLock.current = true
      setMood('speaking')
      setBubbleText(text)
      setShowBubble(true)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.pitch = 2.0
      utterance.rate = 1.35
      utterance.volume = 1

      if (voiceRef.current) {
        utterance.voice = voiceRef.current
      }

      chirp(options?.force)

      utterance.onend = () => {
        speakingLock.current = false
        if (isSleepingRef.current) return
        setMoodFor('happy', 1200)
        hideBubbleAfter(1200)
      }

      utterance.onerror = () => {
        speakingLock.current = false
        if (isSleepingRef.current) return
        setMood('idle')
        setShowBubble(false)
      }

      window.speechSynthesis.speak(utterance)
    },
    [chirp, clearBubbleTimer, ensureAudio, hideBubbleAfter, isPaused, setMoodFor]
  )

  const feed = useCallback(
    (clientX?: number, clientY?: number) => {
      if (externalOnFeed) externalOnFeed()

      if (isSleepingRef.current) {
        setBubbleText('Pip is napping... tap wake to play!')
        setShowBubble(true)
        hideBubbleAfter(2000)
        return
      }

      ensureAudio()
      chirp()

      const rect = rootRef.current?.getBoundingClientRect()
      const baseX = rect ? rect.width * 0.35 : 40
      const baseY = rect ? rect.height * 0.15 : 10
      const hasClientPoint = typeof clientX === 'number' && typeof clientY === 'number' && rect
      const seedX = hasClientPoint ? clientX - rect.left : baseX
      const seedY = hasClientPoint ? clientY - rect.top : baseY
      const id = seedId.current + 1
      const emoji = SEED_EMOJIS[Math.floor(Math.random() * SEED_EMOJIS.length)]

      seedId.current = id
      setSeedList((list) => [...list, { id, x: seedX - 10, y: seedY - 40, emoji }])
      setMoodFor('eating', 1400)

      setTimeout(() => {
        const nextHeartId = heartId.current + 1
        heartId.current = nextHeartId
        setHearts((list) => [...list, { id: nextHeartId, x: baseX + 10, y: baseY - 10 }])
        setMoodFor('excited', 900)
        chirp()
      }, 500)
    },
    [chirp, ensureAudio, externalOnFeed, hideBubbleAfter, setMoodFor]
  )

  const wake = useCallback(() => {
    clearSnoozeClocks()
    wakeAt.current = 0
    isSleepingRef.current = false
    setIsSleeping(false)
    setSnoozeLeft(0)
    setMoodFor('happy', 1100)
    setBubbleText('Pip is awake!')
    setShowBubble(true)
    chirp(true)

    const name = childName ? ` ${childName}` : ''
    setTimeout(() => {
      speak(`Good morning${name}! Pip is ready to play!`, { force: true })
    }, 80)

    scheduleChirp()
  }, [childName, chirp, clearSnoozeClocks, scheduleChirp, setMoodFor, speak])

  useEffect(() => {
    wakeRef.current = wake
  }, [wake])

  const snooze = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    speakingLock.current = false
    isSleepingRef.current = true
    clearSnoozeClocks()

    if (chirpTimer.current) {
      clearTimeout(chirpTimer.current)
      chirpTimer.current = null
    }

    setIsSleeping(true)
    setMood('sleeping')
    setShowBubble(true)
    setBubbleText('Pip is taking a 20 minute break...')
    setSnoozeLeft(SNOOZE_MS)

    wakeAt.current = Date.now() + SNOOZE_MS

    snoozeTick.current = setInterval(() => {
      const left = Math.max(0, wakeAt.current - Date.now())
      setSnoozeLeft(left)
      if (left <= 0 && snoozeTick.current) {
        clearInterval(snoozeTick.current)
        snoozeTick.current = null
      }
    }, 1000)

    snoozeTimer.current = setTimeout(() => {
      wakeRef.current()
    }, SNOOZE_MS)

    hideBubbleAfter(3500)
  }, [clearSnoozeClocks, hideBubbleAfter])

  useEffect(() => {
    isSleepingRef.current = isSleeping
  }, [isSleeping])

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    setPos({
      x: Math.max(12, window.innerWidth - 160),
      y: Math.max(12, window.innerHeight - 220),
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.speechSynthesis) return
    const synth = window.speechSynthesis
    const loadVoices = () => {
      const voices = synth.getVoices?.() ?? []
      voiceRef.current = preferHighVoice(voices)
    }
    loadVoices()
    synth.onvoiceschanged = loadVoices
  }, [])

  useEffect(() => {
    onSpeakReady?.((text: string) => speak(text))
  }, [onSpeakReady, speak])

  useEffect(() => {
    scheduleChirp()
    return () => {
      if (chirpTimer.current) clearTimeout(chirpTimer.current)
    }
  }, [scheduleChirp])

  useEffect(() => {
    return () => {
      clearSnoozeClocks()
      clearBubbleTimer()
      if (moodTimer.current) clearTimeout(moodTimer.current)
      if (chirpTimer.current) clearTimeout(chirpTimer.current)
      if (audioCtxRef.current) void audioCtxRef.current.close()
    }
  }, [clearBubbleTimer, clearSnoozeClocks])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('[data-pip-action]')) return
    setIsDragging(true)
    dragOffset.current = {
      x: event.clientX - pos.x,
      y: event.clientY - pos.y,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const nextX = event.clientX - dragOffset.current.x
    const nextY = event.clientY - dragOffset.current.y
    const maxX = window.innerWidth - 130
    const maxY = window.innerHeight - 150

    setPos({
      x: Math.min(Math.max(8, nextX), maxX),
      y: Math.min(Math.max(8, nextY), maxY),
    })
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const formatSnooze = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainder = seconds % 60
    return `${minutes}:${remainder.toString().padStart(2, '0')}`
  }

  if (!mounted || typeof document === 'undefined') return null

  const node = (
    <div
      ref={rootRef}
      className="fixed z-[55] touch-none select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: 130,
        height: 150,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="complementary"
      aria-label="Pip the 3D parrot companion"
    >
      {/* Speech Bubble */}
      {showBubble && bubbleText && (
        <div
          className="pointer-events-none absolute -top-2 left-1/2 z-10 max-w-[160px] -translate-x-1/2 -translate-y-full px-3.5 py-2 text-center"
          style={{
            background: 'linear-gradient(145deg, #FFFFFF 0%, #FDF6F0 100%)',
            borderRadius: 20,
            boxShadow: '0 10px 28px rgba(61, 61, 92, 0.14), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}
        >
          <p className="font-switzer text-[11px] font-semibold leading-snug text-clay-text">{bubbleText}</p>
          <span
            className="absolute left-1/2 top-full -mt-px h-2.5 w-2.5 -translate-x-1/2 rotate-45"
            style={{ background: '#FDF6F0' }}
            aria-hidden
          />
        </div>
      )}

      {seedList.map((seed) => (
        <ClaySeed
          key={seed.id}
          x={seed.x}
          y={seed.y}
          emoji={seed.emoji}
          onDone={() => setSeedList((list) => list.filter((item) => item.id !== seed.id))}
        />
      ))}

      {hearts.map((heart) => (
        <ClayHeart
          key={heart.id}
          x={heart.x}
          y={heart.y}
          onDone={() => setHearts((list) => list.filter((item) => item.id !== heart.id))}
        />
      ))}

      {/* 3D WebGL Canvas for Pip */}
      <div
        className="relative mx-auto h-[100px] w-[100px]"
        onDoubleClick={() => feed()}
      >
        <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }}>
          <Float
            speed={reducedMotion || isSleeping ? 0 : 3}
            rotationIntensity={reducedMotion || isSleeping ? 0 : 0.2}
            floatIntensity={reducedMotion || isSleeping ? 0 : 0.4}
          >
            <Clay3DMesh mood={mood} isSleeping={isSleeping} />
          </Float>
        </Canvas>

        {/* Soft Ground Shadow */}
        <div
          className="pip-floating-shadow absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: isSleeping ? 50 : 62,
            height: 12,
            background: 'radial-gradient(ellipse at center, rgba(61,61,92,0.18) 0%, rgba(61,61,92,0) 70%)',
            transition: 'width 0.4s ease',
          }}
          aria-hidden
        />
      </div>

      {/* Action Dock */}
      <div className="mt-1 flex items-center justify-center gap-1.5">
        <button
          type="button"
          data-pip-action="feed"
          onClick={(event) => {
            event.stopPropagation()
            feed()
          }}
          className="font-switzer clay-pill-white flex h-8 items-center gap-1 px-2.5 text-[10px] font-bold text-clay-text transition hover:scale-105 active:scale-95"
          style={{
            borderRadius: 999,
            boxShadow: '0 4px 12px rgba(61, 61, 92, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
            background: 'linear-gradient(145deg, #FFFFFF 0%, #FFE8D6 100%)',
          }}
          aria-label="Feed Pip a seed"
          title="Feed Pip"
        >
          <span aria-hidden>🌱</span>
          Feed
        </button>

        {!isSleeping ? (
          <button
            type="button"
            data-pip-action="snooze"
            onClick={(event) => {
              event.stopPropagation()
              snooze()
            }}
            className="font-switzer flex h-8 items-center gap-1 px-2.5 text-[10px] font-bold text-clay-text transition hover:scale-105 active:scale-95"
            style={{
              borderRadius: 999,
              boxShadow: '0 4px 12px rgba(61, 61, 92, 0.1), inset 0 1px 0 rgba(255,255,255,0.85)',
              background: 'linear-gradient(145deg, #E8EEFA 0%, #CBBBEA 100%)',
            }}
            aria-label="Let Pip take a 20 minute break"
            title="20 minute break"
          >
            <span aria-hidden>😴</span>
            Break
          </button>
        ) : (
          <button
            type="button"
            data-pip-action="wake"
            onClick={(event) => {
              event.stopPropagation()
              wake()
            }}
            className="font-switzer flex h-8 items-center gap-1 px-2.5 text-[10px] font-bold text-clay-text transition hover:scale-105 active:scale-95"
            style={{
              borderRadius: 999,
              boxShadow: '0 4px 12px rgba(61, 61, 92, 0.1), inset 0 1px 0 rgba(255,255,255,0.85)',
              background: 'linear-gradient(145deg, #FFF6D6 0%, #FFE8D6 100%)',
            }}
            aria-label="Wake Pip"
            title={snoozeLeft > 0 ? `Wake (${formatSnooze(snoozeLeft)})` : 'Wake Pip'}
          >
            <span aria-hidden>☀️</span>
            {snoozeLeft > 0 ? formatSnooze(snoozeLeft) : 'Wake'}
          </button>
        )}

        <button
          type="button"
          data-pip-action="chirp"
          onClick={(event) => {
            event.stopPropagation()
            if (isSleepingRef.current) return
            chirp()
            setMoodFor('happy', 600)
          }}
          className="font-switzer flex h-8 w-8 items-center justify-center text-sm transition hover:scale-110 active:scale-95"
          style={{
            borderRadius: 999,
            boxShadow: '0 4px 12px rgba(61, 61, 92, 0.1), inset 0 1px 0 rgba(255,255,255,0.85)',
            background: 'linear-gradient(145deg, #E5F6FF 0%, #A8C5E8 100%)',
          }}
          aria-label="Make Pip chirp"
          title="Chirp"
        >
          <span aria-hidden>🎵</span>
        </button>
      </div>

      <style>{`
        @keyframes pip-seed-pop {
          0% {
            transform: translateY(0) scale(0.4) rotate(-20deg);
            opacity: 0;
          }
          40% {
            transform: translateY(18px) scale(1.15) rotate(8deg);
            opacity: 1;
          }
          100% {
            transform: translateY(46px) scale(0.5) rotate(25deg);
            opacity: 0;
          }
        }

        @keyframes pip-heart-float {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          30% {
            transform: translateY(-12px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-48px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )

  return createPortal(node, document.body)
}
