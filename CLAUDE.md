# HaulPro CRM

Multi-tenant CRM for junk removal & cleanout businesses. Built for operators, by an operator.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Payments:** Stripe
- **SMS:** Twilio

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, signup (minimal layout)
│   ├── (dashboard)/      # Protected CRM pages
│   │   ├── leads/        # Lead management
│   │   ├── jobs/         # Job board & details
│   │   ├── subs/         # Subcontractor management
│   │   ├── payouts/      # Payout tracking
│   │   └── settings/     # Account settings
│   ├── api/              # API routes & webhooks
│   └── j/[token]/        # Magic links (public, no auth)
├── components/
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Sidebar, header, etc.
├── lib/
│   └── supabase/         # Client & server setup
└── hooks/                # Custom React hooks
```

## Key Patterns

### Multi-Tenancy
Every table has `account_id`. RLS policies enforce isolation via `get_user_account_id()` helper function.

### Magic Links
Subs don't log in. They receive tokenized links (`/j/{token}`) for:
- Agreement signature
- Payment collection (fallback)
- Review request
- Post-job uploads (receipt + video)

### SMS-First Dispatch
Job offers sent to all active subs via SMS. First "YES" reply wins.

### Payment Flow
1. Card on file at booking (Stripe, tokenized)
2. Charge on job completion
3. Prepay option for specific packages (e.g., Curbside)

## Database Tables

| Table | Purpose |
|-------|---------|
| accounts | Tenants (companies) |
| packages | Service tiers per account |
| users | Internal team (owners, managers, VAs) |
| subcontractors | Field operators (SMS-only) |
| leads | Potential customers |
| jobs | Booked work |
| payouts | Sub payment tracking |
| transactions | Payment audit trail |
| sms_logs | All SMS history |
| job_dispatches | Dispatch blast tracking |
| activity_logs | Audit trail |

## First Tenant: Austin Cleanouts

| Package | Price | Time Limit | Sub Payout |
|---------|-------|------------|------------|
| Curbside Pickup | $297 | Flat | $75 |
| Mini Rehab | $497 | 2 hours | $160 |
| Standard Rehab | $997 | 5 hours | $400 |
| Full Day Rehab | $1,497 | 8 hours | $640 |

## Detailed Docs

- [PRD](docs/PRD.md) - Full product requirements
- [TASKS](docs/TASKS.md) - Implementation task breakdown (phased)
- [SCHEMA](docs/SCHEMA.sql) - Database schema with RLS policies

## Current Phase

**Phase 0: Project Setup** - Creating folder structure, initializing Next.js, connecting Supabase

## User Roles

| Role | Access |
|------|--------|
| Owner/Manager | Full access, dispatch, financials |
| Sales Rep/VA | Leads, quotes, booking (no payouts) |
| Subcontractor | SMS + magic links only (no login) |
