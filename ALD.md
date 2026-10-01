# Onesimos — Access, Logs & Data Isolation (ALD)

**Company:** Example Mirror Ltd  
**Product:** Onesimos (https://onesimos.app)  
**Audience:** Parents & schools, children ages 3–9  
**Last updated:** Launch readiness session

---

## 1. Access Control

### Roles

| Role                       | Can do                                                       | Cannot do                                             |
| -------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| Child                      | Read stories, Sound Lab, Spelling (within plan limits)       | Billing, delete account, parent reports, PIN settings |
| Parent                     | Manage children, reports, billing, PIN, account pause/delete | Access another parent's data                          |
| Admin (whitelisted emails) | Parent powers + quota reset for testing                      | Still bound by RLS on other tenants                   |

### Controls in production

- **Parent PIN gate** on adult-only areas (pricing, sensitive parent actions).
- **Plan child caps:** Free/Single = 1, Family = 4, Daycare = 10, Classroom = 30 (admin whitelist unlimited for QA).
- **COPPA adult checkbox** on email signup (18+ parent/guardian/educator).
- **Google OAuth + email/password** via Supabase Auth; no child self-registration.
- **Free-tier limits:** stories/month, spelling rounds/day, Letter Sounds only in Phonics Lab.
- **Admin-only** “Reset test quota” (cannot be used by normal free parents to bypass limits).

### Investor one-liner

> “Children never see billing or deletion. Parents are gated by PIN. Every query is scoped to the authenticated parent.”

---

## 2. Audit Logs

### What we log

| Event                           | Where                                      | Purpose                  |
| ------------------------------- | ------------------------------------------ | ------------------------ |
| Login / logout / password reset | Supabase `auth.audit_log_entries`          | Security trail           |
| Reading sessions                | `reading_sessions` / session tables        | Progress & WPM           |
| Stumbled words                  | `stumbled_words_log` (primary)             | Curriculum + Word Pocket |
| Mastered words                  | `mastered_words` / flags                   | Spelling graduation      |
| Subscription changes            | `parent_subscriptions` + Paystack webhooks | Billing truth            |
| Account deactivate/delete       | API + DB cascade                           | GDPR-K erasure trail     |

### What we do _not_ store

- Raw microphone audio (transient STT only; no voiceprint warehouse).
- Card numbers (Paystack PCI-DSS; Onesimos never sees PAN).

### Investor one-liner

> “Immutable session and stumble logs plus Supabase auth audit give us a reconstructable history of who did what, without storing biometric audio.”

---

## 3. Data Isolation

### Tenant model

- **Tenant key:** `parent_id` (= Supabase `auth.uid()`).
- **Children** always belong to one parent.
- **Row Level Security (RLS)** on children, sessions, subscriptions, word logs:  
  `parent_id = auth.uid()` (or child owned by that parent).

### Isolation guarantees

- Parent A cannot `SELECT`/`UPDATE`/`DELETE` Parent B’s children or sessions.
- Kid routes are scoped by `childId` + ownership checks.
- Service-role key used only on server for privileged ops (e.g. hard auth user delete), never exposed to the browser.
- Public marketing pages have no child PII.

### Stack isolation

- **Vercel:** HTTPS, env secrets, edge deploy.
- **Supabase:** Postgres + RLS + Auth + Storage policies.
- **Paystack:** External PCI vault.
- **Resend:** Transactional mail from `noreply@onesimos.app` only.

### Investor one-liner

> “Isolation is enforced in the database (RLS), not only in the UI. UI bugs cannot leak another family’s reading data.”

---

## 4. Children’s privacy (summary)

- COPPA-style verifiable parental consent path (adult account + payment/OAuth).
- GDPR-K: pause account + permanent delete (“type DELETE”).
- NDPA: Example Mirror Ltd as controller; contact via crux@ / ops@ examplemirror.com forwards.
- No ads, no child social graph, no sale of child data.

---

## 5. Known launch gaps (transparent)

1. **Deactivate** must also hard-block kid reading when status = deactivated (next patch).
2. **Free story counter** accuracy under edge cases (double complete) — verify before scale.
3. **Living Chapter / catalog uniqueness** for re-registrations — product rule still to tighten.
4. **Google OAuth** does not show newsletter checkbox (collect post-login or skip).
5. **Phonics** ideal path = local CC0 MP3s in `public/phonics/` (code ready; files pending).

---

## 6. Contact

- Product: https://onesimos.app
- Company: Example Mirror Ltd, Abuja, Nigeria
- Ops / disputes: via onesimos.app forwards → examplemirror.com mailboxes
