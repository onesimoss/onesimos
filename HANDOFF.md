# ONESIMOS Operational Engineering Handoff & Source of Truth

**Platform Owner:** Example Mirror Ltd (Abuja, Nigeria)  
**Live Production App:** [https://onesimos.app](https://onesimos.app)  
**Primary Domain Routing:** Vercel Anycast DNS (216.198.79.1)  
**Core Payment Gateway:** Paystack PCI-DSS Live Card Processing (NGN / USD)  
**Transactional SMTP Router:** Resend (
oreply@onesimos.app via smtp.resend.com:465)  

---

## Operational Change Log

### [2026-10-02] Active Reader Tab-Focus & App-Backgrounding Pause
- **Pip the Parrot Auto-Pause Detection:**
  - components/ReadingTimer.tsx: Added isibilitychange, lur, and ocus event listeners to freeze timer countdown (secondsLeft) whenever browser tab loses focus, window minimizes, or mobile app backgrounds.
  - Added isExternalPaused prop and visual PAUSED status badge inside timer control bar.
  - pp/kid/[childId]/read/[storyId]/page.tsx: Integrated isTabPaused visibility state to pause real-time reading duration (elapsedSeconds) tracking.
  - Added Pip the Parrot top banner notification: *"Pip paused the reading timer while you are away! Click back here to resume."*
  - Ensured speech evaluation and mic processing pause gracefully when backgrounded to conserve child screen quota and battery life.

### [2026-10-01] Backend & Security Readiness Update
- **Server-Side Living Story Deduplication:**
  - pp/api/generate-living-story/route.ts updated with 15-second duplicate generation lock.
  - Prevents race conditions and double-clicking from creating duplicate story rows in generated_stories.
- **Parent Account Deactivation Hard-Block:**
  - pp/api/generate-living-story/route.ts and lib/sessionBudget.ts query parent_subscriptions.status.
  - Immediate 403 / story-start block enforced if status is 'deactivated' or 'paused'.
- **Quota Enforcement:**
  - FREE_MONTHLY_STORY_LIMIT strictly set to 5 stories per calendar month per child.
  - Whitelisted admin emails (crux@onesimos.app, examplemirrorltd@gmail.com, aiceconsulting@gmail.com, onesimos@examplemirror.com) maintain quota bypass privileges.
- **Investor & Security Dossier:**
  - Created ALD.md detailing CAC registration, COPPA/GDPR-K compliance, Paystack gateway security, and Expo hybrid app store deployment strategy.

---

## Core Architecture & Moat

Onesimos is an adaptive oral reading and phonics platform built on a proprietary three-pillar moat:
1. **Verbatim Speech Evaluation:** Deepgram Nova-2 captures word stumbles and phoneme errors in real time during live oral reading.
2. **Adaptive Living Chapters:** Synthesizes custom learning chapters weaving past stumbled words into new story lines.
3. **25 Core Life Skills Curriculum:** Integrates values (resilience, honesty, courage, empathy) into story arcs.

---

## Brand & UI Design System Rules

1. **Wordmark Standard:** Always rendered as ont-logo (small caps "Onesimos"). Never apply ont-extrabold or 	racking-wider to ont-logo.
2. **Typography Hierarchy:**
   - Headings & Greetings (*"Hi [Child Name]!"*): ont-achiko.
   - Body Copy, Buttons, Cards, Badges, Descriptions: ont-switzer.
   - Numeric Metrics / Stats: ont-switzer text-2xl font-black leading-none.
3. **Punctuation Policy:** Zero em dashes (—) or en dashes (–). Use commas, colons, periods, or standard hyphens (-).
4. **Marketing Copy Standard:** Never use terms like "AI-generated" or "artificial intelligence" in public-facing copy. Always frame as "personalized learning chapters, real-time speech recognition evaluation, and adaptive story synthesis".

---

## Active System State

- **Custom Domain:** onesimos.app mapped to Vercel Anycast IP 216.198.79.1.
- **Transactional Mail:** Configured with Resend Custom SMTP (smtp.resend.com:465 SSL) via 
oreply@onesimos.app.
- **Phonics Sound Lab:** Live at pp/kid/[childId]/phonics/page.tsx with 7 Orton-Gillingham categories. Category 1 (Letter Sounds) is 100% free; Categories 2-7 require parent subscription unlock.
- **Mobile Packaging Pipeline:** Expo / React Native hybrid webview shell with microphone permissions, native audio focus, and splash screen configured for Android (Google Play AAB) and iOS (Apple App Store IPA).

---

## Investor Pitch Parameters

- **Funding Target:** ,000 – ,000 USD (approx. ₦33M – ₦43M NGN).
- **Valuation / Vehicle:** 3% – 5% equity on a SAFE note at .5M valuation cap.
- **Corporate Entity:** Example Mirror Ltd (Abuja, Nigeria).
- **Strategic Target Wedges:**
  - Chioma (Chef Chi) for family/motherhood organic wedge into Davido's circle.
  - Mr Eazi (Zagadat Capital) for direct tech check.
  - Alhaji Muhammad Indimi for school computer lab CSR sponsorships.