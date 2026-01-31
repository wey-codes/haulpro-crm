# Task: Lead List View

**Status:** pending
**Phase:** 1 - Lead Management
**Depends On:** 00-06-layout-shell
**Estimated Time:** 2 hours

---

## 1. Overview

Create the leads list page showing all leads for the current account with filtering and sorting capabilities.

## 2. Goals

- Display leads in a table format
- Filter by status and source
- Sort by date (newest first)
- Click to navigate to lead detail
- "New Lead" button to create

## 3. User Stories

### 3.1 User can view all leads
**As a** sales rep
**I want** to see all my leads in a list
**So that** I can manage my pipeline

**Acceptance Criteria:**
- [ ] Table displays: Name, Phone, Source, Status, Package Quoted, Created Date
- [ ] Leads sorted by created_at DESC (newest first)
- [ ] Empty state shown when no leads exist
- [ ] Loading state while fetching

### 3.2 User can filter leads
**As a** sales rep
**I want** to filter leads by status
**So that** I can focus on specific pipeline stages

**Acceptance Criteria:**
- [ ] Status filter dropdown with options: All, New, Photo Requested, Quoted, Won, Lost
- [ ] Source filter dropdown with all source options
- [ ] Filters update URL params (shareable/bookmarkable)
- [ ] Clear filters button

### 3.3 User can create new lead
**As a** sales rep
**I want** to click "New Lead" button
**So that** I can add a new lead

**Acceptance Criteria:**
- [ ] "New Lead" button visible at top of page
- [ ] Clicking navigates to `/leads/new`

## 4. Functional Requirements

**FR-1:** Create leads list page at `src/app/(dashboard)/leads/page.tsx`

**FR-2:** Create leads table component at `src/components/leads/leads-table.tsx`:
- Columns: Name, Phone, Source, Status, Quoted Package, Created
- Status displayed as colored badge
- Phone formatted as (xxx) xxx-xxxx
- Date formatted as relative time ("2 days ago")

**FR-3:** Create filter bar component at `src/components/leads/lead-filters.tsx`:
- Status dropdown (Select component)
- Source dropdown (Select component)
- Use URL search params for filter state

**FR-4:** Fetch leads with Supabase:
```typescript
const { data: leads } = await supabase
  .from('leads')
  .select(`
    *,
    quoted_package:packages(name)
  `)
  .order('created_at', { ascending: false })
```

**FR-5:** Status badge colors:
| Status | Color |
|--------|-------|
| new | blue |
| photo_requested | yellow |
| quoted | purple |
| won | green |
| lost | gray |

## 5. Non-Goals

- No inline editing in this task
- No bulk actions in this task
- No pagination yet (add if >50 leads)

## 6. Technical Considerations

- Use Server Component for initial data fetch
- Use URL params for filter state (not React state)
- RLS will automatically filter to current account

## 7. Acceptance Criteria (Verification)

```bash
npm run build        # No build errors
npm run typecheck    # No TypeScript errors
```

Manual testing:
1. Navigate to `/leads` - see leads table (may be empty)
2. Create test lead via Supabase dashboard
3. Refresh - see lead in table
4. Click status filter - table updates
5. Click "New Lead" - navigates to `/leads/new`
6. Click a row - navigates to `/leads/[id]`

## 8. Output Files

```
src/app/(dashboard)/leads/
├── page.tsx                 # List page
└── loading.tsx              # Loading skeleton

src/components/leads/
├── leads-table.tsx          # Table component
├── lead-filters.tsx         # Filter bar
└── lead-status-badge.tsx    # Status badge
```

---

## Implementation Notes

Install additional shadcn components:
```bash
npx shadcn@latest add table select badge
```

Add test data via Supabase SQL:
```sql
INSERT INTO leads (account_id, customer_name, phone, source, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Smith', '+15125551234', 'gmb', 'new'),
  ('11111111-1111-1111-1111-111111111111', 'Jane Doe', '+15125555678', 'facebook', 'quoted');
```
