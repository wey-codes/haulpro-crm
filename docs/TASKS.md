# HaulPro CRM — Task Breakdown

**Platform:** Multi-tenant CRM for junk removal & cleanout businesses
**First Tenant:** Austin Cleanouts (Weylin)
**Pricing:** $20/month flat + payment processing rev share

## How to Use This Document

Each task is sized for **1-4 hours** of focused work. Tasks are ordered by dependency — complete them in sequence within each phase. Each task includes:

- **Description**: What to build
- **Inputs**: What you need before starting
- **Outputs**: What "done" looks like
- **Acceptance Criteria**: How to verify it works

AI coding agents (Claude Code, Cursor, etc.) can take individual tasks as prompts.

---

## Phase 0: Project Setup

### 0.1 — Initialize Project Repository
**Time:** 30 min

**Description:** Create new repo with chosen stack. Recommended: Next.js 14 (App Router) + TypeScript + Tailwind + Supabase (Postgres + Auth + Storage).

**Outputs:**
- [ ] GitHub repo created
- [ ] Next.js app scaffolded with TypeScript
- [ ] Tailwind configured
- [ ] Supabase project created and connected
- [ ] Environment variables documented in `.env.example`
- [ ] README with setup instructions

**Acceptance Criteria:** `npm run dev` starts app on localhost with no errors.

---

### 0.2 — Database Schema Setup
**Time:** 2-3 hours

**Description:** Create all database tables based on PRD data model. Multi-tenant from day one—every table has `account_id`.

**Inputs:** PRD Data Model section

**Outputs:**
- [ ] `accounts` table (tenants)
- [ ] `packages` table (per-account service tiers)
- [ ] `users` table (with account_id FK)
- [ ] `leads` table
- [ ] `jobs` table
- [ ] `subcontractors` table
- [ ] `payouts` table
- [ ] `transactions` table
- [ ] `sms_logs` table
- [ ] Proper foreign keys and indexes
- [ ] Row Level Security policies (isolate by account_id)

**Acceptance Criteria:** All tables created in Supabase, RLS ensures users only see their account's data.

**Key Schema Notes:**
```sql
-- Every tenant table includes:
account_id UUID REFERENCES accounts(id) NOT NULL

-- RLS policy pattern:
CREATE POLICY "Users can only view own account data"
ON table_name FOR ALL
USING (account_id = auth.jwt() -> 'app_metadata' ->> 'account_id');
```

---

### 0.3 — Account & Package Seed Data
**Time:** 1 hour

**Description:** Create Austin Cleanouts as first account with configured packages.

**Outputs:**
- [ ] Austin Cleanouts account record
- [ ] 4 packages configured:
  - Curbside Pickup: $297, flat, prepay required, hidden
  - Mini Rehab: $497, 2hr limit, sub payout $160
  - Standard Rehab: $997, 5hr limit, sub payout $400
  - Full Day Rehab: $1,497, 8hr limit, sub payout $640
- [ ] Weylin as owner user
- [ ] Seed script for easy re-creation

**Acceptance Criteria:** Can query account, see packages, log in as Weylin.

---

### 0.4 — Authentication Setup
**Time:** 1-2 hours

**Description:** Configure Supabase Auth for internal users. Users belong to accounts. Subs don't log in—they use magic links.

**Outputs:**
- [ ] Email/password auth enabled
- [ ] On signup/invite, user linked to account
- [ ] Account ID stored in user metadata (for RLS)
- [ ] Login page
- [ ] Protected route wrapper (checks auth + loads account context)
- [ ] Session management
- [ ] Logout

**Acceptance Criteria:** Can sign up, log in, log out. User can only see their account's data.

---

### 0.5 — Basic Layout & Navigation
**Time:** 1-2 hours

**Description:** Create app shell with sidebar navigation. Shows account name/logo.

**Outputs:**
- [ ] Sidebar with nav items: Dashboard, Leads, Jobs, Subs, Payouts, Settings
- [ ] Account name/logo in sidebar header
- [ ] Mobile-responsive (hamburger menu)
- [ ] Active state on current route
- [ ] User dropdown (profile, logout)

**Acceptance Criteria:** Can navigate between placeholder pages. Account branding visible. Works on mobile.

---

## Phase 1: Lead Management (MVP)

### 1.1 — Lead List View
**Time:** 2 hours

**Description:** Display all leads in a filterable table/list.

**Outputs:**
- [ ] Table showing: Name, Phone, Source, Status, Package Quoted, Created Date
- [ ] Status filter dropdown (New, Photo Requested, Quoted, Won, Lost)
- [ ] Source filter dropdown
- [ ] Click row to view lead detail
- [ ] "New Lead" button

**Acceptance Criteria:** Shows leads from database, filters work, responsive on mobile.

---

### 1.2 — Create/Edit Lead Form
**Time:** 2 hours

**Description:** Form to create new lead or edit existing.

**Inputs:** Lead data model from PRD

**Outputs:**
- [ ] Form fields: Name, Phone, Email (optional), Address, Source (dropdown), Notes
- [ ] Validation (phone required, valid format)
- [ ] Save creates/updates lead in database
- [ ] Success toast notification
- [ ] Redirect to lead detail on save

**Acceptance Criteria:** Can create lead, see it in list, edit it.

---

### 1.3 — Lead Detail View
**Time:** 2-3 hours

**Description:** Full lead detail page with photo management and status workflow.

**Outputs:**
- [ ] Display all lead info
- [ ] Photo gallery (uploaded photos)
- [ ] Photo upload dropzone
- [ ] Status change buttons (move through pipeline)
- [ ] Activity log (status changes, quotes sent)
- [ ] "Send Photo Request" button (placeholder — SMS comes later)
- [ ] "Create Quote" button

**Acceptance Criteria:** Can view lead, upload photos, change status.

---

### 1.4 — Photo Upload & Storage
**Time:** 1-2 hours

**Description:** Enable photo uploads for leads, stored in Supabase Storage.

**Outputs:**
- [ ] Drag-and-drop upload zone
- [ ] Multiple file support
- [ ] Image preview thumbnails
- [ ] Progress indicator
- [ ] Photos linked to lead in database
- [ ] Delete photo functionality

**Acceptance Criteria:** Upload 3 photos, see thumbnails, delete one, refresh and photos persist.

---

### 1.5 — Quote Builder
**Time:** 2 hours

**Description:** Interface to select package and generate quote for a lead. Packages loaded dynamically from account's configured packages.

**Outputs:**
- [ ] Fetch active packages for current account
- [ ] Package selector showing name, price, description
- [ ] Package details displayed (limit type, limit value)
- [ ] Hidden packages only shown via manual toggle
- [ ] Optional notes field
- [ ] "Send Quote" button (marks lead as Quoted, stores quote details)
- [ ] Quote preview text shown before sending

**Acceptance Criteria:** Packages match what's configured in settings. Select package, see preview, send quote updates lead status to "Quoted."

---

## Phase 2: Booking & Jobs (MVP)

### 2.1 — Booking Flow
**Time:** 2-3 hours

**Description:** Convert quoted lead to booked job with scheduling and card on file.

**Inputs:** Lead must be in "Quoted" status

**Outputs:**
- [ ] "Book Job" button on quoted leads
- [ ] Date picker for scheduled date
- [ ] Time window selector (Morning, Afternoon, specific time)
- [ ] Card on file form (integrate Stripe Elements or similar)
- [ ] Card tokenization (never store raw card data)
- [ ] Creates Job record linked to Lead
- [ ] Lead status → "Won"
- [ ] Job status → "Booked"

**Acceptance Criteria:** Book a job, card token stored, job appears in Jobs list.

---

### 2.2 — Payment Integration Setup
**Time:** 2-3 hours

**Description:** Integrate payment processor for card on file and charging.

**Recommended:** Stripe (easy) or evaluate rev-share partners later.

**Outputs:**
- [ ] Stripe account connected (test mode)
- [ ] Stripe Elements card input component
- [ ] Create Stripe Customer on booking
- [ ] Store payment method (card on file)
- [ ] Function to charge card (for later use)
- [ ] Webhook endpoint for payment events

**Acceptance Criteria:** Can save test card, see customer in Stripe dashboard.

---

### 2.3 — Job List View
**Time:** 2 hours

**Description:** Display all jobs in calendar or list format.

**Outputs:**
- [ ] Default view: List sorted by date
- [ ] Toggle: Calendar view (optional, can defer)
- [ ] Columns: Date, Time, Customer, Address, Package, Status, Assigned Sub
- [ ] Status filter (Booked, Assigned, In Progress, Completed)
- [ ] Click to view job detail
- [ ] Color coding by status

**Acceptance Criteria:** See all jobs, filter by status, click to detail.

---

### 2.4 — Job Detail View
**Time:** 2-3 hours

**Description:** Full job management page.

**Outputs:**
- [ ] Customer info section (name, phone, address — click to call/map)
- [ ] Package info (tier, price, time limit)
- [ ] Assigned sub (or "Unassigned")
- [ ] Status with action buttons:
  - Booked → "Send to Subs" (dispatch)
  - Assigned → "Start Job" (manual override)
  - In Progress → "Complete Job"
  - Completed → View receipt
- [ ] Notes section
- [ ] Photos from lead
- [ ] Agreement status (signed or not)
- [ ] Payment status
- [ ] Post-job uploads (receipt, video)

**Acceptance Criteria:** Can view all job info, see status actions.

---

## Phase 3: Sub Dispatch via SMS (MVP)

### 3.1 — Twilio Integration Setup
**Time:** 1-2 hours

**Description:** Connect Twilio for sending and receiving SMS.

**Outputs:**
- [ ] Twilio account with phone number
- [ ] Environment variables configured
- [ ] Send SMS utility function
- [ ] Webhook endpoint to receive incoming SMS
- [ ] Log all messages to `sms_logs` table

**Acceptance Criteria:** Send test SMS from app, receive reply, see both in logs.

---

### 3.2 — Subcontractor Management
**Time:** 2 hours

**Description:** CRUD interface for managing subs.

**Outputs:**
- [ ] Sub list view (Name, Phone, Status, Jobs Completed)
- [ ] Add sub form (Name, Phone, Email)
- [ ] Edit sub
- [ ] Toggle Active/Inactive status
- [ ] View sub detail with job history

**Acceptance Criteria:** Add a sub, see in list, toggle inactive.

---

### 3.3 — Dispatch Blast to Subs
**Time:** 2-3 hours

**Description:** Send job offer SMS to all active subs.

**Inputs:** Job must be in "Booked" status, at least 1 active sub

**Outputs:**
- [ ] "Send to Subs" button on job detail
- [ ] Compose message with job details (date, time, area, package)
- [ ] Send to all active subs
- [ ] Track which subs were sent to
- [ ] Job status → "Pending Claim"
- [ ] Store blast timestamp

**Message Template:**
> "New job available: [Date] [Time Window] [Zip/Area] [Package]. Reply YES to claim."

**Acceptance Criteria:** Click dispatch, all active subs receive SMS.

---

### 3.4 — Claim Detection & Assignment
**Time:** 2-3 hours

**Description:** Process incoming "YES" replies and assign job to first responder.

**Outputs:**
- [ ] Webhook parses incoming SMS
- [ ] Match reply to open job blast (by sub phone + timing)
- [ ] First valid "YES" wins:
  - Assign sub to job
  - Job status → "Assigned"
  - Send confirmation to winner
  - Send "claimed" message to others who replied
- [ ] Handle edge cases (reply after claimed, non-YES replies)
- [ ] Log all in job activity

**Acceptance Criteria:** Two subs reply YES, first gets job, second gets "already claimed."

---

### 3.5 — Morning-of Reminder (Auto)
**Time:** 1-2 hours

**Description:** Automatically send job details to assigned sub morning of job.

**Outputs:**
- [ ] Scheduled job (cron or Supabase edge function) runs at 7 AM daily
- [ ] Find jobs scheduled for today with assigned sub
- [ ] Send reminder SMS with:
  - Full address
  - Customer name + phone
  - Package tier + time limit
  - Notes
  - Magic link to on-site checklist
- [ ] Log reminder sent

**Acceptance Criteria:** Job scheduled for today, sub receives reminder at 7 AM.

---

## Phase 4: On-Site Magic Links (MVP)

### 4.1 — Magic Link Infrastructure
**Time:** 2 hours

**Description:** Create secure, tokenized links that don't require login.

**Outputs:**
- [ ] Generate unique token per job
- [ ] Token stored in jobs table
- [ ] Token expires 24 hours after job completion
- [ ] Public route `/j/[token]` loads job context
- [ ] Invalid/expired tokens show error page
- [ ] Mobile-optimized page wrapper

**Acceptance Criteria:** Generate link, open in browser, see job info without logging in.

---

### 4.2 — On-Site Agreement Signature
**Time:** 2-3 hours

**Description:** Digital signature capture on sub's phone.

**Outputs:**
- [ ] Signature pad component (touch-friendly)
- [ ] Display agreement terms above signature
- [ ] "I Agree" checkbox
- [ ] Clear / redo signature button
- [ ] On submit:
  - Save signature image to storage
  - Record timestamp + IP
  - Update job `agreement_signed = true`
- [ ] Confirmation screen

**Acceptance Criteria:** Sign on phone, see confirmation, job shows agreement signed.

---

### 4.3 — On-Site Payment Collection (Fallback)
**Time:** 2 hours

**Description:** If card on file fails, sub can collect payment on-site.

**Outputs:**
- [ ] Payment step in magic link flow (only shown if needed)
- [ ] Stripe Elements card input
- [ ] Process payment immediately
- [ ] Success confirmation
- [ ] Update job payment status

**Acceptance Criteria:** Enter test card on magic link page, payment succeeds.

---

### 4.4 — Review Request Trigger
**Time:** 1 hour

**Description:** One-tap button to send customer a review request.

**Outputs:**
- [ ] "Request Review" button in magic link flow
- [ ] Sends SMS to customer with Google review link
- [ ] Shows QR code as alternative
- [ ] Records that review was requested
- [ ] Only allow once per job

**Message:**
> "Thanks for choosing Austin Cleanouts! If you loved your garage transformation, we'd appreciate a quick review: [Google Link]"

**Acceptance Criteria:** Tap button, customer receives SMS, can't tap again.

---

### 4.5 — Post-Job Upload (Receipt + Video)
**Time:** 2 hours

**Description:** Sub uploads dump receipt and 10-second video after leaving.

**Outputs:**
- [ ] Separate magic link or section in same flow
- [ ] Receipt photo upload (required)
- [ ] Video upload (required, max 30 sec)
- [ ] Preview before submit
- [ ] Files stored in Supabase Storage
- [ ] Job record updated with file references
- [ ] "Complete Submission" button

**Acceptance Criteria:** Upload receipt + video, see them in job detail view.

---

## Phase 5: Payments & Completion (MVP)

### 5.1 — Charge on Completion
**Time:** 1-2 hours

**Description:** When job marked complete, charge card on file.

**Outputs:**
- [ ] "Complete Job" action on job detail
- [ ] Triggers charge of stored payment method
- [ ] Handle success: Job status → Completed, payment status → Paid
- [ ] Handle failure: Alert to manager, payment status → Failed
- [ ] Create transaction record
- [ ] Send receipt to customer (email or SMS)

**Acceptance Criteria:** Complete job with test card on file, charge succeeds, receipt sent.

---

### 5.2 — Payment Failure Flow
**Time:** 1-2 hours

**Description:** Handle failed charges with escalation path.

**Outputs:**
- [ ] Failed payment triggers alert (in-app notification + optional SMS to manager)
- [ ] Job detail shows "Payment Failed" prominently
- [ ] "Retry Payment" button
- [ ] "Send Payment Link" button (sends customer link to update card)
- [ ] Customer payment update page (public, tokenized)
- [ ] On success, auto-retry charge

**Acceptance Criteria:** Simulate failed charge, see alert, send link, update card, charge succeeds.

---

### 5.3 — Sub Payout Tracking
**Time:** 2 hours

**Description:** Track what's owed to each sub. Payout amount pulled from package's configured sub_payout.

**Outputs:**
- [ ] Auto-create payout record when job completed
- [ ] Payout amount = package.sub_payout (from packages table)
- [ ] Payout list view: Sub, Job, Amount, Bonus, Status (Pending/Paid)
- [ ] Filter by sub, by status
- [ ] "Mark Paid" button (manual for now)
- [ ] Bulk "Mark Paid" for batch processing

**Acceptance Criteria:** Complete job, payout record created with correct amount from package config, can mark paid.

---

### 5.4 — Review Bonus Tracking
**Time:** 1-2 hours

**Description:** Log and verify review bonus claims.

**Outputs:**
- [ ] "Claim Review Bonus" button on job detail (manager view)
- [ ] Modal: Select sub, enter customer name/address mentioned
- [ ] Creates bonus claim (Pending Verification)
- [ ] Manager can verify (checkbox) → adds $25 to payout
- [ ] Bonus shows on payout record

**Acceptance Criteria:** Claim bonus, verify it, see $25 added to sub's payout.

---

## Phase 6: Package Upgrade Flow (P1)

### 6.1 — Time Tracking
**Time:** 2 hours

**Description:** Track elapsed time against package limit.

**Outputs:**
- [ ] "Start Job" action records start time
- [ ] Job detail shows elapsed time (live updating)
- [ ] Shows time remaining in package
- [ ] Progress bar visualization
- [ ] At 80% threshold, visual warning
- [ ] At 100%, "Time Limit Reached" banner

**Acceptance Criteria:** Start job, watch timer count up, see warning at threshold.

---

### 6.2 — Time Alert Notifications
**Time:** 1 hour

**Description:** Alert manager when job hits time threshold.

**Outputs:**
- [ ] At 80% of package time, send notification to manager
- [ ] In-app notification (bell icon with badge)
- [ ] Optional: SMS to manager
- [ ] Links directly to job detail

**Acceptance Criteria:** Job hits 80%, manager sees notification.

---

### 6.3 — Package Upgrade Action
**Time:** 1-2 hours

**Description:** Manager can upgrade package mid-job.

**Outputs:**
- [ ] "Upgrade Package" button on job detail (when at/near limit)
- [ ] Modal showing current vs. upgrade options
- [ ] Price difference displayed
- [ ] Confirmation required
- [ ] On confirm:
  - Store original package
  - Update to new package
  - New time limit applies
  - Log upgrade in activity
- [ ] Charge difference on completion (handled by completion flow)

**Acceptance Criteria:** Upgrade Mini to Standard, see new time limit, complete job charges $997.

---

## Phase 7: Reporting & Dashboard (P1)

### 7.1 — Dashboard Overview
**Time:** 2-3 hours

**Description:** At-a-glance metrics for the business.

**Outputs:**
- [ ] Cards showing:
  - Jobs this week (count + revenue)
  - Jobs today
  - Pending payouts total
  - Outstanding payments (failed)
- [ ] Jobs by status chart
- [ ] Revenue trend (last 30 days)
- [ ] Recent activity feed

**Acceptance Criteria:** Dashboard loads with real data, updates when jobs change.

---

### 7.2 — Lead Source ROI
**Time:** 1-2 hours

**Description:** Track which sources produce booked jobs.

**Outputs:**
- [ ] Report: Leads by source
- [ ] Columns: Source, Total Leads, Quoted, Booked, Revenue, Conversion Rate
- [ ] Date range filter
- [ ] Highlight best performing source

**Acceptance Criteria:** See GMB has 50% conversion, Facebook has 20%.

---

### 7.3 — Close Rate Monitoring
**Time:** 1-2 hours

**Description:** Track quote-to-book conversion with pricing alert.

**Outputs:**
- [ ] Close rate calculated: Booked / Quoted (rolling 2 weeks)
- [ ] Display on dashboard
- [ ] If >80% for 2 weeks: Show alert "Consider raising Standard to $1,097"
- [ ] Dismiss alert (stores dismissal)

**Acceptance Criteria:** Close rate shows correctly, alert appears when threshold hit.

---

### 7.4 — Manager Daily Checklist
**Time:** 1-2 hours

**Description:** Audit view for daily manager tasks.

**Outputs:**
- [ ] Page showing today's completed jobs
- [ ] Checklist per job:
  - [ ] Agreement signed?
  - [ ] Payment collected?
  - [ ] Dump receipt uploaded?
  - [ ] Video uploaded?
  - [ ] Review requested?
- [ ] Filter: Show only incomplete items
- [ ] Links to job detail to resolve

**Acceptance Criteria:** See which jobs are missing documentation, click through to fix.

---

## Phase 8: SMS Conversation Log (P2)

### 8.1 — SMS History View
**Time:** 2 hours

**Description:** View all SMS conversations in one place.

**Outputs:**
- [ ] List of conversations (grouped by phone number)
- [ ] Click to expand full thread
- [ ] Shows timestamp, direction (in/out), message
- [ ] Link to associated lead/job if identifiable
- [ ] Search by phone or keyword

**Acceptance Criteria:** See all texts with a sub, scroll through history.

---

### 8.2 — Send Manual SMS
**Time:** 1 hour

**Description:** Send ad-hoc SMS from within the app.

**Outputs:**
- [ ] "Send SMS" button on lead/job/sub detail pages
- [ ] Compose modal with recipient pre-filled
- [ ] Template dropdown (optional)
- [ ] Send button
- [ ] Message logged to history

**Acceptance Criteria:** Send custom text from job page, see in SMS log.

---

## Phase 9: Settings & Configuration (P2)

### 9.1 — Account Settings Page
**Time:** 2 hours

**Description:** Allow account owners to configure their account.

**Outputs:**
- [ ] Settings page with tabs: Company, Packages, Team, Billing
- [ ] Company tab:
  - Edit company name
  - Upload logo
  - Set Google review URL
  - Edit agreement template text
- [ ] Save updates to account record
- [ ] Logo stored in Supabase Storage

**Acceptance Criteria:** Change company name, see it reflected in sidebar/magic links.

---

### 9.2 — Package Configuration
**Time:** 2-3 hours

**Description:** Allow account owners to customize their service packages.

**Outputs:**
- [ ] Packages tab in settings
- [ ] List current packages (drag to reorder)
- [ ] Edit package modal:
  - Name, Price, Limit Type, Limit Value
  - Sub Payout amount
  - Requires Prepay toggle
  - Hidden toggle
  - Upsell Target dropdown
  - Description
- [ ] Add new package (max 6)
- [ ] Deactivate package (soft delete)
- [ ] Changes reflect immediately in quote builder

**Acceptance Criteria:** Add a new package, see it in quote builder. Edit price, see updated price.

---

### 9.3 — Team Management
**Time:** 2 hours

**Description:** Invite and manage team members.

**Outputs:**
- [ ] Team tab in settings
- [ ] List current team members (name, email, role, status)
- [ ] Invite new member (email + role)
- [ ] Invitation email sent via Supabase Auth
- [ ] Edit member role
- [ ] Deactivate member
- [ ] Owner cannot be deactivated

**Acceptance Criteria:** Invite a VA, they receive email, can log in with limited access.

---

### 9.4 — Billing & Subscription (Placeholder)
**Time:** 1 hour

**Description:** Placeholder for Stripe subscription management.

**Outputs:**
- [ ] Billing tab in settings
- [ ] Shows current plan ($20/month)
- [ ] Shows payment method on file
- [ ] Link to Stripe Customer Portal (for updating card, canceling)
- [ ] Displays next billing date

**Acceptance Criteria:** Can view subscription status, click through to Stripe portal.

---

## Phase 10: Polish & Edge Cases (P2)

### 10.1 — Customer Self-Service Quote Request
**Time:** 2-3 hours

**Description:** Public form for customers to request quotes.

**Outputs:**
- [ ] Public page at `/[account-slug]/quote`
- [ ] Form: Name, Phone, Address, Photo upload, Notes
- [ ] Shows account's branding (logo, name)
- [ ] Submit creates lead in that account
- [ ] Confirmation message to customer
- [ ] Lead source = "Website"

**Acceptance Criteria:** Customer submits form, lead appears in correct account's CRM.

---

### 10.2 — Repeat Customer Detection
**Time:** 1-2 hours

**Description:** Flag when a lead matches existing customer.

**Outputs:**
- [ ] On lead create, check for matching phone/address within account
- [ ] If match found, show "Returning Customer" badge
- [ ] Link to previous jobs
- [ ] Notes carry over

**Acceptance Criteria:** Create lead with existing phone, see previous job history.

---

### 10.3 — Job Cancellation Flow
**Time:** 1-2 hours

**Description:** Handle cancelled jobs properly.

**Outputs:**
- [ ] "Cancel Job" action on job detail
- [ ] Require cancellation reason
- [ ] If sub assigned, notify them via SMS
- [ ] Lead status → "Lost" or stays "Quoted" (configurable)
- [ ] No payout created
- [ ] Activity logged

**Acceptance Criteria:** Cancel assigned job, sub gets notified, no payout generated.

---

### 10.4 — Prepay Package Handling
**Time:** 1 hour

**Description:** Packages marked "Requires Prepay" charge immediately at booking.

**Outputs:**
- [ ] When prepay package selected, show "Prepay Required" notice
- [ ] Charge card immediately at booking (not on completion)
- [ ] Job marked as prepaid
- [ ] Completion doesn't re-charge

**Acceptance Criteria:** Book prepay package (e.g., Curbside), card charged immediately.

---

### 10.5 — Public Marketing Site (Future)
**Time:** 4-6 hours (optional, can outsource)

**Description:** Simple landing page for HaulPro to acquire new accounts.

**Outputs:**
- [ ] Landing page at haul.pro or similar
- [ ] Value props, pricing ($20/month), feature list
- [ ] "Start Free Trial" CTA
- [ ] Account signup flow
- [ ] Onboarding wizard (company name, packages, first user)

**Acceptance Criteria:** New operator can sign up, configure account, start using.

---

## Task Summary by Phase

| Phase | Tasks | Est. Hours | Priority |
|-------|-------|------------|----------|
| 0: Setup | 5 tasks | 6-10 hrs | MVP |
| 1: Leads | 5 tasks | 9-12 hrs | MVP |
| 2: Booking & Jobs | 4 tasks | 8-11 hrs | MVP |
| 3: Sub Dispatch | 5 tasks | 9-12 hrs | MVP |
| 4: Magic Links | 5 tasks | 9-12 hrs | MVP |
| 5: Payments | 4 tasks | 6-8 hrs | MVP |
| 6: Upgrades | 3 tasks | 4-5 hrs | P1 |
| 7: Reporting | 4 tasks | 6-9 hrs | P1 |
| 8: SMS Log | 2 tasks | 3 hrs | P2 |
| 9: Settings | 4 tasks | 7-8 hrs | P2 |
| 10: Polish | 5 tasks | 10-15 hrs | P2/P3 |

**Total MVP (Phases 0-5):** ~47-65 hours
**Total with P1 (Phases 6-7):** ~57-79 hours
**Total All (Phases 0-10):** ~77-105 hours

---

## Build Strategy

### Stage 1: Build for Austin Cleanouts (Weeks 1-4)
Complete Phases 0-5 (MVP). Weylin uses it daily. Find bugs, refine UX.

### Stage 2: Harden & Add P1 Features (Weeks 5-6)
Add time tracking, upgrades, reporting. Continue using in production.

### Stage 3: Multi-Tenant Prep (Week 7)
- Test account isolation thoroughly
- Build account settings UI (Phase 9)
- Create onboarding flow

### Stage 4: Soft Launch (Week 8+)
- Invite 3-5 beta operators (free for feedback)
- Iterate based on their needs
- Launch publicly at $20/month

---

## How to Use with AI Coding Agents

### Claude Code / Cursor / Similar

For each task, provide:
1. This task's section (copy/paste)
2. The relevant PRD section for context
3. Current codebase access
4. Database schema (once created)

**Example Prompt:**
```
Here's the task I need to complete:

[Paste task 1.1 — Lead List View]

For context, here's the data model:
[Paste Lead schema from PRD]

The project uses Next.js 14 with Supabase. Create the lead list component with filtering.
```

### Tips for Best Results
- One task at a time
- Let the agent complete and test before moving on
- If task is too big, ask agent to break it down further
- Always provide acceptance criteria so agent knows when it's done

---

*Last Updated: Jan 2025*
