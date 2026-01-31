# HaulPro CRM — Product Requirements Document

## Executive Summary

A lightweight, opinionated CRM and dispatch platform purpose-built for **junk removal and cleanout businesses**. Designed to be the simplest, cheapest, and most effective tool in the market—built by an operator, for operators.

The platform supports **garage cleanouts, junk hauling, estate cleanouts, hoarding remediation, foreclosure cleanouts, and general debris removal**. Each account can customize their service packages, pricing, and branding.

**Build Strategy:**
1. Build for Austin Cleanouts first (Weylin's operation)
2. Harden and refine based on real usage
3. Open to other junk removal operators at $20/month
4. Scale via embedded payment rev share

**Business Model for Software:**
- **$20/month flat** — cheapest in market, no per-user fees, no feature gating
- **Primary revenue:** Embedded payment processing rev share (~1% on all transactions via SaaS payment partner, e.g., Fullsteam, Rainforest, Finix)
- At scale: 100 operators × $20k/month processed = $20k/month in payment rev share + $2k in subscriptions

**Target Users:**
- Owner/Manager (command center)
- Sales Rep / VA (lead handling, booking)
- Subcontractors (SMS-only interface with magic links for key actions)

**Why This Wins:**
- No one builds specifically for junk removal / cleanout operators
- Existing tools (Jobber, Housecall Pro) are bloated, expensive, and generic
- We're opinionated: time-block packages, SMS-first sub dispatch, magic links for on-site
- Built by someone running the business, not a software company guessing

---

## Problem Statement

Existing CRMs for junk removal are either:
1. **Too bloated** — built for general contractors with features we'll never use (Jobber, Housecall Pro = $50-150/month)
2. **Too generic** — don't support our specific workflow (time-block packages, sub dispatch via SMS, on-site agreements, review bonus tracking)
3. **Wrong payment model** — charge per user, per feature, nickel-and-dime on everything

We need a lightweight, opinionated CRM that mirrors how junk removal actually works:
- Fixed-price packages (time blocks, truck loads, or flat rates—configurable per account)
- Subcontractors dispatched via text, not an app they won't check
- On-site "magic link" moments (signature, payment, review request)
- Card on file at booking, charge on completion
- Built-in protection against scope creep (hard time stops, upsell triggers)

---

## Multi-Tenant Architecture

The platform is **multi-tenant from day one**. Each account (company) gets their own:

### Configurable Per Account

| Setting | Description | Example Options |
|---------|-------------|-----------------|
| **Company Name** | Displayed on customer-facing pages | "Austin Cleanouts", "Junk King ATX" |
| **Company Logo** | Used on agreements, receipts, magic links | Upload PNG/SVG |
| **Phone Number** | For SMS (Twilio sub-account or shared pool) | Dedicated or pooled |
| **Service Packages** | Fully customizable tiers | See below |
| **Pricing Model** | How packages are priced | Time-block, Per Load, Flat Rate, Hourly |
| **Package Names** | Custom naming | "Mini Rehab" vs "Half Load" vs "Small Cleanout" |
| **Package Prices** | Set your own | $297, $497, $997, etc. |
| **Package Limits** | Time or volume caps | 2 hours, 1/2 truck, etc. |
| **Sub Pay Rates** | What you pay subs per package | $160, $400, etc. |
| **Agreement Text** | Custom terms/waiver language | Editable template |
| **Review Link** | Google Business Profile URL | Links to their GMB |
| **Payment Account** | Connected Stripe/processor account | Stripe Connect |

### Default Package Templates

New accounts get starter templates they can customize:

**Template A: Time-Block Model (Austin Cleanouts Style)**
| Package | Default Price | Time Limit |
|---------|---------------|------------|
| Quick Pickup | $297 | Flat (curbside) |
| Half Day | $497 | 2 hours |
| Standard | $997 | 5 hours |
| Full Day | $1,497 | 8 hours |

**Template B: Load-Based Model (Traditional Junk Removal)**
| Package | Default Price | Volume |
|---------|---------------|--------|
| Minimum | $150 | Few items |
| 1/4 Truck | $275 | Quarter load |
| 1/2 Truck | $375 | Half load |
| Full Truck | $550 | Full truck |

**Template C: Flat Rate Model (Estate/Hoarding)**
| Package | Default Price | Scope |
|---------|---------------|-------|
| Single Room | $500 | One room cleanout |
| Multi-Room | $1,200 | 2-3 rooms |
| Whole House | $2,500+ | Full estate |

Operators can create up to **6 custom packages** with any naming, pricing, and limits they want.

### Data Isolation

- Each account's data is completely isolated
- Subs, leads, jobs, customers never cross accounts
- Shared infrastructure, separate data
- Account admins can add team members with role-based access

---

## User Roles & Permissions

### 1. Owner/Manager
- Full access to everything
- Dispatch control (assign/reassign jobs)
- Financial overview (revenue, payouts, margins)
- Sub management (add/remove from active list, view performance)
- Override capabilities (manual adjustments, escalation handling)

### 2. Sales Rep / VA
- Lead management (create, update, move through pipeline)
- Send photo requests
- Create and send quotes
- Book jobs (collect card on file — **never charge at booking**)
- View upcoming schedule
- Handle payment escalations (card failures)
- **Cannot:** See sub payouts, adjust pricing tiers, access financial reports

### 3. Subcontractors (via SMS + Magic Links)
- Receive job offers via text
- Reply to claim jobs (first reply wins)
- Receive job details and reminders via text
- Access on-site magic links:
  - Customer agreement signature
  - Payment collection (escalation only)
  - Review request trigger
  - Dump receipt upload
  - 10-second video upload
- **Cannot:** See other jobs, other subs, customer payment details, or business financials

---

## Service Packages (Configurable Per Account)

Each account defines their own packages. Below is the **Austin Cleanouts configuration** (first tenant):

| Package | Price | Time Block | Use Case |
|---------|-------|------------|----------|
| Curbside Pickup | $297 | Flat | Items already on curb, no entry, prepay only |
| Mini Rehab | $497 | 2 hours max | Partial garage, quick clear, light organization |
| Standard Rehab | $997 | 5 hours max | Full 2-car garage, heavy clutter, deep organization |
| Full Day Rehab | $1,497 | 8 hours max | Hoarding, estates, multi-area projects |

**Package Configuration Options (All Accounts):**

| Field | Description |
|-------|-------------|
| Package Name | Display name (e.g., "Standard Rehab", "Half Truck") |
| Price | Customer-facing price |
| Limit Type | Time-based, Volume-based, or Flat |
| Limit Value | Hours, truck percentage, or "N/A" for flat |
| Sub Payout | What the sub gets paid for this package |
| Requires Prepay | Yes/No (e.g., Curbside requires prepay) |
| Hidden | Yes/No (don't show on quotes unless manually selected) |
| Upsell Target | Which package to suggest upgrading to |
| Description | Customer-facing description |

**Pricing Rules (Austin Cleanouts):**
- No negotiation — packages are fixed
- Curbside is a "hidden" fallback only offered if customer refuses $497 minimum
- If close rate exceeds 80% for 2 consecutive weeks → bump Standard to $1,097

**Quoting Strategy:**
- Always estimate conservatively (quote higher tier when borderline)
- Protects margins and creates natural upsell path
- Better to finish early than hit time cap mid-job

---

## Core Workflows

### 1. Lead Intake → Quote Pipeline

```
Lead Source (GMB, Facebook, Call, Text, Bandit Sign)
    ↓
Lead Created in CRM (auto or manual)
    ↓
Photo Request Sent (templated text message)
    ↓
Photos Received → Attached to Lead
    ↓
Sales Rep Reviews → Assigns Package Tier
    ↓
Quote Sent (text with package details + price)
    ↓
Customer Accepts → Booking Flow
```

**Photo Request Template:**
> "Hi! For a quick quote, please send a few pics: wide shot from the garage door, both corners, and closeups of any heavy items. Also let me know if there are stairs involved!"

### 2. Booking Flow

```
Customer Accepts Quote
    ↓
Sales Rep Collects Card on File (NOT charged)
    ↓
Job Created with:
    - Customer info
    - Address
    - Package tier
    - Scheduled date/time window
    - Card on file (tokenized)
    - Notes from photos/conversation
    ↓
Job Status: BOOKED
```

**Critical:** Card is stored securely but **never charged at booking**. Charge happens only on job completion.

### 3. Sub Dispatch (SMS-First)

```
Job Ready for Dispatch
    ↓
Manager Triggers "Blast" to Active Subs List
    ↓
SMS Sent: "New job available: [Date] [Time Window] [Area/Zip] [Package Tier]. Reply YES to claim."
    ↓
System Tracks Replies with Timestamps
    ↓
First Valid "YES" Wins → Job Assigned
    ↓
Confirmation SMS to Winning Sub
    ↓
Rejection SMS to Others: "Job claimed. We'll text you on the next one."
    ↓
Job Status: ASSIGNED
```

**Sub List Management:**
- Subs can be marked Active/Inactive
- Bad performers get removed from blast list (manual)
- No formal "claiming" UI — just text replies

### 4. Pre-Job Reminders

**Morning of Job (Auto-Send to Sub):**
> "Reminder: Today's job
> 📍 [Full Address]
> 👤 [Customer Name] — [Phone]
> 📦 [Package Tier] ([X] hour max)
> 📝 Notes: [Any special instructions]
>
> Text us when you arrive. Link for on-site checklist: [Magic Link]"

### 5. On-Site Workflow (Sub's Magic Link)

When sub taps the magic link, they see a simple mobile-optimized page:

**Step 1: Customer Agreement**
- Digital signature capture
- Displays terms (liability waiver, payment authorization, scope)
- Customer signs on sub's phone
- Timestamped and stored

**Step 2: Job In Progress**
- Sub verbally communicates with customer:
  - "What's going? What's staying?"
  - "How do you want this organized?"
- Sub acts as an **organizer**, not just a hauler
- The longer the job takes (within time block), the more thorough the service

**Step 3: Time Tracking**
- System tracks elapsed time against package limit
- At 80% of time block (e.g., 1:36 for Mini, 4:00 for Standard):
  - Alert sent to Manager: "Job [#] approaching time limit"
- At 100% of time block:
  - **Hard stop** — work pauses
  - Sub must get verbal approval to upgrade package
  - Manager updates package in CRM
  - Work continues

**Step 4: Job Completion**
- Sub marks job complete
- System charges card on file
- Customer receives receipt via text/email

**Step 5: Review Request**
- Sub can tap "Request Review"
- Sends customer a text with direct link to Google review
- Or displays QR code for customer to scan

### 6. Post-Job Documentation (Sub's Upload Link)

After leaving job site, sub receives text:
> "Nice work! Please upload:
> 📄 Dump receipt photo
> 🎥 10-second video ("Just finished at [Location]!")
>
> Upload here: [Magic Link]"

Both are required for:
- Expense verification
- Marketing content
- Brand standard compliance

### 7. Payment Collection

**Normal Flow:**
1. Card on file collected at booking
2. Charged automatically on job completion
3. Customer receives receipt

**Escalation Flow (Card Failure):**
1. Charge fails → Alert to Sales Rep
2. Sales Rep calls customer to update card
3. If unreachable → Sub has fallback payment link
4. Sub shows customer the link to enter new payment method on-site
5. Payment collected → Job marked complete

### 8. Review Bonus Tracking

**Process:**
1. Sub texts manager: "Got a review from the [Address/Customer Name] job"
2. Manager verifies:
   - Was it a real job that day?
   - Is there a new Google review matching?
3. If verified → Mark $25 bonus for that sub on that job

**Future Enhancement:** Auto-scan Google reviews for sub name mentions.

### 9. Sub Payouts

| Package | Sub Payout | Notes |
|---------|------------|-------|
| Curbside | $60-80 | Flat rate (high margin) |
| Mini ($497) | $160 | + $25 review bonus if earned |
| Standard ($997) | $400 | + $25 review bonus if earned |
| Full Day ($1,497) | $640 | Scale with volume |

**Payout = Scheduled package time × $40/hr × 2 workers**

Dump fees paid by company (tracked via receipt uploads).

---

## Data Model

### Account (Tenant)
- ID
- Company Name
- Slug (URL-friendly identifier)
- Logo URL
- Phone Number
- Twilio Config (sub-account or shared)
- Google Review URL
- Agreement Template (text)
- Stripe Account ID (Connect)
- Subscription Status (Active, Trial, Cancelled)
- Subscription Plan
- Owner User ID
- Settings JSON (flexible config)
- Created At
- Updated At

### Package (Per Account)
- ID
- Account ID (FK)
- Name
- Price
- Limit Type (time, volume, flat)
- Limit Value
- Sub Payout
- Requires Prepay (boolean)
- Is Hidden (boolean)
- Upsell Target Package ID
- Description
- Sort Order
- Active (boolean)
- Created At
- Updated At

### User
- ID
- Account ID (FK)
- Email
- Name
- Role (owner, manager, sales_rep, va)
- Phone (optional)
- Active (boolean)
- Last Login
- Created At

### Lead
- ID
- Account ID (FK)
- Source (GMB, Facebook, Call, Text, Walk-in, Bandit Sign, Website)
- Customer Name
- Phone
- Email (optional)
- Address
- Photos (array)
- Notes
- Status (New, Photo Requested, Quoted, Won, Lost)
- Quoted Package ID
- Quoted Price
- Assigned User ID (optional)
- Created At
- Updated At

### Job
- ID
- Account ID (FK)
- Lead ID (reference)
- Customer Info (denormalized for quick access)
- Address
- Package ID
- Price
- Scheduled Date
- Time Window
- Assigned Sub ID
- Status (Booked, Assigned, In Progress, Completed, Cancelled)
- Card Token (secure reference)
- Agreement Signed (boolean + timestamp)
- Agreement Document (stored file)
- Time Started
- Time Completed
- Actual Duration
- Package Upgraded (boolean)
- Original Package ID (if upgraded)
- Payment Status (Pending, Charged, Failed, Refunded)
- Payment Amount
- Dump Receipt (file)
- Completion Video (file)
- Review Requested (boolean + timestamp)
- Review Bonus Claimed (boolean)
- Review Bonus Verified (boolean)
- Notes
- Created At
- Updated At

### Subcontractor
- ID
- Account ID (FK)
- Name
- Phone
- Email (optional)
- Status (Active, Inactive, Removed)
- W-9 on File (boolean)
- Insurance on File (boolean)
- Jobs Completed (count)
- Total Earnings
- Review Bonuses Earned (count)
- Rating (internal, optional)
- Notes
- Created At

### Payout
- ID
- Account ID (FK)
- Sub ID
- Job ID
- Base Amount
- Bonus Amount
- Total Amount
- Status (Pending, Paid)
- Paid At
- Notes

### Transaction
- ID
- Account ID (FK)
- Job ID
- Amount
- Type (Charge, Refund)
- Status (Success, Failed, Pending)
- Processor Reference
- Card Last Four
- Created At

### SMS Log
- ID
- Account ID (FK)
- Direction (inbound, outbound)
- From Phone
- To Phone
- Message
- Related Lead ID (optional)
- Related Job ID (optional)
- Related Sub ID (optional)
- Twilio SID
- Created At

---

## Key Features (Prioritized)

### P0 — MVP (Must Have)
1. **Lead Management** — Create, view, update leads with photo attachments
2. **Quote Builder** — Select package, generate quote, send via text
3. **Booking with Card on File** — Secure card storage without charging
4. **Job Board** — Calendar/list view of upcoming jobs by date
5. **Sub Dispatch SMS Blast** — Send to active subs, track first reply
6. **Job Assignment** — Assign job to sub who claimed it
7. **On-Site Agreement** — Mobile-friendly digital signature capture
8. **Payment on Completion** — Charge card on file when job marked complete
9. **Post-Job Upload Links** — Sub uploads dump receipt + video
10. **Basic Reporting** — Jobs completed, revenue, outstanding payouts

### P1 — High Value
11. **Time Tracking with Alerts** — Track against package time, alert at threshold
12. **Package Upgrade Flow** — In-app flow to upgrade mid-job with audit trail
13. **Review Request Trigger** — One-tap sends customer review link
14. **Sub Payout Tracking** — Auto-calculate payouts, mark as paid
15. **Morning-of Reminders** — Auto-send job details to sub
16. **Lead Source Tracking** — Attribute leads to source for ROI analysis

### P2 — Nice to Have
17. **Close Rate Dashboard** — Track quote-to-job conversion, trigger pricing alerts
18. **Review Bonus Verification** — Log claims, verify against Google reviews
19. **Customer History** — View past jobs for repeat customers
20. **SMS Conversation Log** — Store all texts for reference
21. **Manager Daily Checklist** — Audit view for receipts, videos, review requests

### P3 — Future / Public Release
22. **Multi-Company Support** — White-label for other junk removal operators
23. **Embedded Payments Rev Share** — Integration with SaaS payment partner
24. **Google Review Monitoring** — Auto-scan for sub name mentions
25. **Sub Performance Scoring** — Track completion rate, review rate, issues
26. **Customer Self-Service** — Quote request form, booking confirmation portal

---

## Integrations

### Required
- **SMS Provider** (Twilio, or similar) — Sub dispatch, customer communication, magic links
- **Payment Processor** — Card on file, charge on completion, rev share potential
  - Evaluate: Stripe Connect, Square, Finix, Rainforest, or Fullsteam-style partnerships
- **Digital Signature** — Embedded signature capture (can build simple or use DocuSign/HelloSign API)
- **File Storage** — Photos, receipts, videos (S3, Cloudflare R2, etc.)

### Optional / Future
- **Google Business Profile API** — Pull reviews for bonus verification
- **Calendar Sync** — Push jobs to Google Calendar
- **Accounting** — Export to QuickBooks / Xero

---

## Technical Considerations

### Architecture Options
1. **Full Custom Build** — React frontend + Node/Python backend + PostgreSQL
2. **Low-Code + Custom** — Retool/Bubble for admin, custom mobile pages for subs
3. **Claude-Assisted Build** — Use Claude to generate components iteratively

### SMS Magic Links
- Links should be short (use shortener or custom domain)
- Pages must be mobile-first, load fast, work offline-ish
- No login required — links contain secure job token
- Token expires after job completion + 24 hours

### Security
- PCI compliance for card storage (use processor's tokenization, never store raw card data)
- Signature documents stored with timestamp and IP
- Sub access scoped to single job via token

---

## Success Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Quote-to-Book Close Rate | >50% | Healthy indicates pricing is right |
| Time-to-First-Reply (Sub Dispatch) | <10 min | Subs are engaged and available |
| On-Site Agreement Completion | 100% | Every job must have signed agreement |
| Post-Job Documentation Rate | >95% | Receipts + videos uploaded |
| Review Request Sent Rate | >80% | Asking drives reviews |
| Customer Payment Success Rate | >98% | Card on file should rarely fail |

---

## Legal / Compliance Documents Needed

### Customer Agreement (Signed On-Site)
Must include:
- Authorization to perform services as described
- Authorization to charge card on file upon completion
- Liability waiver (not responsible for items removed as directed)
- Acknowledgment that pricing is time-based, upgrades require approval
- Photo/video release (optional — for marketing use)

### Subcontractor Agreement (Signed at Onboarding)
Must include:
- Independent contractor status (not employee)
- Payment terms (per-job, net 7 or immediate)
- Brand standards (uniform, behavior, video requirement)
- Liability and insurance requirements
- Non-compete / non-solicitation (optional)

---

## Open Questions / Decisions Needed

1. **Payment processor selection** — Need to evaluate rev share partnerships vs. simplicity
2. **Digital signature approach** — Build simple capture vs. integrate DocuSign?
3. **SMS provider** — Twilio is standard, but evaluate cost at scale
4. **Hosting/infrastructure** — Vercel + Supabase? Railway? AWS?
5. **Domain for magic links** — austincleanouts.com/j/[token] or separate short domain?

---

## Appendix: Script Library (For Reference)

### The Anchor Pitch (Standard First)
> "Most of our clients go with the Standard Garage Rehab. That's a 5-hour block with two professional organizers for $997. We clear everything, haul the junk, and organize what's left so you get your space back completely. If it's a smaller job, we can drop to the Mini package for $497, but usually, the Standard ensures it's done right."

### Photo Request
> "Hi! For a quick quote, please send a few pics: wide shot from the garage door, both corners, and closeups of any heavy items. Also let me know if there are stairs involved!"

### Hard Stop Upsell
> "Hey [Name], just a heads up—we are at the 2-hour max for the Mini package. We've made good progress, but to finish this fully and organize the rest, we'd need to switch to the Standard package. That gives us 3 more hours to get this perfect. Do we have your approval to continue and bill for the Standard?"

### Post-Job Review Request
> "Thanks for choosing Austin Cleanouts! If you loved your garage transformation, we'd be grateful for a quick Google review. It helps other homeowners find us: [Google Review Link]"

---

## Competitive Positioning

| Platform | Price | Target | Why We Win |
|----------|-------|--------|------------|
| **Jobber** | $49-249/mo | General contractors | Too bloated, not junk-specific |
| **Housecall Pro** | $49-199/mo | Home services | Expensive, generic workflows |
| **ServiceTitan** | $300+/mo | Enterprise HVAC/plumbing | Way overkill, wrong industry |
| **Launch27** | $75-150/mo | Cleaning services | Close but wrong vertical |
| **Junk removal spreadsheets** | Free | Solo operators | No automation, no scale |
| **HaulPro (Us)** | $20/mo | Junk removal operators | Built for exactly this. Nothing else. |

**Our Unfair Advantages:**
1. **Price:** $20 flat. No per-user fees. No feature tiers.
2. **Focus:** Only junk removal. Every feature makes sense for this business.
3. **SMS-first subs:** Subs don't download apps. They text back.
4. **Magic links:** On-site moments (signature, payment, review) without logins.
5. **Built by operator:** Not guessing what's needed—lived it.

---

## Version History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | Jan 2025 | Weylin + Claude | Initial PRD based on discovery conversation |
| 1.1 | Jan 2025 | Weylin + Claude | Added multi-tenant architecture, configurable packages, broader junk removal positioning |

---

*This document serves as the foundation for building HaulPro CRM. Austin Cleanouts is the first tenant. Once proven, the platform opens to other junk removal operators.*
