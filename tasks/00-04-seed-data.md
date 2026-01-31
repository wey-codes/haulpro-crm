# Task: Seed Austin Cleanouts Data

**Status:** pending
**Phase:** 0 - Project Setup
**Depends On:** 00-03-database-schema
**Estimated Time:** 30 minutes

---

## 1. Overview

Create the first tenant account (Austin Cleanouts) with configured packages. This provides real data to build and test against.

## 2. Goals

- Create Austin Cleanouts account record
- Create 4 service packages with correct pricing
- Set up upsell relationships between packages
- Verify data is queryable

## 3. User Stories

### 3.1 Austin Cleanouts account exists
**As a** developer
**I want** a real account with packages in the database
**So that** I can test features with realistic data

**Acceptance Criteria:**
- [ ] Account "Austin Cleanouts" exists with slug "austin-cleanouts"
- [ ] 4 packages exist with correct prices
- [ ] Packages have upsell targets configured

## 4. Functional Requirements

**FR-1:** Create account with these values:
| Field | Value |
|-------|-------|
| id | `11111111-1111-1111-1111-111111111111` |
| company_name | Austin Cleanouts |
| slug | austin-cleanouts |
| subscription_status | active |

**FR-2:** Create 4 packages:

| Package | Price | Limit Type | Limit Value | Sub Payout | Prepay | Hidden |
|---------|-------|------------|-------------|------------|--------|--------|
| Curbside Pickup | $297 | flat | null | $75 | true | true |
| Mini Rehab | $497 | time | 2 hours | $160 | false | false |
| Standard Rehab | $997 | time | 5 hours | $400 | false | false |
| Full Day Rehab | $1,497 | time | 8 hours | $640 | false | false |

**FR-3:** Set upsell targets:
- Mini Rehab → Standard Rehab
- Standard Rehab → Full Day Rehab

## 5. Non-Goals

- No user account created yet (needs auth first)
- No subcontractors created yet
- No sample leads/jobs yet

## 6. Technical Considerations

- The seed SQL is already included in `docs/SCHEMA.sql`
- If schema was run, seed data should already exist
- If not, run the INSERT statements separately

## 7. Acceptance Criteria (Verification)

In Supabase SQL Editor:
```sql
-- Verify account exists
SELECT company_name, slug, subscription_status
FROM accounts
WHERE slug = 'austin-cleanouts';

-- Verify packages exist
SELECT name, price, limit_type, limit_value, sub_payout
FROM packages
WHERE account_id = '11111111-1111-1111-1111-111111111111'
ORDER BY sort_order;

-- Verify upsell targets
SELECT p.name, u.name as upsell_to
FROM packages p
LEFT JOIN packages u ON p.upsell_target_id = u.id
WHERE p.account_id = '11111111-1111-1111-1111-111111111111'
ORDER BY p.sort_order;
```

Expected:
- 1 account: "Austin Cleanouts"
- 4 packages with correct pricing
- Mini → Standard, Standard → Full Day upsells

## 8. Output Files

No new code files. Data exists in Supabase.

---

## Implementation Notes

If seed data wasn't created with schema, run this SQL:

```sql
-- See docs/SCHEMA.sql for full seed data SQL
-- Starting from "SEED DATA: Austin Cleanouts" section
```
