'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface ChildProfile {
  id: string
  first_name: string
  avatar_url?: string
  streak_count?: number
  words_learned?: number
}

interface StoryItem {
  id: string
  title: string
  summary?: string
  cover_emoji?: string
  progress_pct?: number
  is_completed?: boolean
  created_at: string
}

export default function KidDashboardPage() {
  const params = useParams()
  const childId = params?.childId as string

  const [child, setChild] = useState<ChildProfile | null>(null)
  const [stories, setStories] = useState<StoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childId) return

    async function loadData() {
      try {
        const supabase = createClient()

        // Fetch child profile
        const { data: childData } = await supabase
          .from('children')
          .select('id, first_name, avatar_url, streak_count, words_learned')
          .eq('id', childId)
          .single()

        if (childData) {
          setChild({
            id: childData.id,
            first_name: childData.first_name,
            avatar_url: childData.avatar_url,
            streak_count: childData.streak_count ?? 1,
            words_learned: childData.words_learned ?? 12,
          })
        } else {
          setChild({
            id: childId,
            first_name: 'Explorer',
            streak_count: 1,
            words_learned: 12,
          })
        }

        // Fetch stories
        const { data: storiesData } = await supabase
          .from('stories')
          .select('id, title, summary, cover_emoji, progress_pct, is_completed, created_at')
          .eq('child_id', childId)
          .order('created_at', { ascending: false })

        if (storiesData && storiesData.length > 0) {
          setStories(storiesData)
        } else {
          // Fallback sample stories for instant preview
          setStories([
            {
              id: 'story-1',
              title: 'The Magic Garden Adventure',
              summary: 'Explore a colorful garden where plants talk and flowers whistle friendly songs.',
              cover_emoji: '🌸',
              progress_pct: 40,
              is_completed: false,
              created_at: new Date().toISOString(),
            },
            {
              id: 'story-2',
              title: 'Pip and the Flying Cloud',
              summary: 'Soar high above soft fluffy clouds with Pip the Parrot and discover star seeds.',
              cover_emoji: '☁️',
              progress_pct: 100,
              is_completed: true,
              created_at: new Date().toISOString(),
            },
          ])
        }
      } catch (err) {
        console.error('Failed to load child dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [childId])

  const firstName = child?.first_name || 'Explorer'

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Greeting */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <span className="font-switzer inline-flex items-center gap-1.5 rounded-full bg-clay-peach/80 px-3.5 py-1 text-xs font-semibold text-clay-text shadow-sm">
            <span aria-hidden>✨</span> Today is a great day to read!
          </span>
          <h1 className="font-achiko text-3xl font-bold tracking-tight text-clay-text sm:text-4xl">
            Hi {firstName}!
          </h1>
          <p className="font-switzer text-sm font-medium text-clay-text/80">
            Pick a story below or practice your letter sounds with Pip!
          </p>
        </div>

        <Link
          href="/parent"
          className="font-switzer clay-pill-white inline-flex h-10 items-center justify-center gap-2 self-start rounded-full px-4 text-xs font-bold text-clay-text transition hover:scale-105 active:scale-95 sm:self-auto"
        >
          <span aria-hidden>🔐</span> Parent Dashboard
        </Link>
      </header>

      {/* Stats Banner - Soft Puffy Clay Pills */}
      <section className="grid grid-cols-3 gap-3 sm:gap-4" aria-label="Reading stats">
        <div
          className="relative overflow-hidden rounded-3xl p-4 text-center"
          style={{
            background: 'linear-gradient(145deg, #FFE8D6 0%, #FDF6F0 100%)',
            boxShadow: '0 8px 20px rgba(61, 61, 92, 0.08), inset 0 2px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div
            className="absolute left-3 top-2 h-2.5 w-10 rounded-full bg-white/70"
            aria-hidden
          />
          <span className="font-switzer text-2xl font-black leading-none text-clay-text">
            {stories.filter((s) => s.is_completed).length}
          </span>
          <p className="font-switzer mt-1 text-[11px] font-semibold text-clay-text/80">
            Completed
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-4 text-center"
          style={{
            background: 'linear-gradient(145deg, #B8E0D2 0%, #FDF6F0 100%)',
            boxShadow: '0 8px 20px rgba(61, 61, 92, 0.08), inset 0 2px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div
            className="absolute left-3 top-2 h-2.5 w-10 rounded-full bg-white/70"
            aria-hidden
          />
          <span className="font-switzer text-2xl font-black leading-none text-clay-text">
            {child?.words_learned ?? 12}
          </span>
          <p className="font-switzer mt-1 text-[11px] font-semibold text-clay-text/80">
            Words Mastered
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-4 text-center"
          style={{
            background: 'linear-gradient(145deg, #CBBBEA 0%, #FDF6F0 100%)',
            boxShadow: '0 8px 20px rgba(61, 61, 92, 0.08), inset 0 2px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div
            className="absolute left-3 top-2 h-2.5 w-10 rounded-full bg-white/70"
            aria-hidden
          />
          <span className="font-switzer text-2xl font-black leading-none text-clay-text">
            🔥 {child?.streak_count ?? 1}d
          </span>
          <p className="font-switzer mt-1 text-[11px] font-semibold text-clay-text/80">
            Active Streak
          </p>
        </div>
      </section>

      {/* Phonics Lab Banner */}
      <section>
        <div
          className="relative overflow-hidden rounded-3xl p-6 transition hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, #A8C5E8 0%, #B8E0D2 100%)',
            boxShadow: '0 12px 28px rgba(168, 197, 232, 0.35), inset 0 2px 0 rgba(255,255,255,0.85)',
          }}
        >
          <div
            className="absolute left-4 top-3 h-3 w-20 rounded-full bg-white/60"
            aria-hidden
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="font-switzer inline-block rounded-full bg-white/70 px-3 py-0.5 text-xs font-bold text-clay-text">
                100% Free Phonics
              </span>
              <h2 className="font-achiko text-2xl font-bold text-clay-text">
                Phonics Lab & Letter Sounds
              </h2>
              <p className="font-switzer text-xs font-medium text-clay-text/85">
                Practice pronunciation, letter sounds, and speech clarity with Pip!
              </p>
            </div>

            <Link
              href={`/kid/${childId}/phonics`}
              className="font-switzer clay-btn-coral inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-xs font-bold text-white transition hover:scale-105 active:scale-95"
            >
              <span aria-hidden>🎧</span> Start Phonics Lab
            </Link>
          </div>
        </div>
      </section>

      {/* Living Stories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-achiko text-2xl font-bold text-clay-text">
            Your Living Stories
          </h2>
          <span className="font-switzer text-xs font-bold text-clay-text/70">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-3xl"
                style={{ background: '#FFE8D6' }}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {stories.map((story) => (
              <article
                key={story.id}
                className="relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(150deg, #FFFFFF 0%, #FDF6F0 100%)',
                  boxShadow:
                    '0 10px 24px rgba(61, 61, 92, 0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
                }}
              >
                {/* Top Gloss Highlight */}
                <div
                  className="absolute left-4 top-3 h-2.5 w-16 rounded-full bg-white/80"
                  aria-hidden
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-2xl text-2xl shadow-sm"
                      style={{ background: '#FFE8D6' }}
                    >
                      {story.cover_emoji || '📖'}
                    </span>

                    {story.is_completed ? (
                      <span className="font-switzer rounded-full bg-clay-mint/60 px-3 py-0.5 text-[10px] font-bold text-clay-text">
                        ✓ Completed
                      </span>
                    ) : (
                      <span className="font-switzer rounded-full bg-clay-sky/60 px-3 py-0.5 text-[10px] font-bold text-clay-text">
                        {story.progress_pct || 0}% Read
                      </span>
                    )}
                  </div>

                  <h3 className="font-achiko text-lg font-bold text-clay-text">
                    {story.title}
                  </h3>

                  {story.summary && (
                    <p className="font-switzer text-xs font-normal leading-relaxed text-clay-text/80 line-clamp-2">
                      {story.summary}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between pt-2">
                  <Link
                    href={`/kid/${childId}/read/${story.id}`}
                    className="font-switzer clay-btn-coral inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-5 text-xs font-bold text-white transition hover:scale-105 active:scale-95"
                  >
                    {story.is_completed ? 'Read Again' : 'Read Chapter'}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
