═══════════════════════════════════════════════════════════════════
PROJECT: Onesimos, Living Reading Companion (ages 3 to 9)
SESSION HANDOFF, Post Priority 1 + Priority 2 + Priority 3 + Spelling & Pricing Strategy
═══════════════════════════════════════════════════════════════════

STACK: Next.js 14 App Router · TypeScript · Tailwind · Supabase · Deepgram (STT) · ElevenLabs (Aura Fallback) · Paystack · Vercel

FOUNDER: Mitchel · Windows · VS Code · PowerShell · GitHub · Vercel · Supabase
LIVE URL: https://onesimos.vercel.app
REPO: https://github.com/onesimoss/onesimos.git
BRANCH: main

MISSION: Teach kids to read well AND understand well (comprehension ~80% is the academic success threshold).

MOAT (Do not dilute these three pillars):

1. AI Living Story Book (labeled "Living Chapter" or "Personal Chapter")
2. Speech-to-Text stumbled word capture (Deepgram)
3. 25 Core Life Skills threaded into every generated chapter

───────────────────────────────────────────────────────────────────
PRICING, UNIT ECONOMICS & NIGERIAN MARKET STRATEGY
───────────────────────────────────────────────────────────────────

PRICING MATRIX (PAYSTACK NGN + INT CARDS):

1. Free Trial: ₦0 (5 stories/mo, 2 spelling rounds/day)
2. Single Reader: ₦2,500 / mo OR ₦19,999 / yr (~$24/yr)
3. Family Plan (Strictly up to 4 kids): ₦5,000 / mo OR ₦39,999 / yr (~$48/yr)
4. Extended Family / Daycare Plan (Up to 10 kids): ₦15,000 / mo OR ₦119,999 / yr
5. School Classroom Plan (Up to 30 students): ₦30,000 / term OR ₦85,000 / yr (~$90/yr)
6. Whole School License (Up to 200 students): ₦150,000 / term OR ₦400,000 / yr

UNIT ECONOMICS (PER ACTIVE CHILD / MONTH):

- STT (Deepgram Nova-2): ~120 mins reading = ~$0.51 USD (₦800 NGN)
- TTS (ElevenLabs + Supabase CDN Cache): ~90% cache hit rate = ~$0.10 USD (₦160 NGN)
- LLM (Groq / Gemini / OpenRouter): ~$0.05 USD (₦80 NGN)
- Total API Cost / Active Child: ~₦1,040 NGN / month
- Single Child Margin @ ₦2,500 = 58% Profit Margin

6-MONTH FINANCIAL PROJECTION (1,000 ACCOUNTS CONVERSION):

- 600 Single Readers @ ₦2,500/mo = ₦9,000,000 NGN
- 300 Family Accounts @ ₦5,000/mo = ₦9,000,000 NGN
- 100 School Classrooms @ ₦30,000/term (2 terms) = ₦6,000,000 NGN
- Gross 6-Month Revenue: ₦24,000,000 NGN (~$15,500 USD)
- Direct API Costs: ₦13,860,000 NGN
- Cumulative Net Profit: ₦10,140,000 NGN (~$6,500 USD)

NIGERIA MARKET POTENTIAL:

- 80,000+ private primary schools in Nigeria (18,000+ in Lagos State).
- Target: 400 schools (1,200 classrooms) @ ₦30,000/term = ₦108 Million NGN / year ARR.

───────────────────────────────────────────────────────────────────
NON-NEGOTIABLE FONTS & TYPOGRAPHY (LOCKED, DO NOT VIOLATE)
───────────────────────────────────────────────────────────────────
• ONESIMOS Wordmark: `font-logo` class (rendered as "Onesimos" in small caps on Kid Dashboard per founder call).
• Headings AND "Hi [Child Name]!" greeting: `font-achiko`
• Body, buttons, cards, badges, descriptions, STAT NUMBERS: `font-switzer`
• Stat numbers style: `font-switzer text-2xl font-black leading-none` (or `text-2xl sm:text-3xl` for larger report cards). Never use `font-achiko` for numbers.
• Reading Age format on Child Report cards: use `.replace("years", "yrs")` so "7 to 8 yrs" fits cleanly inside boxed cards. On Parent Dashboard cards, "7 to 8 years" is fine.
• Reading Age format everywhere else: "7 to 8 years" (never "7.0 - 8.0 years", never use hyphen ranges).
• NEVER use em dashes (—) or en dashes (–) anywhere. Use commas, colons, periods, or rewrite.
• NO stray mouse/cursor icons or decorative junk.
• Avatar always uses `.color` and `.imageUrl`, NEVER `bgColor` or `src`.
• Print-only screens hide navigation with `print:hidden` Tailwind utility.

───────────────────────────────────────────────────────────────────
NON-NEGOTIABLE OPERATING RULES
───────────────────────────────────────────────────────────────────

1. ONE FULL FILE AT A TIME. Never partial edits, never "add this line". Deliver the complete file every time.
2. Exact Git push commands after EVERY file delivery. Format:

(Use `git add .` because PowerShell treats square brackets in paths like `app/kid/[childId]/page.tsx` as wildcards and silently ignores the file.) 3. Inspection commands (`Get-Content -LiteralPath "..." -Encoding UTF8`) BEFORE editing any unfamiliar file. Never assume. 4. Pro code standards: file header JSDoc, section dividers (`// ─── Section N ───`), strict TypeScript, zero `any`, JSDoc on public functions. 5. No AI fluff. Weigh founder ideas with Strength / Risk / Verdict framing. 6. TEST FIRST rule: always provide clear test instructions BEFORE moving to the next item. 7. Comeback / Handoff prompt at every major milestone. Robust, matching this document's depth. 8. Every response ends with a clear "What's Next" instruction. 9. Never ask founder to re-paste code you can inspect via PowerShell. 10. When founder says "stop the comeback prompt spam", respect it until next milestone. 11. Git merge conflicts: when push is rejected as non-fast-forward, use `git pull origin main --no-rebase` (if VS Code opens Vim, press Esc then type `:wq` then Enter). If uncommitted changes block the pull, commit local changes first, then pull, then push. 12. VS Code "orange folder + number" means TypeScript/Tailwind errors. Founder can share them via the Problems panel (Ctrl+Shift+M), then we fix them cleanly. 13. Supabase table verification: before assuming a table exists, ask founder for a Table Editor screenshot. Do not code against ghost tables. (Real story: `stumbled_words` table did not exist, only `stumbled_words_log` did. This blocked Word Pocket for weeks until founder shared the screenshot.)

───────────────────────────────────────────────────────────────────
BUILD STATUS: EVERYTHING SHIPPED THIS SESSION (17 MAJOR FIXES)
───────────────────────────────────────────────────────────────────

✅ SHIPPED THIS SESSION:

1. **Kid Dashboard Logo Fix (Fix A):** Small caps "Onesimos" using `font-logo`, matches homepage per founder final call.
2. **Bookshelf UI Limit (Fix C):** Kid Dashboard Bookshelf shows max 4 books with "See more (+X)" / "Show Less" toggle.
3. **Parent Dashboard Stats Typography (Fix B):** All WPM/Accuracy/Comprehend numbers now render as `font-switzer text-2xl font-black`. Empty WPM shows "n/a" not dash.
4. **Child Report Stats Typography (Fix B):** Four equal-height flex cards, "yrs" abbreviation for Reading Age, clean Switzer numbers.
5. **Deepgram STT Verbatim Config (STT Fix 1):** `smart_format: "false"`, `filler_words: "true"` in `/app/api/transcribe/route.ts` for literal word matching against storybook text.
6. **Stumble Precision Matcher (STT Fix 2):** In `lib/stumbledWords.ts`, words ≤5 letters require 100% exact match. Words 6+ letters need matching first letter and ≥88% Levenshtein similarity.
7. **Supabase Persistence Rescue (STT Fix 2):** Primary write goes to `stumbled_words_log` (VERIFIED to exist in schema). Secondary write to `stumbled_words` wrapped in try/catch (table does NOT exist in current DB, gracefully ignored).
8. **Resilient Fetch Fallback:** `getRecentStumbledWords()` tries `stumbled_words` first, then aggregates from `stumbled_words_log` if empty. This is what finally made Word Pocket populate.
9. **Async Persistence Guarantee (STT Fix 3):** `components/ReadAloudMic.tsx` uses `await Promise.all()` instead of fire-and-forget so stumbled words are DEFINITELY saved before UI updates.
10. **Always-Visible Word Pocket:** Kid Dashboard `🎒 Word Pocket` section is no longer gated by `recentWords.length > 0`. It shows permanently with a friendly empty-state placeholder card. Tap-to-hear renders on every populated word chip.
11. **Parent Dashboard Route Fix:** `/parent` was accidentally overwritten with Child Report code, causing "Loading report card..." infinite spin on all devices. Restored to correct multi-child dashboard.
12. **Summary Page Tailwind Conflict Fixed:** Line 508 had `inline-flex` + `block` on same element. Replaced with `flex items-center justify-center max-w-xs mx-auto`. VS Code Problems panel is clean (0 errors).
13. **Cross-Device ElevenLabs Cloud TTS (Bug T):** Tap-to-hear plays 0.85x slower multilingual ElevenLabs audio on iPhone Safari, Amazon Fire OS Silk, and PC via `/app/api/tts/route.ts` with Deepgram Aura fallback.
14. **Supabase CDN Audio Auto-Caching:** Every generated word audio automatically saves to `tts-audio` bucket in Supabase for $0 repeat cost.
15. **Honest Analytics Engine Repair (Bug 4):** Removed fake 100% comprehension fallback. Report card strictly reflects real quiz scores (0% failed quiz = real 0%, 50% partial = real 50%, 95% accuracy).
16. **Living Chapter Deduplication & Quizzes (Bug 1):** Dynamic 25-virtue scenario matrix prevents duplicate titles ("Spilled Bottle" gone). Every generated chapter includes 3 comprehension questions.
17. **Spelling Game Revamp (Bug 7):** 0.85x slower ElevenLabs audio, 50+ curriculum words per level, struggle-first priority queue, 1-hint max limit per round, unassisted word graduation to `mastered = true` (which removes word from active Word Pocket into trophy list!), and daily 2-round free quota limit.
18. **Living Chapters Auto-Archiving (Fix E):** Completed personal chapters on Child Report auto-archive into a collapsible drawer.
19. **Progress Story Timeline:** Child Report displays real-time chapter mastery history and Mastered Words Wall.

✅ SHIPPED IN PRIOR SESSIONS:

- Homepage polish (removed mouse icon, em-dashes, added CTA spacing, cleaned footer)
- Google OAuth on /signup and /login (Supabase + Google Cloud fully configured)
- Honest Analytics Engine: real WPM, real quiz accuracy, real comprehension % (no fake fallbacks)
- Print/Save PDF on Child Report with `@media print` styling
- Paystack integration (live NGN + international cards, test card: 4084 0840 8408 4081 / 12/28 / 408 / OTP 12345)
- Parent PIN gate + Child PIN
- Session budget: 20 min daily + 5 free stories monthly (paid tier removes limits)

───────────────────────────────────────────────────────────────────
OUTSTANDING MASTER CHECKLIST (Founder's Priority Queue)
───────────────────────────────────────────────────────────────────

🔴 PRIORITY 3 (Comprehension & Bookshelf Bugs, Remaining):

**[Bug 2 & 3 Fix Verification] Completed Stories Bookshelf Move.**
→ Summary page now immediately writes `completed_story: true` on mount. Verify catalog and Living Chapters move to My Bookshelf on Kid Home.

**[Bug 9] WPM math questionable for slow readers.**
→ Current formula: `(totalPages × 20 words/page) / (totalSeconds / 60)`.
→ Real fix: use actual word-by-word timing from Deepgram utterance data, not estimated words per page.
→ Deferred until paid Deepgram tier.

🟡 PRIORITY 4 (New UX Workflows):

**[Pricing Tier Update] Multi-Tier Paystack Checkout.**
→ Update `app/parent/pricing/page.tsx` & `lib/payments.ts` to support Single (₦2.5k), Family (₦5k), Extended Family (₦15k), and School (₦30k/term) plans.

**[Fix F] Kid-Favorited Stories.**
→ Requires: new Supabase table `favorite_stories` OR array column on `children`.
→ DO NOT START without founder go-ahead.

🟢 KID-FACING PSYCHOLOGY (Locked Decisions, Do Not Change):

- Kids get 2 stars even when they fail quiz. Motivation over metrics.
- Parents see REAL comprehension % on report (not the child-friendly 2 stars).
- Speech-to-Text edge cases (accents, quiet mics under 200 bytes) are accepted Deepgram limitations.
- Focus fixes on capture flow → storage → rendering, not chasing STT accuracy.

───────────────────────────────────────────────────────────────────
BACKLOG IDEAS (Founder-Approved Vision, DO NOT SHIP WITHOUT GO-AHEAD)
───────────────────────────────────────────────────────────────────

**Backlog Idea 1: The Onesimos Reading Ladder + Sound Lab (Phase M)**

_Scope:_ A 1000+ word curated spelling ladder across 10 progression tiers PLUS a kid-facing phonics playground (`/kid/[childId]/phonics`).

**Reading Ladder (10 Tiers, unlock as child levels up):**

1. Everyday Words
2. Action Words
3. Describing Words
4. Academic & Thinking Words
5. Advanced Everyday Words
6. Powerful Vocabulary Words
7. Strong Vocabulary Words
8. Advanced Vocabulary Words
9. Wider Vocabulary Words
10. Mastery Vocabulary Words

**Sound Lab (Kid-Facing Phonics Zone at `/kid/[childId]/phonics`):**
Interactive cards for each rule. Kid taps letter combo → hears sound + sample words.

1. Letter Sounds (A to Z)
2. Closed Syllables (Short Vowels, Glued Sounds NH/NK, Consonant Digraphs, Nasals)
3. Long Vowel Syllables (long a, e, i, o, u)
4. R-Controlled Vowels (ar, er, ir, or, ur)
5. Diphthongs (oi, oy, ou, ow, au, aw)
6. Wild Old Rule (old, ost, ild, ind)
7. Soft Consonants (soft c, soft g)

**Enhanced Tap-to-Hear Inside Word Pocket (Phonics Decoding Mode):**
Instead of just speaking the whole word, break it visually AND audibly into syllables/phonemes. Example: "boundaries → boun · da · ries" with each chunk highlighting.

_Strength:_ Turns Onesimos from companion into full curriculum. Justifies premium pricing.
_Verdict:_ SHIP AS PHASE M, after Pricing Tiers & Launch Smoke Test.

───────────────────────────────────────────────────────────────────
KEY FILE MAP (For Quick Inspection)
───────────────────────────────────────────────────────────────────

**Kid-Facing:**

- `app/kid/[childId]/page.tsx` (Kid Home)
- `app/kid/[childId]/read/[storyId]/page.tsx` (Active Reader)
- `app/kid/[childId]/summary/page.tsx` (Post-Story Quiz + Summary)
- `app/kid/[childId]/spell/page.tsx` (Spelling Game)

**Parent-Facing:**

- `app/parent/page.tsx` (Parent Dashboard, multi-child grid)
- `app/parent/child/[childId]/page.tsx` (Individual Child Report, with Print/PDF)
- `app/parent/pricing/page.tsx` (Paystack plans)

**Auth & Onboarding:**

- `app/signup/page.tsx`, `app/login/page.tsx` (Google OAuth wired)
- `app/onboarding/page.tsx`, `app/who/page.tsx`

**API Routes:**

- `app/api/transcribe/route.ts` (Deepgram STT, verbatim mode)
- `app/api/tts/route.ts` (ElevenLabs primary, Deepgram Aura fallback, Supabase CDN cache)
- `app/api/generate-living-story/route.ts` (Living Chapter LLM + 25-virtue matrix + quiz generator)
- `app/api/paystack/initialize/route.ts`, `app/api/paystack/verify/route.ts`

**Core Libraries:**

- `lib/sessionInsights.ts` (Honest analytics engine)
- `lib/stumbledWords.ts` (Deepgram stumble diffing, tap-to-hear, Supabase persistence with `stumbled_words_log` fallback)
- `lib/livingStory.ts` (Living Chapter CRUD)
- `lib/sampleStories.ts` (Static catalog)
- `lib/children.ts` (Profile CRUD)
- `lib/payments.ts` (Paystack)
- `lib/sessionBudget.ts` (Daily 20-min + monthly 5-story quota)
- `lib/parentGate.ts` (Parent PIN)
- `lib/geoNames.ts` (African/diaspora name detection)
- `lib/reminders.tsx` (Story-time notifications)
- `lib/avatars.ts` (Kid avatar library)
- `lib/lifeSkills.ts` (25 Core Virtues catalog)

**Components:**

- `components/ReadAloudMic.tsx` (Mic capture + Deepgram POST + async stumble save)
- `components/ReadingTimer.tsx`, `components/ParentGate.tsx`, `components/LogoutButton.tsx`

**Supabase Schema (Verified):**

- `children`, `profiles`, `parent_subscriptions`
- `reading_sessions`, `sessions`, `stories`, `generated_stories`
- `stumbled_words_log` ✅ EXISTS (primary word capture)
- `stumbled_words` ❌ DOES NOT EXIST (code handles this gracefully via try/catch and log fallback)
- `mastered_words`, `daily_progress`
- Storage Bucket: `tts-audio` (public, holds MP3 audio CDN cache)

**Env Vars (Vercel + `.env.local`):**

- `DEEPGRAM_API_KEY` (using "onesimos" key, expires Sep 4, 2026)
- `ELEVENLABS_API_KEY` (wired in Vercel + `.env.local` for 0.85x slower audio)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` (LLM failover)

───────────────────────────────────────────────────────────────────
LESSONS LEARNED (Workflow Friction Solved This Session)
───────────────────────────────────────────────────────────────────

1. **PowerShell wildcard bracket bug:** `git add app/kid/[childId]/page.tsx` silently fails because PowerShell treats brackets as wildcards. ALWAYS use `git add .` for files with brackets in path.

2. **Vim escape trap:** When Git opens a merge commit editor in Vim, press `Esc`, type `:wq`, press `Enter`.

3. **Non-fast-forward rejection recovery:**

4. **Font weight fallback trap:** The `font-logo` custom font only has one weight. Keep logo styling minimal: `font-logo text-3xl md:text-4xl tracking-tight` only.

5. **Supabase ghost tables:** Never assume a table exists. Ask founder for a Table Editor screenshot before writing queries.

6. **VS Code Problems panel is the ground truth:** Orange folder + number badge = TypeScript or Tailwind errors. Ctrl+Shift+M opens the Problems panel. Fix these before shipping.

7. **Serverless functions kill un-awaited background tasks:** In Vercel serverless environment (`/api/tts/route.ts`), background async tasks like `void uploadToSupabase()` get terminated before completion unless explicitly `await`ed.

8. **Supabase Storage RLS Policy:** Buckets require an explicit public policy (`Allow public uploads` with `INSERT`, `SELECT`, `UPDATE` checked for `anon` and `authenticated`) for uploads to succeed from anon clients.

9. **ElevenLabs speed tuning:** `speed: 0.85` inside `voice_settings` creates a warm, slow, clear pronunciation that kids aged 3-9 love.

───────────────────────────────────────────────────────────────────
FRESH SESSION KICKOFF PROTOCOL
───────────────────────────────────────────────────────────────────

When a new session starts:

1. Do NOT restart the project. Do NOT ask founder to re-paste code.
2. Acknowledge you have read this document by summarizing the current state in 3 bullet points.
3. Ask founder which item from the Outstanding Master Checklist to tackle first.

═══════════════════════════════════════════════════════════════════
END OF HANDOFF
═══════════════════════════════════════════════════════════════════
