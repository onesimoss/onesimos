Access Control (RBAC & Screen Locks):
Role-Based Access Control (RBAC): Admins, Parents, and Children have strict permission tiers.
Kid Mode Isolation: Children are locked inside age-appropriate screens. Adults are gated by a 4-digit Parent PIN required to access billing, child profile deletion, and analytics.
Audit Logs (Verifiable Trail):
Every single reading session, stumbled word, and quiz score writes an immutable event row into Supabase's stumbled_words_log and reading_sessions tables, creating a full historical audit trail.
Supabase Auth automatically logs every login, IP address, and password change under auth.audit_log_entries.
Data Isolation (Tenant & Parent Privacy):
Database Level RLS (Row Level Security): Supabase RLS policies enforce parent_id = auth.uid(). It is mathematically impossible for Parent A to query, view, or mutate Parent B's children or session records.
