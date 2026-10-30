const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'app', 'kid', '[childId]', 'page.tsx');

const code = `'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

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
  category?: string
  progress_pct?: number
  is_completed?: boolean
  created_at: string
}

export default function KidDashboardPage() {
  const params = useParams()
  const childId = (params?.childId as string) || ''

  const [child, setChild] = useState<ChildProfile | null>(null)
  const [stories, setStories] = useState<StoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childId) return

    async function loadData() {
      try {
        // Fetch child profile by ID
        const { data: childData, error: childErr } = await supabase
          .from('children')
          .select('id, first_name, avatar_url, streak_count, words_learned')
          .eq('id', childId)
          .maybeSingle()

        if (childData && !childErr) {
          setChild({
            id: childData.id,
            first_name: childData.first_name || 'Explorer',
            avatar_url: childData.avatar_url,
            streak_count: childData.streak_count ?? 1,
            words_learned: childData.words_learned ?? 12,
          })
        } else {
          // Fallback: try reading current user's kids
          const { data: kids } = await supabase
            .from('children')
            .select('id, first_name, avatar_url, streak_count, words_learned')
            .limit(1)

          if (kids && kids.length > 0) {
            setChild({
              id: kids[0].id,
              first_name: kids[0].first_name || 'Explorer',
              avatar_url: kids[0].avatar_url,
              streak_count: kids[0].streak_count ?? 1,
              words_learned: kids[0].words_learned ?? 12,
            })
          } else {
            setChild({
              id: childId,
              first_name: 'Explorer',
              streak_count: 1,
              words_learned: 12,
            })
          }
        }

        // Fetch child stories
        const { data: storiesData } = await supabase
          .from('stories')
          .select('id, title, summary, cover_emoji, progress_pct, is_completed, created_at')
          .eq('child_id', childId)
          .order('created_at', { ascending: false })

        if (storiesData && storiesData.length > 0) {
          setStories(storiesData)
        } else {
          setStories([
            {
              id: 'story-1',
              title: 'The Magic Garden Adventure',
              summary: 'Explore a colorful garden where plants talk and flowers whistle friendly songs.',
              cover_emoji: '🌸',
              category: 'Stories',
              progress_pct: 60,
              is_completed: false,
              created_at: new Date().toISOString(),
            },
            {
              id: 'story-2',
              title: 'Pip and the Flying Cloud',
              summary: 'Soar high above soft fluffy clouds with Pip and discover star seeds.',
              cover_emoji: '☁️',
              category: 'Stories',
              progress_pct: 100,
              is_completed: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 'story-3',
              title: 'Phonics Sound Safari',
              summary: 'Master animal sound phonics and unlock letter badges.',
              cover_emoji: '🦁',
              category: 'Phonics',
              progress_pct: 40,
              is_completed: false,
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
  const streak = child?.streak_count || 1

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-purple-200" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md pb-28 pt-2 sm:max-w-lg">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFE8D6] to-[#FFD8BE] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_16px_rgba(242,164,136,0.25)] ring-4 ring-white">
            <span className="text-2xl" role="img" aria-label="avatar">
              👧
            </span>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-white">
              ✓
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1 className="font-achiko truncate text-2xl font-bold tracking-tight text-[#2D2418] sm:text-3xl">
                Hi, {firstName}!
              </h1>
              <span className="text-xl" aria-hidden>
                👋
              </span>
            </div>
            <p className="font-switzer text-xs font-semibold text-[#6B5E52] sm:text-sm">
              Ready to learn something awesome today?
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-amber-100/80 px-3 py-1.5 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),0_4px_10px_rgba(245,183,49,0.2)] ring-1 ring-amber-200/50">
            <span className="text-sm" aria-hidden>
              🔥
            </span>
            <span className="font-switzer text-xs font-black text-amber-800">{streak}</span>
          </div>
          <Link
            href="/parent"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_16px_rgba(100,90,160,0.12)] transition hover:scale-105 active:scale-95"
            title="Notifications"
          >
            <span className="text-sm" aria-hidden>
              🔔
            </span>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </Link>
        </div>
      </header>

      {/* Today's Goal */}
      <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#8B7CFF] via-[#7C6BF2] to-[#6854F5] p-6 text-white shadow-[inset_0_3px_6px_rgba(255,255,255,0.35),0_18px_36px_rgba(108,84,245,0.3)]">
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -bottom-8 right-12 h-24 w-24 rounded-full bg-purple-300/20 blur-lg" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="max-w-[220px] space-y-3 sm:max-w-[280px]">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
              Today&apos;s Goal
            </span>
            <h2 className="font-achiko text-xl font-bold leading-tight sm:text-2xl">
              3 of 5 Lessons Completed
            </h2>
            <div className="space-y-1.5">
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-black/20 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD043] to-[#FFA000] shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),0_2px_6px_rgba(255,160,0,0.4)]"
                  style={{ width: '60%' }}
                />
              </div>
              <p className="font-switzer text-[11px] font-semibold text-purple-100">
                Keep going! 2 more to hit your daily badge.
              </p>
            </div>
          </div>

          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/15 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_12px_24px_rgba(0,0,0,0.15)] ring-2 ring-white/30 backdrop-blur-md sm:h-28 sm:w-28">
            <span className="text-5xl sm:text-6xl" aria-hidden>
              📖
            </span>
            <span className="absolute -bottom-2 -right-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-amber-950 shadow-md">
              ⭐ 120
            </span>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="mb-8 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-achiko text-xl font-bold tracking-tight text-[#2D2418]">Explore Categories</h2>
          <span className="font-switzer cursor-pointer text-xs font-bold text-[#7C6BF2] hover:underline">See all</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Phonics Lab */}
          <Link
            href={`/kid/${childId}/phonics`}
            className="group relative flex flex-col justify-between rounded-[28px] bg-[#E7E3FB] p-4 text-[#3D3D5C] shadow-[inset_0_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(149,133,255,0.15),0_12px_24px_rgba(114,93,255,0.12)] transition-all duration-200 hover:shadow-[0_16px_32px_rgba(114,93,255,0.2)] active:scale-95"
          >
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-purple-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                Free
              </span>
              <span className="text-xs font-bold text-purple-700/70">26 Sounds</span>
            </div>
            <div className="my-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(114,93,255,0.15)] transition-transform duration-200 group-hover:scale-110">
                <span className="text-3xl" aria-hidden>
                  🔤
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-achiko text-base font-bold text-[#2D2418]">Phonics Lab</h3>
              <p className="font-switzer text-[11px] font-medium text-[#6B5E52]">Letter sounds forever free</p>
            </div>
          </Link>

          {/* Stories */}
          <Link
            href={`/kid/${childId}`}
            className="group relative flex flex-col justify-between rounded-[28px] bg-[#D6F0E4] p-4 text-[#3D3D5C] shadow-[inset_0_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(52,199,139,0.15),0_12px_24px_rgba(52,199,139,0.12)] transition-all duration-200 hover:shadow-[0_16px_32px_rgba(52,199,139,0.2)] active:scale-95"
          >
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                Living
              </span>
              <span className="text-xs font-bold text-emerald-700/70">Adaptive</span>
            </div>
            <div className="my-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(52,199,139,0.15)] transition-transform duration-200 group-hover:scale-110">
                <span className="text-3xl" aria-hidden>
                  📚
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-achiko text-base font-bold text-[#2D2418]">Stories</h3>
              <p className="font-switzer text-[11px] font-medium text-[#6B5E52]">Living chapters</p>
            </div>
          </Link>

          {/* Math Quest */}
          <div className="group relative flex flex-col justify-between rounded-[28px] bg-[#FDE3D4] p-4 text-[#3D3D5C] opacity-95 shadow-[inset_0_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(242,164,136,0.15),0_12px_24px_rgba(242,164,136,0.12)]">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-amber-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                Soon
              </span>
              <span className="text-xs font-bold text-amber-800/70">Campaign</span>
            </div>
            <div className="my-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(242,164,136,0.15)]">
                <span className="text-3xl" aria-hidden>
                  🔢
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-achiko text-base font-bold text-[#2D2418]">Math Quest</h3>
              <p className="font-switzer text-[11px] font-medium text-[#6B5E52]">Numbers and counting</p>
            </div>
          </div>

          {/* Science */}
          <div className="group relative flex flex-col justify-between rounded-[28px] bg-[#D8E8FB] p-4 text-[#3D3D5C] opacity-95 shadow-[inset_0_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(91,181,240,0.15),0_12px_24px_rgba(91,181,240,0.12)]">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-sky-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                Soon
              </span>
              <span className="text-xs font-bold text-sky-800/70">Explore</span>
            </div>
            <div className="my-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(91,181,240,0.15)]">
                <span className="text-3xl" aria-hidden>
                  🧪
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-achiko text-base font-bold text-[#2D2418]">Science</h3>
              <p className="font-switzer text-[11px] font-medium text-[#6B5E52]">Space and nature</p>
            </div>
          </div>

          {/* Social Skills */}
          <div className="group relative flex flex-col justify-between rounded-[28px] bg-[#F9D7E3] p-4 text-[#3D3D5C] opacity-95 shadow-[inset_0_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(244,166,166,0.15),0_12px_24px_rgba(244,166,166,0.12)]">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                Soon
              </span>
              <span className="text-xs font-bold text-rose-800/70">Life Skills</span>
            </div>
            <div className="my-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(244,166,166,0.15)]">
                <span className="text-3xl" aria-hidden>
                  🤝
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-achiko text-base font-bold text-[#2D2418]">Social Skills</h3>
              <p className="font-switzer text-[11px] font-medium text-[#6B5E52]">Kindness and friends</p>
            </div>
          </div>

          {/* Bullying Awareness */}
          <div className="group relative flex flex-col justify-between rounded-[28px] bg-[#FBE9B7] p-4 text-[#3D3D5C] opacity-95 shadow-[inset_0_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(245,183,49,0.15),0_12px_24px_rgba(245,183,49,0.12)]">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-amber-700 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                Soon
              </span>
              <span className="text-xs font-bold text-amber-900/70">Hero</span>
            </div>
            <div className="my-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(245,183,49,0.15)]">
                <span className="text-3xl" aria-hidden>
                  🛡️
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-achiko text-base font-bold text-[#2D2418]">Stay Strong</h3>
              <p className="font-switzer text-[11px] font-medium text-[#6B5E52]">Courage and safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning */}
      <section className="mb-8 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-achiko text-xl font-bold tracking-tight text-[#2D2418]">Continue Learning</h2>
          <span className="font-switzer cursor-pointer text-xs font-bold text-[#7C6BF2] hover:underline">See all</span>
        </div>

        <div className="space-y-3.5">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/kid/${childId}/read/${story.id}`}
              className="group flex items-center justify-between gap-3 rounded-[28px] bg-white p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_12px_28px_rgba(100,90,160,0.08)] transition-all duration-200 hover:shadow-[0_16px_36px_rgba(100,90,160,0.14)] active:scale-[0.98]"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4F3FB] to-[#E7E3FB] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9)] ring-1 ring-purple-100">
                  <span className="text-3xl" aria-hidden>
                    {story.cover_emoji || '📖'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-achiko truncate text-base font-bold text-[#2D2418] transition-colors group-hover:text-[#7C6BF2]">
                    {story.title}
                  </h3>
                  <p className="font-switzer text-xs font-semibold text-[#6B5E52]">
                    {story.category || 'Living Story'} · Level 2
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 shadow-inner sm:w-32">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#9585FF] to-[#725DFF]"
                        style={{ width: `${story.progress_pct || 40}%` }}
                      />
                    </div>
                    <span className="font-switzer text-[11px] font-extrabold text-[#7C6BF2]">
                      {story.progress_pct || 40}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#725DFF] text-white shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),0_6px_16px_rgba(114,93,255,0.35)] transition-transform duration-200 group-hover:scale-110">
                <span className="ml-0.5 text-sm font-bold" aria-hidden>
                  ▶
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Floating bottom pill tabs */}
      <nav className="fixed bottom-5 left-1/2 z-40 w-[min(92vw,24rem)] -translate-x-1/2">
        <div className="flex items-center justify-between rounded-full bg-white/90 px-6 py-3 shadow-[0_16px_40px_rgba(100,90,160,0.2),inset_0_2px_4px_rgba(255,255,255,0.95)] ring-1 ring-purple-100/50 backdrop-blur-xl">
          <Link
            href={`/kid/${childId}`}
            className="flex flex-col items-center gap-0.5 text-[#725DFF] transition-transform active:scale-90"
          >
            <span className="text-xl" aria-hidden>
              🏠
            </span>
            <span className="font-switzer text-[10px] font-extrabold tracking-tight">Home</span>
          </Link>

          <Link
            href={`/kid/${childId}/phonics`}
            className="flex flex-col items-center gap-0.5 text-[#9B8E82] transition-transform hover:text-[#725DFF] active:scale-90"
          >
            <span className="text-xl" aria-hidden>
              🔤
            </span>
            <span className="font-switzer text-[10px] font-semibold tracking-tight">Phonics</span>
          </Link>

          <Link
            href={`/kid/${childId}`}
            className="flex flex-col items-center gap-0.5 text-[#9B8E82] transition-transform hover:text-[#725DFF] active:scale-90"
          >
            <span className="text-xl" aria-hidden>
              📚
            </span>
            <span className="font-switzer text-[10px] font-semibold tracking-tight">Stories</span>
          </Link>

          <Link
            href="/parent"
            className="flex flex-col items-center gap-0.5 text-[#9B8E82] transition-transform hover:text-[#725DFF] active:scale-90"
          >
            <span className="text-xl" aria-hidden>
              👤
            </span>
            <span className="font-switzer text-[10px] font-semibold tracking-tight">Parent</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
`

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully wrote child profile lookup fix!');