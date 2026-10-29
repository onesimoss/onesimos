# ONESIMOS — SESSION HANDOFF (LIVING SOURCE OF TRUTH)

**Last updated:** [set on save]
**Live site:** https://onesimos.app
**Repo root:** `C:\Users\DELL\Documents\MItchel\Example MIrror Ltd\ONSIMOS`
**Legal entity:** Example Mirror Ltd (CAC, Abuja, Nigeria)
**Hosting:** Vercel (do not migrate)
**Database / auth:** Supabase (do not migrate)
**Payments:** Paystack (live, verified merchant)

---

## 0. HOW TO READ THIS DOC

This file is the single source of truth between sessions. Any new assistant session MUST:

1. Read this file top to bottom before writing a single line of code.
2. Read `PAGE_AUDIT.md` before touching ANY route, component, or style.
3. Follow every rule in Section 2 (House Rules). No exceptions.
4. Update this file and `PAGE_AUDIT.md` at the end of every working session.

If a rule here conflicts with a user request, STOP and ask. Do not guess.

---

## 1. MISSION

Onesimos is a children's literacy and life-skills platform. The product teaches reading through:

1. **AI Living Chapters** — personalized story chapters generated from the child's stumbled words.
2. **Deepgram Nova-2 verbatim STT** — captures every stumble in real time.
3. **25 Core Life Skills curriculum** — the pedagogical spine.

These three pillars are the moat. Do not dilute them, do not remove them, do not replace them.

**Current commercial goal:** Launch on Google Play Store and Apple App Store via an Expo / React Native wrapper around the existing Next.js web app, while continuing to run the web app on Vercel.

**Current fundraising goal:** $25,000–$30,000 USD (approx. ₦33M–₦43M NGN) for 3%–5% equity in Example Mirror Ltd. Instrument: SAFE at $1.5M cap. Target investors: Chioma ("Chef Chi"), Mr Eazi (Zagadat Capital), Alhaji Muhammad Indimi.

---

## 2. HOUSE RULES (NON-NEGOTIABLE)

### 2.1 Code delivery

- **Deliver ONE FULL FILE AT A TIME.** Never partial edits, never diffs, never "insert this snippet here."
- Every code file must be delivered as a complete, copy-paste-ready file with its full path at the top.
- If a file is too long, split the TASK across sessions, not the FILE.

### 2.2 How to save code on this machine (CRITICAL)

The user's shell is **Windows PowerShell 5.1**. PowerShell will try to execute anything pasted into it. This has broken sessions repeatedly.

**NEVER tell the user to paste TypeScript, JSX, CSS, or JSON directly into the PowerShell prompt.**

Correct ways to save a file:

**Option A (preferred): open the file in the editor and paste.**
Instruct the user to:

1. Open `components\PipCompanion.tsx` (or whichever path) in VS Code / Cursor.
2. Select all, delete, paste the new content, save.

**Option B: write via Node.js script.** Give the user a `.mjs` script that uses `fs.writeFileSync`, then tell them to run `node write-file.mjs`.

**Option C: write via `[System.IO.File]::WriteAllText` in PowerShell, with the file contents stored in a single-quoted here-string `@' ... '@`.** This is fragile. Only use it for short files. Never use double-quoted here-strings (`@" ... "@`) because PowerShell will interpolate `$childId`, `${storyId}`, etc. and strip them to empty strings.

**Known PowerShell traps:**

- `git add app/kid/[childId]/page.tsx` fails silently because `[` and `]` are wildcard characters. **Always use `git add .`**
- `Set-Content -Encoding UTF8` has broken parameter binding in PS 5.1. Use `[System.IO.File]::WriteAllText(path, content, [System.Text.Encoding]::UTF8)` instead.
- Double-quoted here-strings interpolate `$var` and `${var}`. Use single-quoted `@' ... '@` for anything containing JavaScript template literals.
- PowerShell parses `|` as pipe, `&` as reserved operator, `>` as redirect. All of these appear constantly in TypeScript. This is why pasting code into the prompt destroys it.

### 2.3 Typography rules

- **ONESIMOS wordmark:** class `font-logo`, rendered as "Onesimos" in small caps. **Never** add `font-extrabold` or `tracking-wider` to `font-logo`.
- **Headings and "Hi [Child Name]!" greeting:** `font-achiko`.
- **Body, buttons, cards, badges, descriptions:** `font-switzer`.
- **Stat numbers:** `font-switzer text-2xl font-black leading-none`.

### 2.4 Copy rules

- **No em dashes (—).** No en dashes (–). Ever. Anywhere. Use commas, colons, periods, or rewrite the sentence.
- **No "AI-generated" or "artificial intelligence"** in public marketing, company filings, legal copy, or app store listings. Approved phrasing: "personalized learning chapters, real-time speech recognition evaluation, and adaptive story synthesis."
- Parent display names must be auto-title-cased on save (`onesimos` → `Onesimos`).

### 2.5 Product rules

- **Letter Sounds in Phonics Lab is 100% free, forever.** Categories 2–7 require parent subscription unlock.
- **Free monthly story limit = 5** (enforced in `lib/sessionBudget.ts` via `FREE_MONTHLY_STORY_LIMIT`).
- Deactivated or paused parent subscriptions must hard-block child story starts and API generation with HTTP 403.
- **The "Reset test quota" button must NEVER be shown to non-admin parents.** Admin-only.
- Pip the Parrot must **NOT** be boxed inside a yellow card or any rectangle. Pip is unboxed, free-floating, with a soft diffuse ground shadow only.

### 2.6 Design system rules (claymorphism, pastel reference)

- Background: warm cream `#F8F5EE` or `#FDF6F0`.
- Palette (defined in `tailwind.config.js` under `clay.*`):
  - `clay.cream` `#FDF6F0`
  - `clay.peach` `#FFE8D6`
  - `clay.mint` `#B8E0D2`
  - `clay.sky` `#A8C5E8`
  - `clay.pink` `#F4A6A6`
  - `clay.lavender` `#CBBBEA`
  - `clay.coral` `#F2A488`
  - `clay.text` `#3D3D5C`
- Every clay surface needs: top-left glossy highlight, diffuse soft drop shadow, ultra-rounded corners (`border-radius` ≥ 18px, pills = 999px).
- No harsh dark borders. No hard amber/orange drop shadows (previous iteration was rejected).
- Utility classes already in `app/globals.css`: `.clay-puffy-canvas`, `.clay-puffy-frame`, `.clay-btn-coral`, `.clay-btn-dark`, `.clay-pill-white`, `.pip-floating-shadow`.

### 2.7 Infrastructure rules

- Do **not** migrate away from Supabase.
- Do **not** migrate away from Vercel.
- Mobile wrapper is Expo / React Native in the `mobile/` directory. `mobile` is listed in `tsconfig.json` `"exclude"` so Next.js build does not try to compile React Native modules.

---

## 3. CURRENT ARCHITECTURE SNAPSHOT

### 3.1 Web app (Next.js, deployed to Vercel)

- Framework: Next.js App Router.
- Styling: Tailwind CSS with custom `clay.*` palette and claymorphism utilities in `globals.css`.
- Smooth scroll: `gsap` + `lenis` installed. `components/SmoothScroll.tsx` exists.
- Fonts: `font-logo`, `font-achiko`, `font-switzer` (configured in `tailwind.config.js` and loaded in root layout).

### 3.2 Mobile wrapper (Expo)

- `app.json`, `eas.json`, `mobile/package.json`, `mobile/App.tsx` are configured.
- `mobile` is excluded from the root `tsconfig.json`.
- Build target: Google Play Store and Apple App Store.

### 3.3 Backend

- Supabase for auth, database, storage.
- Deepgram Nova-2 for STT (stumble capture).
- Paystack for payments (live, verified).
- Vercel for hosting.

### 3.4 Compliance posture

- COPPA (US children)
- GDPR-K (EU children)
- NDPA 2023 (Nigeria)
- BIPA (Illinois biometric, transient audio waiver)

---

## 4. WHAT IS DONE

- ✅ `tailwind.config.js` pastel clay palette set.
- ✅ `app/globals.css` claymorphism utility classes written (`.clay-puffy-canvas`, `.clay-puffy-frame`, `.clay-btn-coral`, `.clay-btn-dark`, `.clay-pill-white`, `.pip-floating-shadow`).
- ✅ `gsap` and `lenis` installed.
- ✅ `components/SmoothScroll.tsx` written.
- ✅ Expo wrapper scaffolded: `app.json`, `eas.json`, `mobile/package.json`, `mobile/App.tsx`.
- ✅ `mobile` excluded from root `tsconfig.json`.
- ✅ `FREE_MONTHLY_STORY_LIMIT = 5` enforced in `lib/sessionBudget.ts`.
- ✅ Deactivated/paused parent subs hard-block story generation with HTTP 403.
- ✅ Reset test quota button restricted to admin.

---

## 5. WHAT IS IN FLIGHT (BLOCKING NEXT STEP)

### 5.1 `components/PipCompanion.tsx`

A complete, working version of this file has been drafted twice. The code itself compiles. **The failure in the last session was NOT a code bug — the user accidentally pasted the TypeScript into the PowerShell prompt, and PowerShell tried to execute it as PowerShell commands.** The errors `Missing argument in parameter list`, `The ampersand (&) character is not allowed`, `Expressions are only allowed as the first element of a pipeline` are PowerShell parse errors on TypeScript syntax, not TypeScript errors.

**Next session action:**

1. Do not re-generate the file from scratch. The code in the previous session is correct.
2. Instruct the user to open `components\PipCompanion.tsx` directly in their editor (VS Code / Cursor) and paste the content there, then save.
3. After saving, run `npm run build` from the project root.
4. If build fails, read the error from the Next.js build output (not from PowerShell parsing the paste).

**Required behavior of `PipCompanion.tsx`:**

- Rendered via `createPortal` to `document.body`, position `fixed`, `z-index: 55`.
- Completely unboxed: no yellow card, no rectangle, no frame. Only a soft diffuse radial ground shadow under the feet.
- Clay-styled parrot: mint/sky body, peach belly patch, coral beak, lavender/pink crest, top-left glossy highlight on head.
- Draggable with pointer events (not just mouse). Pointer capture on down, release on up/cancel.
- Double-click body = feed.
- Three pill buttons below the body: Feed, Break (or Wake when sleeping), Chirp.
- **Web Audio chirp:** 4-note sine burst with bandpass filter (frequencies 3200, 3800, 2900, 4100 Hz) plus a 60ms highpass noise blip for the wing flutter.
- **Speech synthesis:** `pitch: 2.0`, `rate: 1.35`, prefer kid-like English voice (Samantha, Victoria, Karen, Moira, Tessa, Zira, or Google US English).
- **Ambient chirps:** random every 4–12 seconds while awake.
- **Feed:** spawns a random seed emoji (🌱 🥜 🍒 🫐), then a heart (💖) 500ms later. Every 3rd feed, Pip speaks `"Yum yum[, name]! Pip loves seeds!"`
- **Break:** 20-minute snooze. Shows countdown on the Wake button. Auto-wakes at end.
- **Auto-snooze when tab hidden** (`document.visibilitychange`).
- **Wake:** speaks `"Good morning[ name]! Pip is ready to play!"`
- Respects `reducedMotion` prop (no bob, no wing flap, no ambient chirps).
- Props: `childName?: string`, `reducedMotion?: boolean`, `onSpeakReady?: (speak: (text: string) => void) => void`.

### 5.2 Wiring Pip into the kid layout

Once `PipCompanion.tsx` saves and builds, mount it in `app/kid/[childId]/layout.tsx` (or whichever layout wraps all kid routes). Pass `childName` from the loaded child record.

### 5.3 Platform-wide UI upgrade to pastel clay reference

After Pip ships, apply the clay design system to:

- Landing page
- Parent dashboard
- Kid dashboard
- Story reader
- Phonics Lab
- Paywall / upgrade screens
- Settings

Use `.clay-puffy-canvas`, `.clay-puffy-frame`, `.clay-btn-coral`, `.clay-btn-dark`, `.clay-pill-white` from `app/globals.css`. Reference the Matter App and Pixar 3D claymorphic benchmark: soft pastel fills, top-left glossy highlights, diffuse soft shadows, unboxed characters, ultra-rounded forms.

---

## 6. KNOWN LANDMINES (do not re-step on these)

| #   | Landmine                                                                                      | Fix                                                                                                         |
| --- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | Pasting TypeScript into PowerShell prompt                                                     | Save files via editor, Node script, or `[System.IO.File]::WriteAllText`. Never paste code into the prompt.  |
| 2   | `git add app/kid/[childId]/page.tsx` silently skips the file                                  | Always `git add .`                                                                                          |
| 3   | PowerShell double-quoted here-string strips `${childId}`                                      | Use single-quoted `@' ... '@` only                                                                          |
| 4   | `Set-Content -Encoding UTF8` fails in PS 5.1                                                  | Use `[System.IO.File]::WriteAllText(path, content, [System.Text.Encoding]::UTF8)`                           |
| 5   | Next.js build worker crashes on `mobile/App.tsx` because RN modules are not installed in root | `mobile` is in `tsconfig.json` `"exclude"` — keep it there                                                  |
| 6   | Amber/orange hard drop shadows look boxed and dark                                            | Use diffuse pastel shadows only, top-left glossy highlights                                                 |
| 7   | Em dashes slip into generated copy                                                            | Grep for `—` and `–` before every commit                                                                    |
| 8   | "AI-generated" slips into marketing copy                                                      | Use "personalized learning chapters, real-time speech recognition evaluation, and adaptive story synthesis" |

---

## 7. GIT WORKFLOW

```powershell
# From repo root. Always use "." — never a bracketed path.
git add .
git commit -m "feat(pip): unboxed clay companion with web audio chirps"
git push origin main
```
