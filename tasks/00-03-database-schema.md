# Task: Database Schema Setup

**Status:** pending
**Phase:** 0 - Project Setup
**Depends On:** 00-02-supabase-setup
**Estimated Time:** 1 hour

---

## 1. Overview

Create all database tables, enums, indexes, RLS policies, and triggers in Supabase. This establishes the multi-tenant data model for HaulPro CRM.

## 2. Goals

- Create all 11 database tables with proper relationships
- Set up PostgreSQL enums for type safety
- Configure Row Level Security for tenant isolation
- Create triggers for automatic timestamps and business logic
- Verify schema is correctly applied

## 3. User Stories

### 3.1 Schema is applied to Supabase
**As a** developer
**I want** all tables created in the Supabase database
**So that** I can build features that persist data

**Acceptance Criteria:**
- [ ] All 11 tables visible in Supabase Table Editor
- [ ] All enums created
- [ ] All indexes created
- [ ] RLS enabled on all tables
- [ ] Triggers are active

### 3.2 RLS policies enforce tenant isolation
**As a** developer
**I want** RLS to prevent cross-tenant data access
**So that** each account's data is isolated

**Acceptance Criteria:**
- [ ] `get_user_account_id()` function exists
- [ ] SELECT policies restrict to user's account
- [ ] INSERT policies require matching account_id

## 4. Functional Requirements

**FR-1:** Execute the schema from `docs/SCHEMA.sql` in Supabase SQL Editor

**FR-2:** Verify these tables exist:
- `accounts`
- `packages`
- `users`
- `subcontractors`
- `leads`
- `jobs`
- `payouts`
- `transactions`
- `sms_logs`
- `job_dispatches`
- `activity_logs`

**FR-3:** Verify these enums exist:
- `subscription_status`
- `user_role`
- `lead_status`
- `lead_source`
- `job_status`
- `payment_status`
- `sub_status`
- `payout_status`
- `transaction_type`
- `transaction_status`
- `sms_direction`
- `limit_type`

**FR-4:** Verify RLS is enabled on all tables (check in Supabase dashboard)

**FR-5:** Verify helper function `get_user_account_id()` exists

**FR-6:** Verify triggers exist:
- `update_updated_at` trigger on tables with `updated_at`
- `job_completion_payout` trigger on jobs
- `job_booking_lead_update` trigger on jobs

## 5. Non-Goals

- No seed data in this task (that's next task)
- No TypeScript types generated yet
- No API routes yet

## 6. Technical Considerations

- Run schema in Supabase SQL Editor (not via migrations yet)
- The schema includes `uuid-ossp` extension for UUID generation
- Magic link policies allow public access to jobs with valid tokens

## 7. Acceptance Criteria (Verification)

In Supabase SQL Editor, run:
```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verify enums exist
SELECT typname FROM pg_type
WHERE typtype = 'e';

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Verify helper function
SELECT get_user_account_id();  -- Should return NULL (no user logged in)
```

Expected: 11 tables, 12 enums, all tables have `rowsecurity = true`

## 8. Output Files

No code files created. Schema exists in Supabase.

For reference, save the migration:
- `supabase/migrations/001_initial_schema.sql` (copy of `docs/SCHEMA.sql`)

---

## Implementation Notes

1. Open Supabase Dashboard > SQL Editor
2. Paste contents of `docs/SCHEMA.sql`
3. Click "Run"
4. Verify in Table Editor that all tables appear
5. Check each table has RLS enabled (lock icon)
