# Task: Create/Edit Lead Form

**Status:** pending
**Phase:** 1 - Lead Management
**Depends On:** 01-01-lead-list
**Estimated Time:** 2 hours

---

## 1. Overview

Create a form to add new leads and edit existing leads. Includes validation and server-side persistence.

## 2. Goals

- Create lead form with all required fields
- Validate inputs (phone format, required fields)
- Save to database via Server Action
- Support both create and edit modes

## 3. User Stories

### 3.1 User can create a new lead
**As a** sales rep
**I want** to fill out a form to create a lead
**So that** I can add new potential customers

**Acceptance Criteria:**
- [ ] Form at `/leads/new` with fields: Name, Phone, Email, Address, Source, Notes
- [ ] Phone and Name are required
- [ ] Phone validates format
- [ ] Submit creates lead in database
- [ ] Success shows toast and redirects to lead detail
- [ ] Error shows inline message

### 3.2 User can edit an existing lead
**As a** sales rep
**I want** to edit a lead's information
**So that** I can correct or update details

**Acceptance Criteria:**
- [ ] Form at `/leads/[id]/edit` pre-filled with current data
- [ ] Submit updates lead in database
- [ ] Success shows toast and redirects to lead detail

## 4. Functional Requirements

**FR-1:** Create new lead page at `src/app/(dashboard)/leads/new/page.tsx`

**FR-2:** Create edit lead page at `src/app/(dashboard)/leads/[id]/edit/page.tsx`

**FR-3:** Create reusable form component at `src/components/leads/lead-form.tsx`:
- Props: `initialData?: Lead`, `onSubmit: (data) => Promise<void>`
- Uses React Hook Form + Zod for validation

**FR-4:** Form fields:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| customer_name | text | yes | min 2 chars |
| phone | tel | yes | valid phone format |
| email | email | no | valid email if provided |
| address_line1 | text | no | - |
| address_line2 | text | no | - |
| city | text | no | - |
| state | text | no | - |
| zip | text | no | - |
| source | select | yes | must be valid source enum |
| notes | textarea | no | - |

**FR-5:** Create Server Action at `src/app/(dashboard)/leads/actions.ts`:
```typescript
'use server'

export async function createLead(formData: FormData) {
  // Validate, insert, redirect
}

export async function updateLead(id: string, formData: FormData) {
  // Validate, update, redirect
}
```

**FR-6:** Source dropdown options:
- Google (gmb)
- Facebook (facebook)
- Instagram (instagram)
- Phone Call (call)
- Text Message (text)
- Walk-in (walk_in)
- Bandit Sign (bandit_sign)
- Website (website)
- Referral (referral)
- Other (other)

## 5. Non-Goals

- No photo upload in this task (separate task)
- No quote assignment in this task

## 6. Technical Considerations

- Use Zod for validation schema
- Use React Hook Form for form state
- Format phone as user types: (512) 555-1234
- Redirect using Next.js redirect() in Server Action

## 7. Acceptance Criteria (Verification)

```bash
npm run build        # No build errors
npm run typecheck    # No TypeScript errors
```

Manual testing:
1. Go to `/leads/new` - see empty form
2. Submit without filling - see validation errors
3. Fill required fields, submit - lead created, redirected
4. Go to leads list - see new lead
5. Click lead, click Edit - see pre-filled form
6. Change name, submit - updated, redirected

## 8. Output Files

```
src/app/(dashboard)/leads/
├── new/
│   └── page.tsx             # New lead page
├── [id]/
│   └── edit/
│       └── page.tsx         # Edit lead page
└── actions.ts               # Server actions

src/components/leads/
└── lead-form.tsx            # Reusable form

src/lib/
└── validations/
    └── lead.ts              # Zod schema
```

---

## Implementation Notes

Install dependencies:
```bash
npm install react-hook-form @hookform/resolvers zod
npx shadcn@latest add form label textarea toast
```

Example Zod schema:
```typescript
export const leadSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?1?\d{10,14}$/, "Invalid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  source: z.enum(["gmb", "facebook", ...]),
  // ...
})
```
