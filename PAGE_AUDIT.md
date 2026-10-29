---

## FILE 2: `PAGE_AUDIT.md`

```markdown
# ONESIMOS — PAGE & COMPONENT AUDIT

**Purpose:** Before touching any file, check it here. This document inventories every route, component, API handler, and shared module. It tracks: current state, design-system compliance, dependencies, and known risks. The goal is zero regressions.

**Last updated:** [set on save]

---

## 0. HOW TO USE THIS DOC

- Before editing a file, find its row below. Read the "Depends on" and "Depended on by" columns.
- After editing a file, update its "Last edited," "Status," and "Clay compliant" columns.
- If you add a new route or component, add a row.
- If you delete a file, mark the row `DELETED` and leave it for one session before removing.

**Status values:** `STABLE` · `IN_PROGRESS` · `NEEDS_UPGRADE` · `BROKEN` · `DELETED`
**Clay compliant values:** `YES` · `NO` · `PARTIAL` · `N/A`

---

## 1. ROUTES (Next.js App Router)

| Route                            | File                                         | Status      | Clay compliant | Last edited | Depends on             | Notes                                                      |
| -------------------------------- | -------------------------------------------- | ----------- | -------------- | ----------- | ---------------------- | ---------------------------------------------------------- |
| `/`                              | `app/page.tsx`                               | NEEDS_AUDIT | NEEDS_AUDIT    | —           | layout, globals.css    | Landing page                                               |
| `/login`                         | `app/login/page.tsx`                         | NEEDS_AUDIT | NEEDS_AUDIT    | —           | Supabase auth          | Parent login                                               |
| `/signup`                        | `app/signup/page.tsx`                        | NEEDS_AUDIT | NEEDS_AUDIT    | —           | Supabase auth          | Parent signup                                              |
| `/parent`                        | `app/parent/page.tsx`                        | NEEDS_AUDIT | NEEDS_AUDIT    | —           | Supabase, Paystack     | Parent dashboard                                           |
| `/parent/settings`               | `app/parent/settings/page.tsx`               | NEEDS_AUDIT | NEEDS_AUDIT    | —           | Supabase               | Includes admin-only Reset test quota button                |
| `/parent/billing`                | `app/parent/billing/page.tsx`                | NEEDS_AUDIT | NEEDS_AUDIT    | —           | Paystack               | Subscription management                                    |
| `/kid/[childId]`                 | `app/kid/[childId]/page.tsx`                 | NEEDS_AUDIT | NEEDS_AUDIT    | —           | Supabase, PipCompanion | Kid dashboard. PowerShell wildcard trap on this path.      |
| `/kid/[childId]/story/[storyId]` | `app/kid/[childId]/story/[storyId]/page.tsx` | NEEDS_AUDIT | NEEDS_AUDIT    | —           | Deepgram, Supabase     | Story reader. Enforces free monthly limit = 5.             |
| `/kid/[childId]/phonics`         | `app/kid/[childId]/phonics/page.tsx`         | NEEDS_AUDIT | NEEDS_AUDIT    | —           | Supabase               | Phonics Lab. Letter Sounds free. Categories 2–7 paywalled. |
| `/api/story/generate`            | `app/api/story/generate/route.ts`            | NEEDS_AUDIT | N/A            | —           | Supabase, LLM          | Must 403 if subscription paused/deactivated.               |
| `/api/stt`                       | `app/api/stt/route.ts`                       | NEEDS_AUDIT | N/A            | —           | Deepgram Nova-2        | Verbatim stumble capture.                                  |
| `/api/paystack/webhook`          | `app/api/paystack/webhook/route.ts`          | NEEDS_AUDIT | N/A            | —           | Paystack               | Subscription lifecycle events.                             |

> Fill in actual routes by running `tree app /F` or scanning the repo at session start.

---

## 2. SHARED COMPONENTS

| Component                                       | File                          | Status      | Clay compliant | Last edited | Used by              | Notes                                                                                                 |
| ----------------------------------------------- | ----------------------------- | ----------- | -------------- | ----------- | -------------------- | ----------------------------------------------------------------------------------------------------- |
| PipCompanion                                    | `components/PipCompanion.tsx` | IN_PROGRESS | YES (design)   | —           | kid layout (pending) | Unboxed clay parrot. Draft code exists; next step is pasting into editor and running `npm run build`. |
| SmoothScroll                                    | `components/SmoothScroll.tsx` | STABLE      | N/A            | —           | root layout          | Lenis + GSAP wrapper                                                                                  |
| (add rows for every component in `components/`) |                               |             |                |             |                      |                                                                                                       |

---

## 3. SHARED LIBS

| Module           | File                            | Status      | Last edited | Notes                                  |
| ---------------- | ------------------------------- | ----------- | ----------- | -------------------------------------- |
| Session budget   | `lib/sessionBudget.ts`          | STABLE      | —           | Exports `FREE_MONTHLY_STORY_LIMIT = 5` |
| Supabase client  | `lib/supabase.ts` (verify path) | NEEDS_AUDIT | —           | Server + client variants               |
| Paystack helpers | `lib/paystack.ts` (verify path) | NEEDS_AUDIT | —           | Live keys in Vercel env                |
| Deepgram helpers | `lib/deepgram.ts` (verify path) | NEEDS_AUDIT | —           | Nova-2 model                           |

---

## 4. STYLING

| File                 | Status      | Last edited | Notes                                                                                                                                       |
| -------------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `tailwind.config.js` | STABLE      | —           | `clay.*` palette set. Fonts: logo, achiko, switzer.                                                                                         |
| `app/globals.css`    | STABLE      | —           | Utility classes: `.clay-puffy-canvas`, `.clay-puffy-frame`, `.clay-btn-coral`, `.clay-btn-dark`, `.clay-pill-white`, `.pip-floating-shadow` |
| `app/layout.tsx`     | NEEDS_AUDIT | —           | Root layout. Must load fonts and wrap in `SmoothScroll`.                                                                                    |

---

## 5. MOBILE WRAPPER

| File                   | Status | Last edited | Notes                                       |
| ---------------------- | ------ | ----------- | ------------------------------------------- |
| `app.json`             | STABLE | —           | Expo config                                 |
| `eas.json`             | STABLE | —           | EAS build profiles                          |
| `mobile/package.json`  | STABLE | —           | RN deps, isolated from root                 |
| `mobile/App.tsx`       | STABLE | —           | WebView wrapper around https://onesimos.app |
| `tsconfig.json` (root) | STABLE | —           | `"exclude": ["mobile"]` MUST remain         |

---

## 6. CONFIG & SECRETS (names only, never values)

| Env var                           | Where used       | Notes               |
| --------------------------------- | ---------------- | ------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | lib/supabase.ts  | Vercel              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | lib/supabase.ts  | Vercel              |
| `SUPABASE_SERVICE_ROLE_KEY`       | server routes    | Vercel, server-only |
| `DEEPGRAM_API_KEY`                | /api/stt         | Vercel, server-only |
| `PAYSTACK_SECRET_KEY`             | /api/paystack/\* | Vercel, server-only |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | checkout         | Vercel              |
| `OPENAI_API_KEY` or equivalent    | story generation | Vercel, server-only |

> Confirm actual env var names from `.env.example` or Vercel dashboard at session start.

---

## 7. REGRESSION CHECKLIST (run before every commit)

- [ ] `npm run build` passes locally with zero errors.
- [ ] No em dashes (—) or en dashes (–) in staged diff: `git diff --cached | Select-String "—|–"`
- [ ] No "AI-generated" or "artificial intelligence" in staged marketing copy.
- [ ] `font-logo` is not combined with `font-extrabold` or `tracking-wider` anywhere in staged diff.
- [ ] `PipCompanion` is not wrapped in any card, frame, or rectangle.
- [ ] Reset test quota button is still gated behind admin check.
- [ ] Free monthly story limit still reads from `FREE_MONTHLY_STORY_LIMIT` constant.
- [ ] Subscription paused/deactivated path still returns 403 from `/api/story/generate`.
- [ ] `tsconfig.json` still excludes `mobile`.
- [ ] `git add .` (never a bracketed path).
- [ ] After `git push`, Vercel deploy at https://onesimos.app shows the change.

---

## 8. OPEN AUDIT TASKS

- [ ] Run `tree app /F > _app_tree.txt` at session start and reconcile with Section 1.
- [ ] Run `tree components /F > _components_tree.txt` and reconcile with Section 2.
- [ ] Run `tree lib /F > _lib_tree.txt` and reconcile with Section 3.
- [ ] Fill in actual `Last edited` dates from `git log --name-only`.
- [ ] Mark each row's `Clay compliant` status by visually inspecting the page against the pastel reference.

---

**END OF AUDIT. Update this file every time a file is created, edited, or deleted.**
