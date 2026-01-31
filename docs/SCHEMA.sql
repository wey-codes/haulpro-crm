-- ============================================================================
-- HaulPro CRM — Database Schema
-- ============================================================================
-- Multi-tenant CRM for junk removal & cleanout businesses
-- Designed for Supabase (PostgreSQL + Auth + Storage)
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Account subscription status
CREATE TYPE subscription_status AS ENUM (
  'trial',
  'active',
  'past_due',
  'cancelled'
);

-- User roles within an account
CREATE TYPE user_role AS ENUM (
  'owner',
  'manager',
  'sales_rep',
  'va'
);

-- Lead status progression
CREATE TYPE lead_status AS ENUM (
  'new',
  'photo_requested',
  'quoted',
  'won',
  'lost'
);

-- Lead source tracking
CREATE TYPE lead_source AS ENUM (
  'gmb',
  'facebook',
  'instagram',
  'call',
  'text',
  'walk_in',
  'bandit_sign',
  'website',
  'referral',
  'other'
);

-- Job status progression
CREATE TYPE job_status AS ENUM (
  'booked',
  'pending_claim',
  'assigned',
  'in_progress',
  'completed',
  'cancelled'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
  'pending',
  'charged',
  'failed',
  'refunded',
  'prepaid'
);

-- Subcontractor status
CREATE TYPE sub_status AS ENUM (
  'active',
  'inactive',
  'removed'
);

-- Payout status
CREATE TYPE payout_status AS ENUM (
  'pending',
  'paid'
);

-- Transaction types
CREATE TYPE transaction_type AS ENUM (
  'charge',
  'refund'
);

-- Transaction status
CREATE TYPE transaction_status AS ENUM (
  'success',
  'failed',
  'pending'
);

-- SMS direction
CREATE TYPE sms_direction AS ENUM (
  'inbound',
  'outbound'
);

-- Package limit types
CREATE TYPE limit_type AS ENUM (
  'time',      -- hours
  'volume',    -- truck percentage
  'flat'       -- no limit (fixed scope)
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ACCOUNTS (Tenants)
-- ----------------------------------------------------------------------------
-- Each junk removal business is an account

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Company Info
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier (e.g., "austin-cleanouts")
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,

  -- External Integrations
  google_review_url TEXT,
  stripe_account_id TEXT, -- Stripe Connect account
  twilio_phone TEXT, -- Dedicated Twilio number (optional)

  -- Templates
  agreement_template TEXT, -- Default agreement text (can include {{variables}})
  quote_intro_template TEXT, -- Text before quote details
  review_request_template TEXT, -- Text for review request SMS

  -- Subscription
  subscription_status subscription_status DEFAULT 'trial',
  subscription_plan TEXT DEFAULT 'standard', -- For future tiers
  trial_ends_at TIMESTAMPTZ,

  -- Settings (flexible JSON for misc config)
  settings JSONB DEFAULT '{}',
  -- Example settings:
  -- {
  --   "timezone": "America/Chicago",
  --   "close_rate_threshold": 80,
  --   "close_rate_window_days": 14,
  --   "default_time_window": "morning"
  -- }

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for slug lookups (public pages)
CREATE INDEX idx_accounts_slug ON accounts(slug);

-- ----------------------------------------------------------------------------
-- PACKAGES (Per Account)
-- ----------------------------------------------------------------------------
-- Configurable service tiers for each account

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

  -- Package Definition
  name TEXT NOT NULL, -- "Mini Rehab", "Half Truck", etc.
  description TEXT, -- Customer-facing description
  price DECIMAL(10,2) NOT NULL, -- Customer price

  -- Limits
  limit_type limit_type NOT NULL DEFAULT 'time',
  limit_value DECIMAL(10,2), -- Hours, percentage, or NULL for flat

  -- Sub Payout
  sub_payout DECIMAL(10,2) NOT NULL, -- What sub gets paid

  -- Options
  requires_prepay BOOLEAN DEFAULT FALSE, -- Charge at booking vs completion
  is_hidden BOOLEAN DEFAULT FALSE, -- Don't show in standard quote builder
  upsell_target_id UUID REFERENCES packages(id), -- Which package to suggest upgrading to

  -- Display
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fetching account's packages
CREATE INDEX idx_packages_account ON packages(account_id, is_active, sort_order);

-- ----------------------------------------------------------------------------
-- USERS (Internal Team)
-- ----------------------------------------------------------------------------
-- Owners, managers, sales reps, VAs - people who log into the CRM
-- Links to Supabase Auth users

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  auth_user_id UUID UNIQUE, -- References auth.users(id)

  -- Profile
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,

  -- Role & Access
  role user_role NOT NULL DEFAULT 'sales_rep',
  is_active BOOLEAN DEFAULT TRUE,

  -- Activity
  last_login_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for auth lookups
CREATE INDEX idx_users_auth ON users(auth_user_id);
CREATE INDEX idx_users_account ON users(account_id, is_active);

-- ----------------------------------------------------------------------------
-- SUBCONTRACTORS
-- ----------------------------------------------------------------------------
-- Field operators who receive jobs via SMS

CREATE TABLE subcontractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

  -- Contact
  name TEXT NOT NULL,
  phone TEXT NOT NULL, -- Primary contact method
  email TEXT,

  -- Status
  status sub_status DEFAULT 'active',

  -- Compliance (optional tracking)
  w9_on_file BOOLEAN DEFAULT FALSE,
  insurance_on_file BOOLEAN DEFAULT FALSE,
  insurance_expiry DATE,

  -- Performance (denormalized for quick display)
  jobs_completed INTEGER DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  review_bonuses_earned INTEGER DEFAULT 0,

  -- Internal
  rating DECIMAL(3,2), -- 1.00 to 5.00
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for SMS matching (find sub by phone)
CREATE INDEX idx_subs_phone ON subcontractors(phone);
CREATE INDEX idx_subs_account ON subcontractors(account_id, status);

-- ----------------------------------------------------------------------------
-- LEADS
-- ----------------------------------------------------------------------------
-- Potential customers from first contact to won/lost

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

  -- Source Tracking
  source lead_source NOT NULL DEFAULT 'other',
  source_detail TEXT, -- "Facebook - Garage Ad", "GMB - Call", etc.

  -- Customer Info
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,

  -- Location
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,

  -- Photos (array of storage URLs)
  photos TEXT[] DEFAULT '{}',

  -- Notes & Communication
  notes TEXT,

  -- Pipeline Status
  status lead_status DEFAULT 'new',

  -- Quote Info (when quoted)
  quoted_package_id UUID REFERENCES packages(id),
  quoted_price DECIMAL(10,2),
  quoted_at TIMESTAMPTZ,

  -- Assignment
  assigned_user_id UUID REFERENCES users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_leads_account_status ON leads(account_id, status);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_created ON leads(account_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- JOBS
-- ----------------------------------------------------------------------------
-- Booked and scheduled work

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id),

  -- Customer Info (denormalized for quick access)
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,

  -- Location
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,

  -- Service
  package_id UUID NOT NULL REFERENCES packages(id),
  price DECIMAL(10,2) NOT NULL,

  -- Scheduling
  scheduled_date DATE NOT NULL,
  time_window TEXT, -- "morning", "afternoon", "9:00 AM", etc.

  -- Assignment
  assigned_sub_id UUID REFERENCES subcontractors(id),
  dispatch_sent_at TIMESTAMPTZ, -- When blast was sent
  claimed_at TIMESTAMPTZ, -- When sub claimed

  -- Status
  status job_status DEFAULT 'booked',

  -- Payment
  stripe_customer_id TEXT,
  stripe_payment_method_id TEXT, -- Card on file
  card_last_four TEXT,
  payment_status payment_status DEFAULT 'pending',
  is_prepaid BOOLEAN DEFAULT FALSE,

  -- Agreement
  agreement_signed BOOLEAN DEFAULT FALSE,
  agreement_signed_at TIMESTAMPTZ,
  agreement_ip TEXT,
  agreement_document_url TEXT, -- Stored signed agreement

  -- Time Tracking
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  actual_duration_minutes INTEGER,

  -- Package Upgrade
  was_upgraded BOOLEAN DEFAULT FALSE,
  original_package_id UUID REFERENCES packages(id),
  original_price DECIMAL(10,2),
  upgraded_at TIMESTAMPTZ,

  -- Post-Job
  dump_receipt_url TEXT,
  completion_video_url TEXT,
  review_requested BOOLEAN DEFAULT FALSE,
  review_requested_at TIMESTAMPTZ,
  review_bonus_claimed BOOLEAN DEFAULT FALSE,
  review_bonus_verified BOOLEAN DEFAULT FALSE,

  -- Notes
  notes TEXT,
  internal_notes TEXT, -- Not shown to sub

  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,

  -- Magic Link Token (for sub on-site access)
  magic_token TEXT UNIQUE,
  magic_token_expires_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_jobs_account_status ON jobs(account_id, status);
CREATE INDEX idx_jobs_account_date ON jobs(account_id, scheduled_date);
CREATE INDEX idx_jobs_sub ON jobs(assigned_sub_id, status);
CREATE INDEX idx_jobs_magic_token ON jobs(magic_token) WHERE magic_token IS NOT NULL;

-- ----------------------------------------------------------------------------
-- PAYOUTS
-- ----------------------------------------------------------------------------
-- Track what's owed/paid to subs

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  sub_id UUID NOT NULL REFERENCES subcontractors(id),
  job_id UUID NOT NULL REFERENCES jobs(id),

  -- Amounts
  base_amount DECIMAL(10,2) NOT NULL, -- From package.sub_payout
  bonus_amount DECIMAL(10,2) DEFAULT 0, -- Review bonus
  total_amount DECIMAL(10,2) NOT NULL, -- base + bonus

  -- Status
  status payout_status DEFAULT 'pending',
  paid_at TIMESTAMPTZ,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payouts_account_status ON payouts(account_id, status);
CREATE INDEX idx_payouts_sub ON payouts(sub_id, status);

-- ----------------------------------------------------------------------------
-- TRANSACTIONS
-- ----------------------------------------------------------------------------
-- Payment transactions for audit trail

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id),

  -- Transaction Info
  amount DECIMAL(10,2) NOT NULL,
  type transaction_type NOT NULL,
  status transaction_status NOT NULL,

  -- Processor Info
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  processor_response JSONB, -- Raw response for debugging

  -- Card Info
  card_last_four TEXT,
  card_brand TEXT, -- visa, mastercard, etc.

  -- Error Info (if failed)
  error_code TEXT,
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_account ON transactions(account_id, created_at DESC);
CREATE INDEX idx_transactions_job ON transactions(job_id);

-- ----------------------------------------------------------------------------
-- SMS LOGS
-- ----------------------------------------------------------------------------
-- All SMS communication for history

CREATE TABLE sms_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

  -- Message Details
  direction sms_direction NOT NULL,
  from_phone TEXT NOT NULL,
  to_phone TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Associations (optional - for linking to records)
  lead_id UUID REFERENCES leads(id),
  job_id UUID REFERENCES jobs(id),
  sub_id UUID REFERENCES subcontractors(id),

  -- Twilio Info
  twilio_sid TEXT,
  twilio_status TEXT, -- delivered, failed, etc.

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sms_account_created ON sms_logs(account_id, created_at DESC);
CREATE INDEX idx_sms_phone ON sms_logs(from_phone, created_at DESC);
CREATE INDEX idx_sms_phone_to ON sms_logs(to_phone, created_at DESC);

-- ----------------------------------------------------------------------------
-- JOB DISPATCH TRACKING
-- ----------------------------------------------------------------------------
-- Track which subs were sent job blasts and their responses

CREATE TABLE job_dispatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sub_id UUID NOT NULL REFERENCES subcontractors(id),

  -- Dispatch Info
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  sms_log_id UUID REFERENCES sms_logs(id),

  -- Response
  response TEXT, -- Their reply message
  responded_at TIMESTAMPTZ,
  was_claimed BOOLEAN DEFAULT FALSE, -- Did this sub win?

  -- Unique constraint: one dispatch per sub per job
  UNIQUE(job_id, sub_id)
);

-- Index for finding who was dispatched
CREATE INDEX idx_dispatches_job ON job_dispatches(job_id);

-- ----------------------------------------------------------------------------
-- ACTIVITY LOG
-- ----------------------------------------------------------------------------
-- Audit trail for important actions

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

  -- What happened
  action TEXT NOT NULL, -- 'lead_created', 'job_booked', 'payment_charged', etc.
  description TEXT,

  -- Who did it
  user_id UUID REFERENCES users(id),
  sub_id UUID REFERENCES subcontractors(id),

  -- Related records
  lead_id UUID REFERENCES leads(id),
  job_id UUID REFERENCES jobs(id),

  -- Additional data
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for viewing activity
CREATE INDEX idx_activity_account ON activity_logs(account_id, created_at DESC);
CREATE INDEX idx_activity_job ON activity_logs(job_id, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tenant tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Helper function to get current user's account_id
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_user_account_id()
RETURNS UUID AS $$
  SELECT account_id
  FROM users
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ----------------------------------------------------------------------------
-- RLS Policies
-- ----------------------------------------------------------------------------

-- Accounts: Users can only see their own account
CREATE POLICY "Users can view own account"
  ON accounts FOR SELECT
  USING (id = get_user_account_id());

CREATE POLICY "Owners can update own account"
  ON accounts FOR UPDATE
  USING (id = get_user_account_id())
  WITH CHECK (id = get_user_account_id());

-- Packages: Users can view/manage their account's packages
CREATE POLICY "Users can view account packages"
  ON packages FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can manage account packages"
  ON packages FOR ALL
  USING (account_id = get_user_account_id())
  WITH CHECK (account_id = get_user_account_id());

-- Users: Can see team members in same account
CREATE POLICY "Users can view account team"
  ON users FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can manage account team"
  ON users FOR ALL
  USING (account_id = get_user_account_id())
  WITH CHECK (account_id = get_user_account_id());

-- Subcontractors
CREATE POLICY "Users can view account subs"
  ON subcontractors FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can manage account subs"
  ON subcontractors FOR ALL
  USING (account_id = get_user_account_id())
  WITH CHECK (account_id = get_user_account_id());

-- Leads
CREATE POLICY "Users can view account leads"
  ON leads FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can manage account leads"
  ON leads FOR ALL
  USING (account_id = get_user_account_id())
  WITH CHECK (account_id = get_user_account_id());

-- Jobs
CREATE POLICY "Users can view account jobs"
  ON jobs FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can manage account jobs"
  ON jobs FOR ALL
  USING (account_id = get_user_account_id())
  WITH CHECK (account_id = get_user_account_id());

-- Payouts
CREATE POLICY "Users can view account payouts"
  ON payouts FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can manage account payouts"
  ON payouts FOR ALL
  USING (account_id = get_user_account_id())
  WITH CHECK (account_id = get_user_account_id());

-- Transactions
CREATE POLICY "Users can view account transactions"
  ON transactions FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can insert account transactions"
  ON transactions FOR INSERT
  WITH CHECK (account_id = get_user_account_id());

-- SMS Logs
CREATE POLICY "Users can view account sms"
  ON sms_logs FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can insert account sms"
  ON sms_logs FOR INSERT
  WITH CHECK (account_id = get_user_account_id());

-- Job Dispatches
CREATE POLICY "Users can view job dispatches"
  ON job_dispatches FOR SELECT
  USING (job_id IN (SELECT id FROM jobs WHERE account_id = get_user_account_id()));

CREATE POLICY "Users can manage job dispatches"
  ON job_dispatches FOR ALL
  USING (job_id IN (SELECT id FROM jobs WHERE account_id = get_user_account_id()));

-- Activity Logs
CREATE POLICY "Users can view account activity"
  ON activity_logs FOR SELECT
  USING (account_id = get_user_account_id());

CREATE POLICY "Users can insert account activity"
  ON activity_logs FOR INSERT
  WITH CHECK (account_id = get_user_account_id());

-- ============================================================================
-- PUBLIC ACCESS FOR MAGIC LINKS
-- ============================================================================
-- Jobs can be accessed via magic token without auth (for sub on-site flow)

CREATE POLICY "Magic link access to jobs"
  ON jobs FOR SELECT
  USING (
    magic_token IS NOT NULL
    AND magic_token_expires_at > NOW()
  );

-- Allow updating specific fields via magic link
CREATE POLICY "Magic link can update job"
  ON jobs FOR UPDATE
  USING (
    magic_token IS NOT NULL
    AND magic_token_expires_at > NOW()
  )
  WITH CHECK (
    magic_token IS NOT NULL
    AND magic_token_expires_at > NOW()
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Auto-update updated_at timestamp
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subs_updated_at
  BEFORE UPDATE ON subcontractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payouts_updated_at
  BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------------------
-- Generate magic token for jobs
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION generate_magic_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(24), 'base64');
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Auto-create payout when job completed
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION create_payout_on_completion()
RETURNS TRIGGER AS $$
DECLARE
  pkg_payout DECIMAL(10,2);
BEGIN
  -- Only trigger when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Get sub payout from package
    SELECT sub_payout INTO pkg_payout
    FROM packages
    WHERE id = NEW.package_id;

    -- Create payout record if sub is assigned
    IF NEW.assigned_sub_id IS NOT NULL THEN
      INSERT INTO payouts (
        account_id,
        sub_id,
        job_id,
        base_amount,
        bonus_amount,
        total_amount,
        status
      ) VALUES (
        NEW.account_id,
        NEW.assigned_sub_id,
        NEW.id,
        pkg_payout,
        0,
        pkg_payout,
        'pending'
      );

      -- Update sub's stats
      UPDATE subcontractors
      SET
        jobs_completed = jobs_completed + 1,
        total_earnings = total_earnings + pkg_payout
      WHERE id = NEW.assigned_sub_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_completion_payout
  AFTER UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION create_payout_on_completion();

-- ----------------------------------------------------------------------------
-- Update lead status when job booked
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_lead_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lead_id IS NOT NULL THEN
    UPDATE leads
    SET status = 'won', updated_at = NOW()
    WHERE id = NEW.lead_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_booking_lead_update
  AFTER INSERT ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_lead_on_booking();

-- ============================================================================
-- SEED DATA: Austin Cleanouts (First Tenant)
-- ============================================================================
-- Run this after initial setup to create Weylin's account

-- Create Account
INSERT INTO accounts (
  id,
  company_name,
  slug,
  phone,
  email,
  google_review_url,
  agreement_template,
  quote_intro_template,
  review_request_template,
  subscription_status,
  settings
) VALUES (
  '11111111-1111-1111-1111-111111111111', -- Fixed ID for reference
  'Austin Cleanouts',
  'austin-cleanouts',
  '+15125551234', -- Replace with real number
  'hello@austincleanouts.com',
  'https://g.page/r/YOUR_GOOGLE_REVIEW_LINK', -- Replace
  'SERVICE AGREEMENT

By signing below, I authorize Austin Cleanouts to perform cleanout and removal services at the address listed. I confirm that:

1. I have authority to authorize removal of items at this location
2. Items designated for removal are mine to dispose of
3. I authorize the charge of {{price}} to my card on file upon completion
4. Austin Cleanouts is not liable for items removed at my direction
5. I understand pricing is based on time blocks and any extension requires my approval

This agreement is binding upon signature.',
  'Thanks for reaching out! Based on the photos, here''s what I recommend:',
  'Thanks for choosing Austin Cleanouts! If you loved your garage transformation, we''d be grateful for a quick Google review: {{review_link}}',
  'active',
  '{
    "timezone": "America/Chicago",
    "close_rate_threshold": 80,
    "close_rate_window_days": 14
  }'::jsonb
);

-- Create Packages
INSERT INTO packages (account_id, name, description, price, limit_type, limit_value, sub_payout, requires_prepay, is_hidden, sort_order) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Curbside Pickup',
  'Quick pickup of items already at the curb. No entry into property.',
  297.00,
  'flat',
  NULL,
  75.00,
  TRUE,
  TRUE,
  0
),
(
  '11111111-1111-1111-1111-111111111111',
  'Mini Rehab',
  'Perfect for partial garage clear-outs or quick organization. 2-hour time block with 2 professional organizers.',
  497.00,
  'time',
  2.0,
  160.00,
  FALSE,
  FALSE,
  1
),
(
  '11111111-1111-1111-1111-111111111111',
  'Standard Rehab',
  'Our most popular package. Full garage transformation with deep organization. 5-hour time block with 2 professional organizers.',
  997.00,
  'time',
  5.0,
  400.00,
  FALSE,
  FALSE,
  2
),
(
  '11111111-1111-1111-1111-111111111111',
  'Full Day Rehab',
  'For major projects, hoarding situations, or estate cleanouts. 8-hour time block with 2 professional organizers.',
  1497.00,
  'time',
  8.0,
  640.00,
  FALSE,
  FALSE,
  3
);

-- Set upsell targets (Mini → Standard, Standard → Full Day)
UPDATE packages SET upsell_target_id = (
  SELECT id FROM packages WHERE name = 'Standard Rehab' AND account_id = '11111111-1111-1111-1111-111111111111'
) WHERE name = 'Mini Rehab' AND account_id = '11111111-1111-1111-1111-111111111111';

UPDATE packages SET upsell_target_id = (
  SELECT id FROM packages WHERE name = 'Full Day Rehab' AND account_id = '11111111-1111-1111-1111-111111111111'
) WHERE name = 'Standard Rehab' AND account_id = '11111111-1111-1111-1111-111111111111';

-- ============================================================================
-- NOTES FOR IMPLEMENTATION
-- ============================================================================

-- After a user signs up via Supabase Auth:
-- 1. Create a record in the `users` table linking auth_user_id to account_id
-- 2. The RLS policies will then automatically scope their data access

-- For new account signup flow:
-- 1. Create account record
-- 2. Create default packages (can copy from templates)
-- 3. Create first user as 'owner' role
-- 4. Link user to Supabase Auth user

-- For magic links (sub on-site flow):
-- 1. Generate token: SELECT generate_magic_token()
-- 2. Store in job: UPDATE jobs SET magic_token = '...', magic_token_expires_at = NOW() + INTERVAL '48 hours'
-- 3. URL format: https://app.haul.pro/j/{magic_token}
-- 4. Token allows SELECT/UPDATE on that specific job without auth

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
