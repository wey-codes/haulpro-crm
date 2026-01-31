# Task: Lead Detail View

**Status:** pending
**Phase:** 1 - Lead Management
**Depends On:** 01-02-lead-form
**Estimated Time:** 2 hours

---

## 1. Overview

Create the lead detail page showing all lead information, status workflow, and action buttons. This is the main hub for managing a single lead.

## 2. Goals

- Display all lead information
- Show status with action buttons to progress
- Display activity log
- Provide quick actions (Edit, Create Quote, etc.)

## 3. User Stories

### 3.1 User can view lead details
**As a** sales rep
**I want** to see all information about a lead
**So that** I can understand their needs

**Acceptance Criteria:**
- [ ] Page at `/leads/[id]` shows lead info
- [ ] Displays: Name, Phone (clickable), Email, Address, Source, Notes
- [ ] Shows current status prominently
- [ ] Shows when lead was created and last updated

### 3.2 User can change lead status
**As a** sales rep
**I want** to move a lead through the pipeline
**So that** I can track their progress

**Acceptance Criteria:**
- [ ] Status buttons based on current status:
  - New → "Request Photos"
  - Photo Requested → "Mark Photos Received"
  - (Any) → "Mark as Lost"
- [ ] Clicking button updates status and shows toast
- [ ] Activity log entry created

### 3.3 User can navigate to related actions
**As a** sales rep
**I want** quick access to lead actions
**So that** I can work efficiently

**Acceptance Criteria:**
- [ ] "Edit" button → navigates to edit form
- [ ] "Create Quote" button → navigates to quote builder (placeholder)
- [ ] Phone number is clickable (tel: link)
- [ ] Address is clickable (opens Google Maps)

## 4. Functional Requirements

**FR-1:** Create lead detail page at `src/app/(dashboard)/leads/[id]/page.tsx`

**FR-2:** Create lead header component at `src/components/leads/lead-header.tsx`:
- Lead name and status badge
- Action buttons (Edit, Quote, etc.)
- Back to list link

**FR-3:** Create lead info card at `src/components/leads/lead-info-card.tsx`:
- Contact section: Phone, Email
- Location section: Address (formatted)
- Details section: Source, Created date

**FR-4:** Create status actions component at `src/components/leads/lead-status-actions.tsx`:
- Shows available actions based on current status
- Buttons styled with appropriate colors

**FR-5:** Create activity log component at `src/components/leads/lead-activity.tsx`:
- Shows recent activity (status changes, etc.)
- Timestamp and description for each entry
- Placeholder for now, will populate when we log activities

**FR-6:** Status action mapping:
| Current Status | Available Actions |
|----------------|-------------------|
| new | Request Photos, Create Quote, Mark Lost |
| photo_requested | Photos Received, Create Quote, Mark Lost |
| quoted | (handled by booking flow), Mark Lost |
| won | (read-only) |
| lost | Reopen Lead |

**FR-7:** Server Actions for status changes at `src/app/(dashboard)/leads/[id]/actions.ts`:
```typescript
'use server'

export async function updateLeadStatus(id: string, status: LeadStatus) {
  // Update status
  // Create activity log entry
  // Revalidate page
}
```

## 5. Non-Goals

- No photo display yet (separate task)
- No quote builder yet (separate task)
- No SMS sending yet (later phase)

## 6. Technical Considerations

- Fetch lead data in Server Component
- Use Server Actions for status updates
- Phone link: `tel:+15125551234`
- Maps link: `https://maps.google.com/?q=ADDRESS`

## 7. Acceptance Criteria (Verification)

```bash
npm run build        # No build errors
npm run typecheck    # No TypeScript errors
```

Manual testing:
1. Click a lead in list → see detail page
2. See all lead information displayed
3. Click phone number → phone app opens (on mobile)
4. Click "Request Photos" → status changes to photo_requested
5. Click Edit → navigates to edit form
6. Click back → returns to leads list

## 8. Output Files

```
src/app/(dashboard)/leads/[id]/
├── page.tsx                 # Detail page
├── actions.ts               # Status change actions
└── loading.tsx              # Loading skeleton

src/components/leads/
├── lead-header.tsx          # Header with actions
├── lead-info-card.tsx       # Info display
├── lead-status-actions.tsx  # Status workflow buttons
└── lead-activity.tsx        # Activity log
```

---

## Implementation Notes

Example layout structure:
```tsx
<div className="space-y-6">
  <LeadHeader lead={lead} />

  <div className="grid md:grid-cols-3 gap-6">
    <div className="md:col-span-2 space-y-6">
      <LeadInfoCard lead={lead} />
      <LeadPhotos lead={lead} /> {/* Placeholder */}
    </div>

    <div className="space-y-6">
      <LeadStatusActions lead={lead} />
      <LeadActivity leadId={lead.id} />
    </div>
  </div>
</div>
```
