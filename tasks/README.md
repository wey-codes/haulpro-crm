# HaulPro CRM - Task PRDs

Each file is a single, right-sized task PRD completable in one session (~1-2 hours).

## Workflow

1. Pick the next **pending** task where all dependencies are **completed**
2. Read the task PRD thoroughly
3. Implement until all acceptance criteria pass
4. Mark task as **completed** in this README
5. Move to next task

## Task Naming

`{phase}-{order}-{feature-name}.md`

Example: `00-01-init-nextjs.md` = Phase 0, Task 1, Initialize Next.js

---

## Phase 0: Project Setup

| # | Task | Status | Depends On |
|---|------|--------|------------|
| 00-01 | [Initialize Next.js](00-01-init-nextjs.md) | pending | - |
| 00-02 | [Supabase Setup](00-02-supabase-setup.md) | pending | 00-01 |
| 00-03 | [Database Schema](00-03-database-schema.md) | pending | 00-02 |
| 00-04 | [Seed Data](00-04-seed-data.md) | pending | 00-03 |
| 00-05 | [Auth Setup](00-05-auth-setup.md) | pending | 00-04 |
| 00-06 | [Layout Shell](00-06-layout-shell.md) | pending | 00-05 |

✅ **Done when:** Can log in, see dashboard with sidebar, navigate between pages.

---

## Phase 1: Lead Management

| # | Task | Status | Depends On |
|---|------|--------|------------|
| 01-01 | [Lead List View](01-01-lead-list.md) | pending | 00-06 |
| 01-02 | [Lead Form](01-02-lead-form.md) | pending | 01-01 |
| 01-03 | [Lead Detail](01-03-lead-detail.md) | pending | 01-02 |
| 01-04 | [Photo Upload](01-04-photo-upload.md) | pending | 01-03 |
| 01-05 | [Quote Builder](01-05-quote-builder.md) | pending | 01-04 |

✅ **Done when:** Can create lead, upload photos, create quote, track status.

---

## Phase 2: Booking & Jobs

| # | Task | Status | Depends On |
|---|------|--------|------------|
| 02-01 | Stripe Setup | pending | 01-05 |
| 02-02 | Booking Flow | pending | 02-01 |
| 02-03 | Job List View | pending | 02-02 |
| 02-04 | Job Detail View | pending | 02-03 |

✅ **Done when:** Can book job with card on file, see job in list.

---

## Phase 3: Sub Dispatch

| # | Task | Status | Depends On |
|---|------|--------|------------|
| 03-01 | Twilio Setup | pending | 02-04 |
| 03-02 | Sub Management | pending | 03-01 |
| 03-03 | Dispatch Blast | pending | 03-02 |
| 03-04 | Claim Detection | pending | 03-03 |
| 03-05 | Morning Reminder | pending | 03-04 |

✅ **Done when:** Can dispatch job to subs, first YES wins, reminders sent.

---

## Phase 4: Magic Links

| # | Task | Status | Depends On |
|---|------|--------|------------|
| 04-01 | Magic Link Infrastructure | pending | 03-05 |
| 04-02 | Agreement Signature | pending | 04-01 |
| 04-03 | On-Site Payment | pending | 04-02 |
| 04-04 | Review Request | pending | 04-03 |
| 04-05 | Post-Job Upload | pending | 04-04 |

✅ **Done when:** Sub can complete on-site flow via magic link.

---

## Phase 5: Payments & Completion

| # | Task | Status | Depends On |
|---|------|--------|------------|
| 05-01 | Charge on Completion | pending | 04-05 |
| 05-02 | Payment Failure Flow | pending | 05-01 |
| 05-03 | Payout Tracking | pending | 05-02 |
| 05-04 | Review Bonus | pending | 05-03 |

✅ **Done when:** Jobs charge on completion, payouts tracked.

---

## Quick Start

**→ Begin with:** `00-01-init-nextjs.md`

### Commands
```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

### Key Docs
- `CLAUDE.md` - AI assistant context
- `docs/PRD.md` - Product requirements
- `docs/SCHEMA.sql` - Database schema

---

## Progress

```
Phase 0: [ ] [ ] [ ] [ ] [ ] [ ]     0/6
Phase 1: [ ] [ ] [ ] [ ] [ ]         0/5
Phase 2: [ ] [ ] [ ] [ ]             0/4
Phase 3: [ ] [ ] [ ] [ ] [ ]         0/5
Phase 4: [ ] [ ] [ ] [ ] [ ]         0/5
Phase 5: [ ] [ ] [ ] [ ]             0/4

MVP Total: 0/29 tasks
```
