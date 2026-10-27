# ONESIMOS ARCHITECTURAL TIME CAPSULE & DEVELOPER HANDOFF (HANDOFF.md)

**Corporate Entity:** Example Mirror Ltd (Abuja, Nigeria – CAC Registered)
**Production Domain:** https://onesimos.app
**Infrastructure Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL, Deepgram Nova-2, ElevenLabs, Resend SMTP, Paystack PCI-DSS, Vercel Edge.

---

## Operational Change Log

### [2026-10-01] Backend & Security Readiness Update
- **Server-Side Living Story Deduplication:**
  - app/api/generate-living-story/route.ts updated with 15-second duplicate generation lock.
  - Prevents race conditions and double-clicking from creating duplicate story rows in generated_stories.
- **Parent Account Deactivation Hard-Block:**
  - app/api/generate-living-story/route.ts and lib/sessionBudget.ts query parent_subscriptions.status.
  - Immediate 403 / story-start block enforced if status is 'deactivated' or 'paused'.
- **Quota Enforcement:**
  - FREE_MONTHLY_STORY_LIMIT strictly set to 5 stories per calendar month per child.
  - Whitelisted admin emails (crux@onesimos.app, examplemirrorltd@gmail.com, baiceconsulting@gmail.com, onesimos@examplemirror.com) maintain quota bypass privileges.
- **Investor & Security Dossier:**
  - Created ALD.md detailing CAC registration, COPPA/GDPR-K compliance, Paystack gateway security, and Expo hybrid app store deployment strategy.

---

## Core Architecture & Moat

Onesimos is an adaptive oral reading and phonics platform built on a proprietary three-pillar moat:
1. Verbatim Speech Evaluation: Deepgram Nova-2 captures word stumbles and phoneme errors in real time during live oral reading.
2. Adaptive Living Chapters: Synthesizes custom learning chapters weaving past stumbled words into new story lines.
3. 25 Core Life Skills Curriculum: Integrates values (resilience, honesty, courage, empathy) into story arcs.

---

## Active System State

- **Custom Domain:** onesimos.app mapped to Vercel Anycast IP 216.198.79.1.
- **Transactional Mail:** Configured with Resend Custom SMTP (smtp.resend.com:465 SSL) via noreply@onesimos.app.
- **Phonics Sound Lab:** Live at app/kid/[childId]/phonics/page.tsx with 7 Orton-Gillingham categories. Category 1 (Letter Sounds) is 100% free; Categories 2-7 require parent subscription unlock.
- **Mobile Packaging Pipeline:** React Native and Expo WebView wrapper ready to distribute child reading views on Google Play Store and Apple App Store.
