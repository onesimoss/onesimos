═══════════════════════════════════════════════════════════════════
PROJECT: Onesimos, Living Reading Companion (ages 3 to 9)
SESSION HANDOFF, Post Priority 1 + Priority 2 + Spelling Mastery Polish
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
NON-NEGOTIABLE FONTS & TYPOGRAPHY (LOCKED, DO NOT VIOLATE)
───────────────────────────────────────────────────────────────────
• ONESIMOS Wordmark: `font-logo` class (small caps "Onesimos" on Kid Dashboard per founder call).
• Headings AND "Hi [Child Name]!" greeting: `font-achiko`
• Body, buttons, cards, badges, descriptions, STAT NUMBERS: `font-switzer`
• Stat numbers style: `font-switzer text-2xl font-black leading-none`
• Reading Age format on Child Report cards: use `.replace("years", "yrs")` so "7 to 8 yrs" fits cleanly.
• NEVER use em dashes (—) or en dashes (–) anywhere. Use commas, colons, periods, or rewrite.
• Avatar always uses `.color` and `.imageUrl`, NEVER `bgColor` or `src`.

───────────────────────────────────────────────────────────────────
BUILD STATUS: SHIPPED THIS SESSION
───────────────────────────────────────────────────────────────────
✅ 1. **Cross-Device ElevenLabs Cloud TTS:** Tap-to-hear plays 0.85x slower multilingual ElevenLabs audio on iPhone Safari, Amazon Fire OS Silk, and PC.
✅ 2. **Supabase CDN Audio Auto-Caching:** Generated word audio automatically saves to `tts-audio` bucket in Supabase for $0 repeat cost.
✅ 3. **Honest Analytics Repair (Bug 4):** Removed fake 100% comprehension fallback. Report card strictly reflects real quiz scores (0% failed quiz = real 0%).
✅ 4. **Living Chapter Deduplication & Quizzes (Bug 1):** Dynamic 25-virtue scenario matrix prevents duplicate titles ("Spilled Bottle" gone). Every generated chapter includes 3 comprehension questions.
✅ 5. **Spelling Game Hint Budget & Graduation:** Kids get max 1 hint per round. Unassisted correct spelling marks word as `mastered = true`, graduating it out of the active Word Pocket into the Trophy List!
✅ 6. **Always-Visible Word Pocket:** Word Pocket shows permanently with a friendly empty-state card when 0 words exist.

───────────────────────────────────────────────────────────────────
NEXT STEPS / PRIORITIES
───────────────────────────────────────────────────────────────────

1. **Bugs 2 & 3:** Completed catalog stories and Living Chapters bookshelf transition.
2. **Fix E:** Auto-archive read Living Chapters on Child Report page.
3. **Progress Story / Mastery Narrative:** Parent report card timeline showing mastered words and active struggle words.
4. **Phase M (Backlog):** The Onesimos Reading Ladder (1000+ words across 10 tiers) + Sound Lab Phonics Zone (`/kid/[childId]/phonics`).
