// Database types matching docs/SCHEMA.sql

export type SubscriptionStatus = "trial" | "active" | "past_due" | "cancelled";
export type UserRole = "owner" | "manager" | "sales_rep" | "va";
export type LeadStatus = "new" | "photo_requested" | "quoted" | "won" | "lost";
export type LeadSource =
  | "gmb"
  | "facebook"
  | "instagram"
  | "call"
  | "text"
  | "walk_in"
  | "bandit_sign"
  | "website"
  | "referral"
  | "other";
export type JobStatus =
  | "booked"
  | "pending_claim"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";
export type PaymentStatus =
  | "pending"
  | "charged"
  | "failed"
  | "refunded"
  | "prepaid";
export type SubStatus = "active" | "inactive" | "removed";
export type PayoutStatus = "pending" | "paid";
export type LimitType = "time" | "volume" | "flat";

export interface Account {
  id: string;
  company_name: string;
  slug: string;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  google_review_url: string | null;
  stripe_account_id: string | null;
  twilio_phone: string | null;
  agreement_template: string | null;
  quote_intro_template: string | null;
  review_request_template: string | null;
  subscription_status: SubscriptionStatus;
  subscription_plan: string;
  trial_ends_at: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  account_id: string;
  name: string;
  description: string | null;
  price: number;
  limit_type: LimitType;
  limit_value: number | null;
  sub_payout: number;
  requires_prepay: boolean;
  is_hidden: boolean;
  upsell_target_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  account_id: string;
  auth_user_id: string | null;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subcontractor {
  id: string;
  account_id: string;
  name: string;
  phone: string;
  email: string | null;
  status: SubStatus;
  w9_on_file: boolean;
  insurance_on_file: boolean;
  insurance_expiry: string | null;
  jobs_completed: number;
  total_earnings: number;
  review_bonuses_earned: number;
  rating: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  account_id: string;
  source: LeadSource;
  source_detail: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  photos: string[];
  notes: string | null;
  status: LeadStatus;
  quoted_package_id: string | null;
  quoted_price: number | null;
  quoted_at: string | null;
  assigned_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  account_id: string;
  lead_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  package_id: string;
  price: number;
  scheduled_date: string;
  time_window: string | null;
  assigned_sub_id: string | null;
  dispatch_sent_at: string | null;
  claimed_at: string | null;
  status: JobStatus;
  stripe_customer_id: string | null;
  stripe_payment_method_id: string | null;
  card_last_four: string | null;
  payment_status: PaymentStatus;
  is_prepaid: boolean;
  agreement_signed: boolean;
  agreement_signed_at: string | null;
  agreement_ip: string | null;
  agreement_document_url: string | null;
  started_at: string | null;
  completed_at: string | null;
  actual_duration_minutes: number | null;
  was_upgraded: boolean;
  original_package_id: string | null;
  original_price: number | null;
  upgraded_at: string | null;
  dump_receipt_url: string | null;
  completion_video_url: string | null;
  review_requested: boolean;
  review_requested_at: string | null;
  review_bonus_claimed: boolean;
  review_bonus_verified: boolean;
  notes: string | null;
  internal_notes: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  magic_token: string | null;
  magic_token_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: string;
  account_id: string;
  sub_id: string;
  job_id: string;
  base_amount: number;
  bonus_amount: number;
  total_amount: number;
  status: PayoutStatus;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
