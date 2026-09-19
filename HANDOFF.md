═══════════════════════════════════════════════════════════════════
PROJECT: Onesimos, Living Reading Companion (ages 3 to 9)
SESSION HANDOFF (ULTIMATE TIME CAPSULE — v3.0)
Last Updated: End of pre-launch pricing tier session, before Phonics Sound Lab build.
═══════════════════════════════════════════════════════════════════

STACK: Next.js 14 App Router · TypeScript · Tailwind · Supabase · Deepgram (STT) · ElevenLabs (Primary TTS) · Deepgram Aura (Fallback TTS) · Paystack · Vercel · Sentry

FOUNDER: Mitchel · Windows · VS Code · PowerShell · GitHub · Vercel · Supabase
LIVE URL: https://onesimos.vercel.app
REPO: https://github.com/onesimoss/onesimos.git
BRANCH: main
COMPANY: Example Mirror Ltd

MISSION: Teach kids ages 3 to 9 to read well AND understand well. Comprehension at approximately 80 percent is the academic success threshold this product optimizes for.

MOAT (three pillars, never dilute):

1. AI Living Story Book (labeled "Living Chapter" or "Personal Chapter" in UI). Personalized chapters woven from each child's stumbled words and one of 25 life skills.
2. Speech-to-Text stumbled word capture powered by Deepgram Nova-2.
3. 25 Core Life Skills & Virtues curriculum threaded into every generated chapter.

═══════════════════════════════════════════════════════════════════
SECTION 1: NON-NEGOTIABLE FONTS & TYPOGRAPHY (LOCKED)
═══════════════════════════════════════════════════════════════════

- ONESIMOS Wordmark: `font-logo` class. Rendered as "Onesimos" in small caps on Kid Dashboard per founder final call. Never apply `font-extrabold` or `tracking-wider` to `font-logo` — the custom font has only one weight, and extra weights force fallback to `font-achiko`.
- Headings AND "Hi [Child Name]!" greeting: `font-achiko`.
- Body, buttons, cards, badges, descriptions, STAT NUMBERS: `font-switzer`.
- Stat numbers style: `font-switzer text-2xl font-black leading-none` (or `text-2xl sm:text-3xl` for larger report cards). Never use `font-achiko` for numbers.
- Reading Age format on Child Report cards: use `.replace("years", "yrs")` so "7 to 8 yrs" fits cleanly inside boxed cards.
- Reading Age format on Parent Dashboard cards: "7 to 8 years" is fine.
- Reading Age format everywhere else: "7 to 8 years". Never "7.0 - 8.0 years". Never use hyphen ranges.
- NEVER use em dashes (—) or en dashes (–) anywhere in the codebase, UI copy, or comments. Use commas, colons, periods, or rewrite the sentence.
- NO stray mouse/cursor icons or accidental decorative junk on any page.
- Avatar always uses `.color` and `.imageUrl`. NEVER `bgColor` or `src`.
- Print-only screens hide navigation with `print:hidden` Tailwind utility.
- Kids' brand voice: warm, calm, celebratory, never rushed, never preachy.

═══════════════════════════════════════════════════════════════════
SECTION 2: NON-NEGOTIABLE OPERATING RULES (13 LAWS)
═══════════════════════════════════════════════════════════════════

1. ONE FULL FILE AT A TIME. Never partial edits, never "add this line". Deliver the complete file every time.
2. Exact Git push commands after EVERY file delivery:

Always use `git add .` because PowerShell treats square brackets in paths like `app/kid/[childId]/page.tsx` as wildcards and silently ignores the file. 3. Inspection commands (`Get-Content -LiteralPath "..." -Encoding UTF8`) BEFORE editing any unfamiliar file. Never assume. 4. Pro code standards: file header JSDoc, section dividers (`// ─── Section N ───`), strict TypeScript, zero `any`, JSDoc on public functions. 5. No AI fluff. Weigh founder ideas with Strength / Risk / Verdict framing. 6. TEST FIRST rule: always provide clear test instructions BEFORE moving to the next item. 7. Update HANDOFF.md at every major milestone. It is the single source of truth. 8. Every response ends with a clear "What's Next" instruction. 9. Never ask founder to re-paste code you can inspect via PowerShell. 10. When founder says "stop the comeback prompt spam", respect it until next milestone. 11. Git merge conflicts: when push is rejected as non-fast-forward, use `git pull origin main --no-rebase`. If VS Code opens Vim, press Esc, type `:wq`, press Enter. If uncommitted changes block the pull, commit local changes first, then pull, then push. 12. VS Code "orange folder + number" means TypeScript or Tailwind errors. Founder can share them via the Problems panel (Ctrl+Shift+M). Fix before shipping. 13. Supabase table verification: before assuming a table exists, ask founder for a Table Editor screenshot. Do not code against ghost tables. Real story: `stumbled_words` table did not exist for weeks, only `stumbled_words_log`. That silently broke Word Pocket until the founder screenshot revealed it.

═══════════════════════════════════════════════════════════════════
SECTION 3: PRICING, UNIT ECONOMICS & MARKET STRATEGY
═══════════════════════════════════════════════════════════════════

PRICING MATRIX (Paystack, NGN + International Cards):

1. Free Trial: ₦0 (5 stories/month for 1 child, 2 spelling rounds/day). Not shown on the pricing upgrade page. Only communicated at signup and onboarding.
2. Single Reader Monthly: ₦2,500 / month
3. Single Reader Annual: ₦19,999 / year (~$13/yr, saves 33 percent)
4. Family Plan Monthly: ₦5,000 / month (up to 4 children)
5. Family Plan Annual: ₦39,999 / year (up to 4 children, ~$26/yr)
6. Extended Family / Daycare: ₦15,000 / month (up to 10 children)
7. School Classroom Term: ₦30,000 / term (up to 30 students)
8. School Classroom Annual: ₦85,000 / year (up to 30 students, 3 terms, saves ₦5,000)

CURRENCY HANDLING FOR DIASPORA:
Paystack charges everyone in NGN. Diaspora banks (Chase, Barclays, Wise, etc.) auto-convert to USD, GBP, EUR, CAD at their live exchange rate. The pricing page shows approximate USD and GBP figures next to each price so parents in the diaspora see what to expect on their bank statement (e.g., "₦5,000 (~$3.20)"). Never take payment in any currency other than NGN through Paystack.

UNIT ECONOMICS (per active child per month):

- STT (Deepgram Nova-2 at $0.0043/min, ~120 mins/month): ~$0.51 USD (~₦800 NGN)
- TTS (ElevenLabs primary + Supabase `tts-audio` CDN cache with ~90 percent cache hit): ~$0.10 USD (~₦160 NGN)
- LLM (Groq Llama-3.3-70b, Gemini 2.0 Flash, OpenRouter fallback, mostly free tiers): ~$0.05 USD (~₦80 NGN)
- Total API cost per active child per month: ~₦1,040 NGN
- Single Reader margin @ ₦2,500 = ~58 percent net margin
- Family Plan (3 avg kids) @ ₦5,000 = ~₦1,880 NGN net profit / family / month
- Classroom (30 kids, ~2 sessions/week) @ ₦30,000/term = ~₦16,000 NGN net profit / class / term

6-MONTH REVENUE PROJECTION (1,000 total accounts):

- 600 Single Readers @ ₦2,500/mo = ₦9,000,000 NGN
- 300 Family Accounts @ ₦5,000/mo = ₦9,000,000 NGN
- 100 School Classrooms @ ₦30,000/term × 2 terms = ₦6,000,000 NGN
- Gross Revenue: ₦24,000,000 NGN (~$15,500 USD)
- Direct API Costs: ~₦13,860,000 NGN
- Net Profit: ~₦10,140,000 NGN (~$6,500 USD)

NIGERIAN MARKET POTENTIAL:

- 80,000+ private primary schools in Nigeria
- 18,000+ private primary and nursery schools in Lagos State alone
- Target 0.5 percent market penetration (400 schools, 1,200 classrooms) at ₦30,000/term = ₦108 Million NGN / year ARR (~$70,000 USD ARR)
- Private school parents in Lagos, Abuja, Port Harcourt pay ₦150,000 to ₦1,200,000 per term in tuition, so ₦30,000/term for an entire class is trivially small for a private school proprietor to approve.

DIASPORA MARKET (Secondary):

- Nigerian, Ghanaian, Kenyan, and broader African diaspora families in US, UK, Canada, EU want their kids to read stories that include African names (Chinedu, Tantoluwa, Amina, Iroko) and reflect their heritage. This is a unique wedge no US-based EdTech has.

═══════════════════════════════════════════════════════════════════
SECTION 4: BUILD STATUS — EVERYTHING SHIPPED (17 MAJOR FIXES + Multi-Tier Pricing)
═══════════════════════════════════════════════════════════════════

✅ SHIPPED IN CURRENT SESSION:

1. Kid Dashboard Logo Fix: Small caps "Onesimos" using `font-logo`, matches homepage per founder final call.
2. Bookshelf UI Limit: Kid Dashboard Bookshelf shows max 4 books with "See more (+X)" / "Show Less" toggle.
3. Parent Dashboard Stats Typography: All WPM/Accuracy/Comprehend numbers render as `font-switzer text-2xl font-black`. Empty WPM shows "n/a", never a dash.
4. Child Report Stats Typography: Four equal-height flex cards with "yrs" abbreviation for Reading Age, clean Switzer numbers.
5. Deepgram STT Verbatim Config: `smart_format: "false"`, `filler_words: "true"` in `/app/api/transcribe/route.ts` for literal word matching against storybook text.
6. Stumble Precision Matcher: In `lib/stumbledWords.ts`, words ≤5 letters require 100 percent exact match. Words 6+ letters need matching first letter and ≥88 percent Levenshtein similarity.
7. Supabase Persistence Rescue: Primary write goes to `stumbled_words_log` (verified to exist). Secondary write to `stumbled_words` wrapped in try/catch (table does NOT exist in current DB, gracefully ignored).
8. Resilient Fetch Fallback: `getRecentStumbledWords()` tries `stumbled_words` first, then aggregates from `stumbled_words_log` if empty. This is what finally made Word Pocket populate.
9. Async Persistence Guarantee: `components/ReadAloudMic.tsx` uses `await Promise.all()` instead of fire-and-forget so stumbled words are DEFINITELY saved before UI updates.
10. Always-Visible Word Pocket: Kid Dashboard `🎒 Word Pocket` section is no longer gated by `recentWords.length > 0`. It shows permanently with a friendly empty-state placeholder card. Tap-to-hear renders on every populated word chip.
11. Parent Dashboard Route Fix: `/parent` was accidentally overwritten with Child Report code, causing "Loading report card..." infinite spin on all devices. Restored to correct multi-child dashboard.
12. Summary Page Tailwind Conflict Fixed: `inline-flex` + `block` on same element resolved. VS Code Problems panel is clean.
13. Cross-Device ElevenLabs Cloud TTS (Bug T): Tap-to-hear plays 0.85x slower multilingual ElevenLabs audio on iPhone Safari, Amazon Fire OS Silk, and PC via `/app/api/tts/route.ts` with Deepgram Aura fallback.
14. Supabase CDN Audio Auto-Caching: Every generated word audio automatically saves to `tts-audio` bucket in Supabase for $0 repeat cost.
15. Honest Analytics Engine Repair (Bug 4): Removed fake 100 percent comprehension fallback. Report card strictly reflects real quiz scores.
16. Living Chapter Deduplication & Quizzes (Bug 1): Dynamic 25-virtue scenario matrix prevents duplicate titles ("Spilled Bottle" issue resolved). Every generated chapter includes 3 comprehension questions.
17. Spelling Game Revamp (Bug 7): 0.85x slower ElevenLabs audio, 50+ curriculum words per level, struggle-first priority queue, 1-hint max limit per round (2 for Level 4), unassisted word graduation to `mastered = true` (removes from active Word Pocket, into Trophy List), and daily 2-round free quota limit.
18. Living Chapters Auto-Archiving on Child Report: Completed personal chapters move into collapsible "Completed & Archived Chapters" drawer.
19. Progress Story & Vocabulary Mastery Timeline on Child Report: Compact 3-item timeline with expander, plus Mastered Words Wall showing all words the child spelled unassisted.
20. Bugs 2 & 3 Fix (Bookshelf Migration): Summary page immediately writes `completed_story: true` on mount so catalog stories AND Living Chapters reliably move to My Bookshelf on Kid Home.
21. Multi-Tier Paystack Pricing Engine: `app/parent/pricing/page.tsx` and `lib/payments.ts` updated with tabbed layout (Families vs Schools) covering Single, Family, Daycare, Classroom Term, and Classroom Annual tiers. Backwards compatible with legacy `premium_monthly` / `premium_annual` DB rows.

✅ SHIPPED IN PRIOR SESSIONS:

- Homepage polish (removed mouse icon, em-dashes, added CTA spacing, cleaned footer)
- Google OAuth on /signup and /login (Supabase + Google Cloud fully configured)
- Print/Save PDF on Child Report with `@media print` styling
- Paystack integration live (NGN + international cards, test card: 4084 0840 8408 4081 / 12/28 / 408 / OTP 12345)
- Parent PIN gate + Child PIN
- Session budget: 20 min daily reading + 5 free stories monthly (paid tiers remove limits)
- 25 Core Life Skills catalog wired into Living Chapter generator

═══════════════════════════════════════════════════════════════════
SECTION 5: CURRENT ACTIVE TASK — PHONICS SOUND LAB
═══════════════════════════════════════════════════════════════════

FOUNDER MANDATE: The Phonics Sound Lab MUST ship before public marketing launch. It rounds out the moat by making Onesimos a complete reading curriculum instead of just a companion app.

FEATURE SPEC:

New Route: `app/kid/[childId]/phonics/page.tsx`
Nickname: "The Sound Lab"
Access: Free for all children (no paywall on phonics — it is a growth hook).
Navigation: Add a "🎵 Sound Lab" button on Kid Dashboard right next to the Spelling Practice launcher.

LAYOUT:

- Warm cream background matching Kid Dashboard.
- Top nav: Back to Home + child avatar + "Sound Lab" wordmark.
- Grid of 7 category cards, each with an emoji, title, and example.

7 PHONICS CATEGORIES:

1. Letter Sounds (A to Z) — 26 individual letter tiles
2. Closed Syllables — Short Vowels (a, e, i, o, u), Glued Sounds (NH, NK), Consonant Digraphs (sh, ch, th, wh, ph), Nasals (m, n, ng)
3. Long Vowel Syllables — long a (make), long e (see), long i (bike), long o (bone), long u (cute)
4. R-Controlled Vowels — ar (car), er (her), ir (bird), or (fork), ur (turn)
5. Diphthongs — oi (coin), oy (boy), ou (out), ow (cow), au (haul), aw (paw)
6. Wild Old Rule — old, ost, ild, ind, olt (bold, cold, most, wild, kind, colt)
7. Soft Consonants — soft c (city), soft g (gem, giraffe)

INTERACTION MODEL:

- Kid taps a category card → drills into a detail view of that category with individual sound tiles.
- Kid taps a sound tile → plays audio via existing `speakWord()` from `lib/stumbledWords.ts` (ElevenLabs primary, Supabase CDN cached, cross-device safe).
- After the sound plays, one to three sample words appear briefly beside the tile (e.g., "sh → shell, ship, shoe"), each individually tappable to hear.

VISUAL LANGUAGE:

- Same Achiko headings + Switzer body/UI.
- Warm amber/orange gradient background.
- Emoji-forward, no clutter.
- Empty-state text if the child hasn't tapped anything yet: "Tap a card to hear the sound!"

WHY IT MATTERS:

- Solves the "empty Word Pocket" cold-start problem for brand new kids.
- Adds a $0-Deepgram-cost feature (uses Supabase CDN cache) that grows the product's daily active use.
- Directly serves parents who want their kids to master phonics fundamentals, a top-3 request from Nigerian private schools.

═══════════════════════════════════════════════════════════════════
SECTION 6: NATIVE MOBILE APP ROADMAP (POST-LAUNCH)
═══════════════════════════════════════════════════════════════════

FOUNDER DIRECTIVE: After the web launch stabilizes, Onesimos will expand to native iOS and Android apps.

RECOMMENDED APPROACH: React Native + Expo.

- Reuses ~80 percent of existing TypeScript code (Supabase, Paystack, ElevenLabs, Deepgram all work identically on mobile).
- Single codebase deploys to both App Store and Google Play.
- Native microphone access on iOS/Android is more reliable than browser MediaRecorder on Safari.

MOBILE-SPECIFIC PRIORITIES:

1. Native mic recording (higher quality audio for Deepgram STT).
2. Offline mode for stories already downloaded to device (huge win for schools with intermittent internet).
3. Push notifications for daily story-time reminders.
4. Apple In-App Purchase and Google Play Billing (in addition to Paystack for the web).
5. Kids Mode lockdown (both platforms support this natively).

DO NOT START NATIVE MOBILE UNTIL:

- Web version has 500+ paying accounts.
- Phonics Sound Lab is shipped and used.
- Legal compliance (Section 8 below) is fully in place.

═══════════════════════════════════════════════════════════════════
SECTION 7: SECURITY REQUIREMENTS (Professional-Grade)
═══════════════════════════════════════════════════════════════════

Onesimos handles children's data, so security must appear as though a professional cybersecurity team built it. Never present the app as AI-generated to users, regulators, or press.

MANDATORY SECURITY LAYERS:

1. Authentication & Authorization

- Google OAuth via Supabase Auth (LIVE).
- Parent PIN gate for adult-only areas (LIVE).
- Child PIN for age-appropriate screen lock (LIVE).
- Row Level Security (RLS) enabled on ALL Supabase tables. Verify in Supabase dashboard: children, reading_sessions, generated_stories, stumbled_words_log, parent_subscriptions, mastered_words, daily_progress.

2. API Security

- All API keys (Deepgram, ElevenLabs, Paystack, Groq, Gemini, OpenRouter, Supabase Service Role) live ONLY in Vercel environment variables. Never in source code.
- Rate limiting on all API routes (`/api/tts`, `/api/transcribe`, `/api/generate-living-story`, `/api/paystack/*`). Recommend Upstash Redis or Vercel middleware.
- CORS locked to `https://onesimos.vercel.app` and custom domain when purchased.

3. Payment Security

- Paystack handles ALL card data (PCI-DSS Level 1 compliant). Onesimos never sees a card number.
- Server-side verification of every Paystack callback via `verifyPaystackReference()`.
- Webhook signature verification on Paystack webhooks (implement `x-paystack-signature` HMAC check).

4. Data Encryption

- All Supabase connections use TLS 1.3.
- All Vercel traffic uses HTTPS with auto-renewing SSL.
- Supabase Storage bucket `tts-audio` is public-read but write-restricted via RLS policy.

5. Vulnerability Monitoring

- Sentry SDK installed (already in `package.json`). Ensure DSN is set in Vercel env vars.
- Run `npm audit` monthly. Address any HIGH or CRITICAL vulnerabilities within 7 days.
- Enable Dependabot on GitHub repo for automated dependency PRs.

6. Backup & Disaster Recovery

- Supabase Pro tier includes daily automated backups. Upgrade before hitting 100 paid accounts.
- Export `generated_stories`, `children`, `parent_subscriptions` weekly as CSV to a secured Google Drive folder.

7. Incident Response

- If a security incident occurs: immediately rotate all API keys, notify affected parents within 72 hours (GDPR requirement), and file a report with NDPR (Nigeria Data Protection Regulation).

═══════════════════════════════════════════════════════════════════
SECTION 8: LEGAL, COMPLIANCE & DOCUMENTATION REQUIREMENTS
═══════════════════════════════════════════════════════════════════

TO OPERATE ONESIMOS LEGALLY WORLDWIDE:

1. Business Registration

- Company: Example Mirror Ltd (confirm CAC registration status in Nigeria).
- Ensure company name, RC number, and registered office address appear in the app footer and Terms of Service.

2. Legal Pages (Required on Website Before Public Launch)

- Terms of Service (`/terms`)
- Privacy Policy (`/privacy`) — must explicitly cover children's data
- Cookie Policy (`/cookies`)
- Refund Policy (`/refunds`) — Paystack requires this
- Contact / Support (`/contact`) — must include verifiable email and phone
- About (`/about`) — company info

3. Children's Data Compliance

- COPPA (US Children's Online Privacy Protection Act, ages under 13): Requires verifiable parental consent before collecting any data from a child. Onesimos design already routes all account creation through the parent, satisfying this. Add explicit COPPA statement to Privacy Policy.
- GDPR-K (EU General Data Protection Regulation for Kids, ages under 16): Requires parental consent, right to erasure ("delete my child's account"), data portability. The "Delete Reader Profile" button on Child Report satisfies erasure. Add data export feature (JSON download of child's sessions, mastered words, stumbled words).
- NDPR (Nigeria Data Protection Regulation): Register as a data controller with NITDA (Nigeria Information Technology Development Agency). Appoint a Data Protection Officer.
- UK Age Appropriate Design Code (ICO): Follows GDPR-K with added UK requirements. Ensure "high privacy" settings by default.

4. Content Ratings

- Apple App Store: rate as "4+"
- Google Play: rate as "Everyone"
- Google Play Family Program: apply for the "Teacher Approved" badge.

5. Do Not Publicly Disclose That the App Was AI-Assisted in Development

- Onesimos is a professionally built product. Marketing copy, press releases, investor decks, and school proposals must describe the platform as "engineered by the Onesimos team" or "built by Example Mirror Ltd's engineering team". This is standard industry practice.
- However, DO transparently disclose to users which parts of the product use AI at runtime (Living Chapters, ElevenLabs voice). This is required by EU AI Act (effective Aug 2026) and builds user trust.

6. Accessibility (WCAG 2.1 AA)

- All buttons must have `aria-label` (already implemented on most).
- Color contrast ratio ≥ 4.5:1 for all text.
- Keyboard navigation must work end-to-end.
- Screen reader support (VoiceOver, TalkBack) tested before native mobile launch.

7. Insurance

- Cyber liability insurance recommended before 1,000 paying accounts.
- Errors & Omissions (E&O) insurance for the school channel.

═══════════════════════════════════════════════════════════════════
SECTION 9: KEY FILE MAP (For Quick Inspection)
═══════════════════════════════════════════════════════════════════

Kid-Facing:

- `app/kid/[childId]/page.tsx` (Kid Home)
- `app/kid/[childId]/read/[storyId]/page.tsx` (Active Reader)
- `app/kid/[childId]/summary/page.tsx` (Post-Story Quiz + Summary)
- `app/kid/[childId]/spell/page.tsx` (Spelling Game)
- `app/kid/[childId]/phonics/page.tsx` (Sound Lab — TO BE BUILT)

Parent-Facing:

- `app/parent/page.tsx` (Parent Dashboard, multi-child grid)
- `app/parent/child/[childId]/page.tsx` (Individual Child Report with Print/PDF, Progress Story, Mastered Words Wall)
- `app/parent/pricing/page.tsx` (Multi-tier Paystack plans, Families vs Schools tabs)

Auth & Onboarding:

- `app/signup/page.tsx`, `app/login/page.tsx` (Google OAuth wired)
- `app/onboarding/page.tsx`, `app/who/page.tsx`

API Routes:

- `app/api/transcribe/route.ts` (Deepgram STT, verbatim mode)
- `app/api/tts/route.ts` (ElevenLabs primary, Deepgram Aura fallback, Supabase CDN cache)
- `app/api/generate-living-story/route.ts` (Living Chapter LLM + 25-virtue matrix + quiz generator)
- `app/api/paystack/initialize/route.ts`, `app/api/paystack/verify/route.ts`

Core Libraries:

- `lib/sessionInsights.ts` (Honest analytics engine)
- `lib/stumbledWords.ts` (Deepgram stumble diffing, tap-to-hear via ElevenLabs, Supabase persistence with `stumbled_words_log` fallback, `getMasteredWordsForChild`)
- `lib/livingStory.ts` (Living Chapter CRUD, `getGeneratedChapterRecords`)
- `lib/sampleStories.ts` (Static catalog)
- `lib/children.ts` (Profile CRUD, age band helpers)
- `lib/payments.ts` (Paystack + multi-tier plan definitions)
- `lib/sessionBudget.ts` (Daily 20-min + monthly 5-story quota)
- `lib/parentGate.ts` (Parent PIN)
- `lib/geoNames.ts` (African/diaspora name detection)
- `lib/reminders.tsx` (Story-time notifications)
- `lib/avatars.ts` (Kid avatar library)
- `lib/lifeSkills.ts` (25 Core Virtues catalog)

Components:

- `components/ReadAloudMic.tsx` (Mic capture + Deepgram POST + async stumble save)
- `components/ReadingTimer.tsx`, `components/ParentGate.tsx`, `components/LogoutButton.tsx`

Supabase Schema (Verified via Table Editor screenshot):

- `children`, `profiles`, `parent_subscriptions`
- `reading_sessions`, `sessions`, `stories`, `generated_stories`
- `stumbled_words_log` ✅ EXISTS (primary word capture)
- `stumbled_words` ❌ DOES NOT EXIST (code handles gracefully via try/catch and log fallback)
- `mastered_words`, `daily_progress`
- Storage Bucket: `tts-audio` (public, holds MP3 audio CDN cache with public upload policy)

Env Vars (Vercel + `.env.local`):

- `DEEPGRAM_API_KEY` (using "onesimos" key, expires Sep 4, 2026)
- `ELEVENLABS_API_KEY` (wired for 0.85x slower multilingual audio)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` (LLM failover)
- `SENTRY_DSN` (for error tracking, verify installed)

═══════════════════════════════════════════════════════════════════
SECTION 10: LESSONS LEARNED (Workflow Friction Solved)
═══════════════════════════════════════════════════════════════════

1. PowerShell wildcard bracket bug: `git add app/kid/[childId]/page.tsx` silently fails because PowerShell treats brackets as wildcards. ALWAYS use `git add .` for files with brackets in path.

2. Vim escape trap: When Git opens a merge commit editor in Vim, press `Esc`, type `:wq`, press `Enter`.

3. Non-fast-forward rejection recovery:

If uncommitted changes block the pull, commit local first, then pull, then push.

4. Font weight fallback trap: The `font-logo` custom font only has one weight. Adding `font-extrabold` or `tracking-wider` forces browser to fall back to `font-achiko` (chunky). Keep logo styling minimal.

5. Supabase ghost tables: Never assume a table exists. Ask founder for a Table Editor screenshot before writing queries.

6. VS Code Problems panel is the ground truth: Orange folder + number badge = TypeScript or Tailwind errors. Ctrl+Shift+M opens the Problems panel. Fix before shipping.

7. Tailwind conflict warnings matter: `inline-flex` + `block` on same element throws warnings and unpredictable rendering. Pick one layout mode.

8. Serverless functions kill un-awaited background tasks: In Vercel serverless (`/api/tts/route.ts`), background async tasks like `void uploadToSupabase()` get terminated before completion unless explicitly `await`ed.

9. Supabase Storage RLS Policy: Buckets require an explicit public policy (Allow public uploads with `INSERT`, `SELECT`, `UPDATE` checked for `anon` and `authenticated`) for uploads to succeed from anon clients.

10. ElevenLabs speed tuning: `speed: 0.85` inside `voice_settings` creates a warm, slow, clear pronunciation that kids aged 3-9 love.

11. Deepgram is not the problem: When words seem uncaught, the bug is in our diffing logic or Supabase writes, NOT Deepgram. Deepgram Nova-2 catches virtually everything.

12. Kids under 6 need MUCH slower TTS: 0.85x speed is the sweet spot. Anything faster stresses them; anything slower feels condescending.

═══════════════════════════════════════════════════════════════════
SECTION 11: FRESH SESSION KICKOFF PROTOCOL
═══════════════════════════════════════════════════════════════════

When a new session starts:

1. Do NOT restart the project. Do NOT ask founder to re-paste code.
2. Acknowledge you have read this document by summarizing the current state in 3 bullet points.
3. Confirm the CURRENT ACTIVE TASK (see Section 5).
4. Ask founder if they want to continue with the current task or switch focus.
5. For each file change: inspect first via `Get-Content -LiteralPath "..." -Encoding UTF8`, deliver the full file, provide Git commands with `git add .`, provide test instructions, wait for confirmation.

═══════════════════════════════════════════════════════════════════
SECTION 12: LAUNCH READINESS CHECKLIST
═══════════════════════════════════════════════════════════════════

Before public marketing launch:
[ ] Phonics Sound Lab shipped and tested
[ ] Terms of Service, Privacy Policy, Cookie Policy, Refund Policy published
[ ] COPPA + GDPR-K compliance statements added to Privacy Policy
[ ] NDPR (Nigeria) registration filed with NITDA
[ ] Sentry error tracking verified in production
[ ] Rate limiting added to all `/api/*` routes
[ ] Paystack webhook signature verification implemented
[ ] Backup / disaster recovery plan documented
[ ] End-to-end smoke test: signup → onboarding → kid reads story → parent views report → payment upgrade → child reads unlimited
[ ] Custom domain purchased (recommend `onesimos.com` or `onesimos.app`) and SSL verified
[ ] Marketing landing page copy finalized
[ ] Social media accounts created (Instagram, TikTok, X/Twitter, WhatsApp Business)
[ ] School proposal PDF template drafted
[ ] Press release drafted for Nigerian tech blogs (TechCabal, Techpoint, BenjaminDada)

Post-Launch:
[ ] Monitor Sentry daily for first 30 days
[ ] Weekly review of Paystack revenue vs API cost
[ ] Bi-weekly parent feedback survey via email
[ ] Monthly `npm audit` and dependency updates
[ ] Quarterly review of Supabase storage growth and CDN cache size

═══════════════════════════════════════════════════════════════════
END OF HANDOFF (TIME CAPSULE v3.0)
═══════════════════════════════════════════════════════════════════
