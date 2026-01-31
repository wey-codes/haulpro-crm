# Task: Quote Builder

**Status:** pending
**Phase:** 1 - Lead Management
**Depends On:** 01-04-photo-upload
**Estimated Time:** 2 hours

---

## 1. Overview

Create an interface to select a package and generate a quote for a lead. Packages are loaded dynamically from the account's configured packages.

## 2. Goals

- Display available packages from account config
- Allow package selection with preview
- Save quote to lead record
- Update lead status to "quoted"

## 3. User Stories

### 3.1 User can view available packages
**As a** sales rep
**I want** to see all my account's packages
**So that** I can choose the right one for this job

**Acceptance Criteria:**
- [ ] Quote builder page at `/leads/[id]/quote`
- [ ] Shows all active packages from account
- [ ] Hidden packages shown with toggle
- [ ] Package cards show: Name, Price, Description, Time/Volume limit

### 3.2 User can select a package
**As a** sales rep
**I want** to select a package for this lead
**So that** I can send them a quote

**Acceptance Criteria:**
- [ ] Click package to select it
- [ ] Selected package highlighted
- [ ] Quote preview shown with selected package
- [ ] Can add optional notes to quote

### 3.3 User can send the quote
**As a** sales rep
**I want** to save the quote to the lead
**So that** I can track what was quoted

**Acceptance Criteria:**
- [ ] "Save Quote" button creates quote on lead
- [ ] Lead status changes to "quoted"
- [ ] Lead shows quoted package and price
- [ ] Toast confirms quote saved
- [ ] Redirects to lead detail

## 4. Functional Requirements

**FR-1:** Create quote page at `src/app/(dashboard)/leads/[id]/quote/page.tsx`

**FR-2:** Fetch packages for current account:
```typescript
const { data: packages } = await supabase
  .from('packages')
  .select('*')
  .eq('account_id', accountId)
  .eq('is_active', true)
  .order('sort_order')
```

**FR-3:** Create package card component at `src/components/quotes/package-card.tsx`:
- Package name and price
- Description
- Limit info (e.g., "Up to 5 hours")
- Selected state styling
- Hidden indicator if applicable

**FR-4:** Create quote preview component at `src/components/quotes/quote-preview.tsx`:
- Shows selected package details
- Shows total price
- Notes input field
- Preview of quote message

**FR-5:** Quote message template:
```
Thanks for reaching out! Based on the photos, here's what I recommend:

{PACKAGE_NAME}: ${PACKAGE_PRICE}
{PACKAGE_DESCRIPTION}

{NOTES}

Ready to book? Let me know a date that works for you!
```

**FR-6:** Server Action at `src/app/(dashboard)/leads/[id]/quote/actions.ts`:
```typescript
'use server'

export async function createQuote(leadId: string, packageId: string, notes?: string) {
  // Update lead with quoted_package_id, quoted_price, quoted_at
  // Update lead status to 'quoted'
  // Create activity log entry
  // Redirect to lead detail
}
```

**FR-7:** Show hidden packages with toggle:
- Default: hidden packages not shown
- Toggle: "Show hidden packages" reveals them
- Hidden packages marked with indicator

## 5. Non-Goals

- No SMS sending in this task (later phase)
- No payment collection in this task
- No quote history (only latest quote stored)

## 6. Technical Considerations

- Hidden packages (like Curbside) only shown with explicit toggle
- Price comes from package table, not user input
- Quote is stored on lead record, not separate table

## 7. Acceptance Criteria (Verification)

```bash
npm run build        # No build errors
npm run typecheck    # No TypeScript errors
```

Manual testing:
1. Go to lead detail → click "Create Quote"
2. See 3 packages (Curbside hidden by default)
3. Toggle hidden → see Curbside
4. Click "Standard Rehab" → selected, preview shows $997
5. Add notes → reflected in preview
6. Click "Save Quote" → redirected to lead detail
7. Lead shows status "Quoted", package "Standard Rehab", price $997

## 8. Output Files

```
src/app/(dashboard)/leads/[id]/quote/
├── page.tsx                 # Quote builder page
└── actions.ts               # Save quote action

src/components/quotes/
├── package-card.tsx         # Package display card
├── package-grid.tsx         # Grid of packages
└── quote-preview.tsx        # Preview panel
```

---

## Implementation Notes

Package card example:
```tsx
<Card
  className={cn(
    "cursor-pointer transition-all",
    isSelected && "ring-2 ring-primary"
  )}
  onClick={() => onSelect(package)}
>
  <CardHeader>
    <div className="flex justify-between">
      <CardTitle>{package.name}</CardTitle>
      <span className="text-2xl font-bold">${package.price}</span>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">{package.description}</p>
    {package.limit_type === 'time' && (
      <Badge variant="secondary">Up to {package.limit_value} hours</Badge>
    )}
  </CardContent>
</Card>
```
