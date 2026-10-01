═══════════════════════════════════════════════════════════════════
APPENDIX A: OPEN ISSUES BEFORE PAID SCALE (v5.1 queue)
═══════════════════════════════════════════════════════════════════

1. Enforce sessionBudget / story start block when parent_subscriptions.status = 'deactivated'.
2. Audit free-tier completed_story counting (2 reads → lock at 3).
3. Living Chapter + free catalog dedupe rules for same household / returning email.
4. Confirm SUPABASE_SERVICE_ROLE_KEY is set in Vercel so hard delete purges auth.users.
5. Drop CC0 MP3s into public/phonics/ (a.mp3 … z.mp3, sh.mp3, …).
6. Swap Paystack TEST keys → LIVE keys in Vercel; redeploy.
7. Optional: post-Google-login newsletter opt-in on /welcome.

═══════════════════════════════════════════════════════════════════
APPENDIX B: RELATED DOCS IN REPO
═══════════════════════════════════════════════════════════════════

- ALD.md — Access Control, Audit Logs, Data Isolation (investor-facing)
- HANDOFF.md — this file (engineering source of truth)
- Live app: https://onesimos.app
- School PDF route: https://onesimos.app/school-proposal
