═══════════════════════════════════════════════════════════════════
PROJECT: Onesimos, Living Reading Companion (ages 3 to 9)
SESSION HANDOFF, Post Priority 1 + Priority 2 Word Pocket Recovery
═══════════════════════════════════════════════════════════════════
STACK: Next.js 14 App Router · TypeScript · Tailwind · Supabase · Deepgram (STT) · Groq/Gemini/OpenRouter LLM Failover · Paystack · Vercel
FOUNDER: Mitchel · Windows · VS Code · PowerShell · GitHub · Vercel · Supabase
LIVE URL: https://onesimos.vercel.app
REPO: https://github.com/onesimoss/onesimos.git
BRANCH: main
MISSION: Teach kids to read well AND understand well (comprehension around 80% is the academic success threshold).
MOAT (Do not dilute these three pillars):
AI Living Story Book (now labeled "Living Chapter" or "Personal Chapter" in UI)
Speech-to-Text stumbled word capture (Deepgram)
25 Core Life Skills threaded into every generated chapter
───────────────────────────────────────────────────────────────────
NON-NEGOTIABLE FONTS & TYPOGRAPHY (LOCKED, DO NOT VIOLATE)
───────────────────────────────────────────────────────────────────
• ONESIMOS Wordmark: font-logo class (must match homepage /app/page.tsx hero exactly). Currently rendered as "Onesimos" in small caps on Kid Dashboard per founder final call.
• Headings AND "Hi [Child Name]!" greeting: font-achiko
• Body, buttons, cards, badges, descriptions, STAT NUMBERS: font-switzer
• Stat numbers style: font-switzer text-2xl font-black leading-none (or text-2xl sm:text-3xl for larger reports). Never use font-achiko for numbers.
• Reading Age format on Child Report cards: use .replace("years", "yrs") so "7 to 8 yrs" fits inside boxed cards. On Parent Dashboard cards, "7 to 8 years" is fine.
• Reading Age format everywhere else: "7 to 8 years" (never "7.0 - 8.0 years", never use hyphen ranges).
• NEVER use em dashes (—) or en dashes (–) anywhere. Use commas, colons, periods, or rewrite.
• NO stray mouse/cursor icons or decorative junk.
• Avatar always uses .color and .imageUrl, NEVER bgColor or src.
• Print-only screens hide navigation with print:hidden Tailwind utility.
───────────────────────────────────────────────────────────────────
NON-NEGOTIABLE OPERATING RULES
───────────────────────────────────────────────────────────────────
ONE FULL FILE AT A TIME. Never partial edits, never "add this line". Deliver the complete file every time.
Exact Git push commands after EVERY file delivery. Format:
text
git add .
git commit -m "Descriptive message"
git push origin main
(Use git add . because PowerShell treats square brackets in paths like app/kid/[childId]/page.tsx as wildcards and silently ignores the file.)
Inspection commands (Get-Content -LiteralPath "..." -Encoding UTF8) BEFORE editing any unfamiliar file. Never assume.
Pro code standards: file header JSDoc, section dividers (// ─── Section N ───), strict TypeScript, zero any, JSDoc on public functions.
No AI fluff. Weigh founder ideas with Strength / Risk / Verdict framing.
TEST FIRST rule: always provide clear test instructions BEFORE moving to the next item.
Comeback / Handoff prompt at every major milestone. Robust, matching this document's depth.
Every response ends with a clear "What's Next" instruction.
Never ask founder to re-paste code you can inspect via PowerShell.
When founder says "stop the comeback prompt spam", respect it until next milestone.
Git merge conflicts: when push is rejected as non-fast-forward, use git pull origin main --no-rebase (if VS Code opens Vim, press Esc then type :wq then Enter). If uncommitted changes block the pull, commit local changes first, then pull, then push.
VS Code "orange folder + number" means TypeScript/Tailwind errors. Founder can share them via the Problems panel (Ctrl+Shift+M), then we fix them cleanly.
Supabase table verification: before assuming a table exists, ask founder for a Table Editor screenshot. Do not code against ghost tables. (Real story: stumbled_words table did not exist, only stumbled_words_log did. This blocked Word Pocket for weeks until founder shared the screenshot.)
───────────────────────────────────────────────────────────────────
BUILD STATUS: Phases A through L COMPLETE + Priority 1 + Priority 2 (partial) SHIPPED
───────────────────────────────────────────────────────────────────
CURRENT STATE (as of latest push):
✅ SHIPPED THIS SESSION:
Kid Dashboard Logo Fix (Fix A): Small caps "Onesimos" using font-logo, matches homepage per founder final call.
Bookshelf UI Limit (Fix C): Kid Dashboard Bookshelf shows max 4 books with "See more (+X)" / "Show Less" toggle.
Parent Dashboard Stats Typography (Fix B): All WPM/Accuracy/Comprehend numbers now render as font-switzer text-2xl font-black. Empty WPM shows "n/a" not dash.
Child Report Stats Typography (Fix B): Four equal-height flex cards, "yrs" abbreviation for Reading Age, clean Switzer numbers.
Deepgram Verbatim Config (STT Fix 1): smart_format: "false", filler_words: "true" in /app/api/transcribe/route.ts for literal word matching against storybook text.
Stumble Precision Matcher (STT Fix 2): In lib/stumbledWords.ts, words ≤5 letters require 100% exact match. Words 6+ letters need matching first letter and ≥88% Levenshtein similarity.
Supabase Persistence Rescue (STT Fix 2): Primary write goes to stumbled_words_log (VERIFIED to exist in schema). Secondary write to stumbled_words wrapped in try/catch (table does NOT exist in current DB, gracefully ignored).
Resilient Fetch Fallback: getRecentStumbledWords() tries stumbled_words first, then aggregates from stumbled_words_log if empty. This is what finally made Word Pocket populate.
Async Persistence Guarantee (STT Fix 3): components/ReadAloudMic.tsx uses await Promise.all() instead of fire-and-forget so stumbled words are DEFINITELY saved before UI updates.
Always-Visible Word Pocket: Kid Dashboard 🎒 Word Pocket section is no longer gated by recentWords.length > 0. It shows permanently with a friendly empty-state placeholder card. Tap-to-hear renders on every populated word chip.
Parent Dashboard Route Fix: /parent was accidentally overwritten with Child Report code, causing "Loading report card..." infinite spin on all devices. Restored to correct multi-child dashboard.
Summary Page Tailwind Conflict Fixed: Line 508 had inline-flex + block on same element. Replaced with flex items-center justify-center max-w-xs mx-auto. VS Code Problems panel is now clean (0 errors).
✅ SHIPPED IN PRIOR SESSIONS:
Homepage polish (removed mouse icon, em-dashes, added CTA spacing, cleaned footer)
Google OAuth on /signup and /login (Supabase + Google Cloud fully configured)
Honest Analytics Engine: real WPM, real quiz accuracy, real comprehension % (no fake fallbacks)
Print/Save PDF on Child Report with @media print styling
Paystack integration (live NGN + international cards, test card: 4084 0840 8408 4081 / 12/28 / 408 / OTP 12345)
Parent PIN gate + Child PIN
Session budget: 20 min daily + 5 free stories monthly (paid tier removes limits)
───────────────────────────────────────────────────────────────────
OUTSTANDING MASTER CHECKLIST (Founder's Priority Queue)
───────────────────────────────────────────────────────────────────
🔴 PRIORITY 2 (STT Engine, Remaining):
[Bug T] Tap-to-Hear Broken on iPhone Safari & Amazon Fire OS (Silk)
→ Cause: Web Speech API speechSynthesis has broken/restricted support on iOS Safari and Silk browsers.
→ Fix Options:
A. Preload MP3 phoneme audio clips to Supabase Storage bucket, play via <audio> element.
B. Call cloud TTS API (Deepgram Aura, Google TTS, or ElevenLabs), return audio blob, play in <audio>.
→ Recommendation: Option B. Deepgram Aura is already in the stack, one API vendor.
→ File: lib/stumbledWords.ts (speakWord function), add /app/api/tts/route.ts.
🔴 PRIORITY 3 (Comprehension & Bookshelf Bugs):
[Bug 1] Living Stories don't have comprehension quiz but still award 2 stars.
→ Fix: Extend LLM prompt in app/api/generate-living-story/route.ts to include 2-3 comprehension questions.
→ Verify: lib/livingStory.ts persists questions into generated_stories.story_data.questions.
[Bug 2] Completed Living Stories do NOT move to Bookshelf.
→ Cause: Session save on Living Story completion may not write correct story_id (Supabase UUID vs static ID mismatch).
→ File: app/kid/[childId]/summary/page.tsx (session save logic).
[Bug 3] Regular catalog stories also not moving to Bookshelf after completion.
→ Same root cause as Bug 2. Fix once, applies to both.
[Bug 4] Comprehension shows 100% for kids who intentionally failed quiz.
→ Root cause: Old sessions with quiz_accuracy = null fall back to "completed = 100%" logic.
→ Debug: Verify reading_sessions.quiz_accuracy column exists in Supabase. If missing, run:
sql ALTER TABLE reading_sessions ADD COLUMN IF NOT EXISTS quiz_accuracy INTEGER;
→ File: lib/sessionInsights.ts (computeReportCardStats).
[Bug 9] WPM math questionable for slow readers.
→ Current formula: (totalPages × 20 words/page) / (totalSeconds / 60).
→ Real fix: use actual word-by-word timing from Deepgram utterance data, not estimated words per page.
→ Deferred until paid Deepgram tier.
🟡 PRIORITY 4 (New UX Workflows):
[Fix E] Auto-Archive Read Living Chapters on Child Report.
→ File: app/parent/child/[childId]/page.tsx
→ Logic: filter generated stories, hide/collapse those with matching completed_story = true session.
→ Founder wants read chapters archived so parents see fresh chapters to preview.
[Progress Story] Mastery Narrative Timeline on Parent Report (NEW, high impact).
→ This is the trust-building feature founder called out.
→ Design: Report shows "On Sep 12 you generated a book about Self Confidence targeting words boundaries, whisper, courage. Chinedu has mastered boundaries and whisper. Courage still needs practice."
→ Requires: (a) generated_stories already stores target words via extractTargetWordsFromStory ✅, (b) mastered_words table exists in Supabase ✅, (c) write to mastered_words when child spells or reads word correctly (NEW WORK), (d) render narrative on Child Report (NEW WORK).
→ Verdict: SHIP RIGHT AFTER Bugs 1-4 are cleared.
[Fix F] Kid-Favorited Stories.
→ Requires: new Supabase table favorite_stories OR array column on children.
→ DO NOT START without founder go-ahead.
🟢 KID-FACING PSYCHOLOGY (Locked Decisions, Do Not Change):
Kids get 2 stars even when they fail quiz. Motivation over metrics.
Parents see REAL comprehension % on report (not the child-friendly 2 stars).
Speech-to-Text edge cases (accents, quiet mics under 200 bytes) are accepted Deepgram limitations.
Focus fixes on capture flow → storage → rendering, not chasing STT accuracy.
───────────────────────────────────────────────────────────────────
BACKLOG IDEAS (Founder-Approved Vision, DO NOT SHIP WITHOUT GO-AHEAD)
───────────────────────────────────────────────────────────────────
Backlog Idea 1: The Onesimos Reading Ladder + Sound Lab
Scope: A 1000+ word curated spelling ladder across 10 progression tiers PLUS a kid-facing phonics playground.
Reading Ladder (10 Tiers, unlock as child levels up):
Everyday Words
Action Words
Describing Words
Academic & Thinking Words
Advanced Everyday Words
Powerful Vocabulary Words
Strong Vocabulary Words
Advanced Vocabulary Words
Wider Vocabulary Words
Mastery Vocabulary Words
Sound Lab (Kid-Facing Phonics Zone at /kid/[childId]/phonics):
Interactive cards for each rule. Kid taps letter combo → hears sound + sample words.
Letter Sounds (A to Z)
Closed Syllables (Short Vowels, Glued Sounds NH/NK, Consonant Digraphs, Nasals)
Long Vowel Syllables (long a, e, i, o, u)
R-Controlled Vowels (ar, er, ir, or, ur)
Diphthongs (oi, oy, ou, ow, au, aw)
Wild Old Rule (old, ost, ild, ind)
Soft Consonants (soft c, soft g)
Enhanced Tap-to-Hear Inside Word Pocket (Phonics Decoding Mode):
Instead of just speaking the whole word, break it visually AND audibly into syllables/phonemes. Example: "boundaries → boun · da · ries" with each chunk highlighting.
Optional Parent PDF: Phonics Cheat Sheet printable, bundled with Report Card PDF pack. Bonus, not primary.
Strength: Turns Onesimos from companion into full curriculum. Justifies premium pricing. Solves empty-Word-Pocket spelling problem with depth.
Risk: 3 to 5 days of build work. Do not start until Priority 3 bugs are cleared.
Verdict: SHIP AS PHASE M, after Priority 3. Position as "The Reading Ladder" + "Sound Lab", unlocked as kid levels up.
Backlog Idea 2: Parent Trust Report Card Upgrade
Scope: Two-part upgrade to the Child Report to make it the strongest parent-trust artifact in the product.
Part A: Auto-Archive Read Living Chapters (already scheduled as Fix E above).
Part B: Mastery Narrative Timeline ("Progress Story"):
Report page shows dated entries:
"On Sep 12 you generated a book about Self Confidence targeting words boundaries, whisper, courage. Chinedu has now mastered boundaries and whisper. Courage still needs practice."
"On Sep 14 you generated a book about Kindness targeting words gentle, generous, empathy. Chinedu has mastered all three! Ready for the next challenge."
Also show progress states:
When mastered: "Child has mastered words 1, 2, 3"
When still struggling: "Child still needs practice with words 1, 2, 3"
Data Pipeline Requirements:
generated_stories.story_data.targetWords[] ✅ already implemented
mastered_words table in Supabase ✅ already exists
Write to mastered_words when child spells word correctly in Spelling Game OR reads it without stumbling in later session (NEW WORK)
Render "Progress Story" narrative section on /parent/child/[childId] (NEW WORK)
Strength: This is THE feature that makes parents forward the report to grandma. It converts monthly subscribers to annual subscribers. Highest trust-building feature in the product.
Risk: Requires disciplined data writes. If mastered_words writes are unreliable, narrative becomes noise.
Verdict: SHIP AS PRIORITY 4 IMMEDIATELY AFTER Priority 3 is done.
───────────────────────────────────────────────────────────────────
KEY FILE MAP (For Quick Inspection)
───────────────────────────────────────────────────────────────────
Kid-Facing:
app/kid/[childId]/page.tsx (Kid Home)
app/kid/[childId]/read/[storyId]/page.tsx (Active Reader)
app/kid/[childId]/summary/page.tsx (Post-Story Quiz + Summary)
app/kid/[childId]/spell/page.tsx (Spelling Game)
Parent-Facing:
app/parent/page.tsx (Parent Dashboard, multi-child grid)
app/parent/child/[childId]/page.tsx (Individual Child Report, with Print/PDF)
app/parent/pricing/page.tsx (Paystack plans)
Auth & Onboarding:
app/signup/page.tsx, app/login/page.tsx (Google OAuth wired)
app/onboarding/page.tsx, app/who/page.tsx
API Routes:
app/api/transcribe/route.ts (Deepgram STT, verbatim mode)
app/api/generate-living-story/route.ts (Living Chapter LLM)
app/api/paystack/initialize/route.ts, app/api/paystack/verify/route.ts
Core Libraries:
lib/sessionInsights.ts (Honest analytics engine)
lib/stumbledWords.ts (Deepgram stumble diffing, tap-to-hear, Supabase persistence with stumbled_words_log fallback)
lib/livingStory.ts (Living Chapter CRUD)
lib/sampleStories.ts (Static catalog)
lib/children.ts (Profile CRUD)
lib/payments.ts (Paystack)
lib/sessionBudget.ts (Daily 20-min + monthly 5-story quota)
lib/parentGate.ts (Parent PIN)
lib/geoNames.ts (African/diaspora name detection)
lib/reminders.tsx (Story-time notifications)
lib/avatars.ts (Kid avatar library)
lib/lifeSkills.ts (25 Core Virtues catalog)
Components:
components/ReadAloudMic.tsx (Mic capture + Deepgram POST + async stumble save)
components/ReadingTimer.tsx, components/ParentGate.tsx, components/LogoutButton.tsx
Supabase Schema (Verified):
children, profiles, parent_subscriptions
reading_sessions, sessions, stories, generated_stories
stumbled_words_log ✅ EXISTS (primary word capture)
stumbled_words ❌ DOES NOT EXIST (code handles this gracefully via try/catch)
mastered_words, daily_progress
Env Vars (Vercel + .env.local):
DEEPGRAM_API_KEY (using "onesimos" key, expires Sep 4, 2026)
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
PAYSTACK_SECRET_KEY, NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
GROQ_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY (LLM failover)
───────────────────────────────────────────────────────────────────
LESSONS LEARNED (Workflow Friction Solved This Session)
───────────────────────────────────────────────────────────────────
PowerShell wildcard bracket bug: git add app/kid/[childId]/page.tsx silently fails because PowerShell treats brackets as wildcards. ALWAYS use git add . for files with brackets in path.
Vim escape trap: When Git opens a merge commit editor in Vim, press Esc, type :wq, press Enter. Founder got stuck here once.
Non-fast-forward rejection recovery:
text
git pull origin main --no-rebase
git push origin main
If uncommitted changes block the pull, commit local first:
text
git add .
git commit -m "Save local changes"
git pull origin main --no-rebase
git push origin main
Font weight fallback trap: The font-logo custom font only has one weight. Adding font-extrabold or tracking-wider forces browser to fall back to font-achiko (which is chunky). Keep logo styling minimal: font-logo text-3xl md:text-4xl tracking-tight only.
Supabase ghost tables: Never assume a table exists. Ask founder for a Table Editor screenshot before writing queries. stumbled_words did not exist for weeks and silently broke Word Pocket.
VS Code Problems panel is the ground truth: Orange folder + number badge = TypeScript or Tailwind errors. Ctrl+Shift+M opens the Problems panel. Fix these before shipping.
Tailwind conflict warnings matter: inline-flex + block on the same element throws warnings and unpredictable rendering. Pick one layout mode.
Small caps trick: When custom fonts don't render uppercase correctly, use lowercase text + CSS text-transform: uppercase or small-caps. Founder chose lowercase "Onesimos" as the final logo rendering.
Deepgram is working perfectly. 1 hour 26 minutes of transcription logged in Sep 9-16 window. If words seem uncaught, the bug is in our diffing logic or Supabase writes, NOT Deepgram.
───────────────────────────────────────────────────────────────────
FRESH SESSION KICKOFF PROTOCOL
───────────────────────────────────────────────────────────────────
When a new session starts:
Do NOT restart the project. Do NOT ask founder to re-paste code.
Acknowledge you have read this document by summarizing the current state in 3 bullet points.
Ask founder which item from the Outstanding Master Checklist to tackle first.
Recommended attack order:
Bug T (Tap-to-Hear on iOS/Fire) — moat critical
Bug 4 (Comprehension deception) — trust critical
Bugs 2 + 3 (Bookshelf move) — UX critical
Bug 1 (Living Story quiz generation) — feature parity
Fix E (Auto-archive read chapters) — parent UX
Progress Story (Mastery Narrative) — trust-building moat
For each bug: inspect the file first via Get-Content -LiteralPath "..." -Encoding UTF8, deliver the full file, provide Git commands with git add ., provide test instructions, wait for confirmation.
Only after Priority 3 + Priority 4 are clear should you propose starting Backlog Idea 1 (Reading Ladder + Sound Lab).
═══════════════════════════════════════════════════════════════════
END OF HANDOFF
═══════════════════════════════════════════════════════════════════
