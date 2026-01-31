// Mock data for development - replace with Supabase later

import type {
  Account,
  Package,
  User,
  Subcontractor,
  Lead,
  Job,
  Payout,
} from "@/types/database";

// =============================================================================
// AUSTIN CLEANOUTS - First Tenant
// =============================================================================

export const ACCOUNT_ID = "11111111-1111-1111-1111-111111111111";

export const mockAccount: Account = {
  id: ACCOUNT_ID,
  company_name: "Austin Cleanouts",
  slug: "austin-cleanouts",
  logo_url: null,
  phone: "+15125551234",
  email: "hello@austincleanouts.com",
  website: "https://austincleanouts.com",
  google_review_url: "https://g.page/r/example",
  stripe_account_id: null,
  twilio_phone: null,
  agreement_template: `SERVICE AGREEMENT

By signing below, I authorize Austin Cleanouts to perform cleanout and removal services at the address listed. I confirm that:

1. I have authority to authorize removal of items at this location
2. Items designated for removal are mine to dispose of
3. I authorize the charge of {{price}} to my card on file upon completion
4. Austin Cleanouts is not liable for items removed at my direction
5. I understand pricing is based on time blocks and any extension requires my approval

This agreement is binding upon signature.`,
  quote_intro_template:
    "Thanks for reaching out! Based on the photos, here's what I recommend:",
  review_request_template:
    "Thanks for choosing Austin Cleanouts! If you loved your garage transformation, we'd be grateful for a quick Google review: {{review_link}}",
  subscription_status: "active",
  subscription_plan: "standard",
  trial_ends_at: null,
  settings: {
    timezone: "America/Chicago",
    close_rate_threshold: 80,
    close_rate_window_days: 14,
  },
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

export const mockPackages: Package[] = [
  {
    id: "pkg-001",
    account_id: ACCOUNT_ID,
    name: "Curbside Pickup",
    description:
      "Quick pickup of items already at the curb. No entry into property.",
    price: 297,
    limit_type: "flat",
    limit_value: null,
    sub_payout: 75,
    requires_prepay: true,
    is_hidden: true,
    upsell_target_id: null,
    sort_order: 0,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "pkg-002",
    account_id: ACCOUNT_ID,
    name: "Mini Rehab",
    description:
      "Perfect for partial garage clear-outs or quick organization. 2-hour time block with 2 professional organizers.",
    price: 497,
    limit_type: "time",
    limit_value: 2,
    sub_payout: 160,
    requires_prepay: false,
    is_hidden: false,
    upsell_target_id: "pkg-003",
    sort_order: 1,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "pkg-003",
    account_id: ACCOUNT_ID,
    name: "Standard Rehab",
    description:
      "Our most popular package. Full garage transformation with deep organization. 5-hour time block with 2 professional organizers.",
    price: 997,
    limit_type: "time",
    limit_value: 5,
    sub_payout: 400,
    requires_prepay: false,
    is_hidden: false,
    upsell_target_id: "pkg-004",
    sort_order: 2,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "pkg-004",
    account_id: ACCOUNT_ID,
    name: "Full Day Rehab",
    description:
      "For major projects, hoarding situations, or estate cleanouts. 8-hour time block with 2 professional organizers.",
    price: 1497,
    limit_type: "time",
    limit_value: 8,
    sub_payout: 640,
    requires_prepay: false,
    is_hidden: false,
    upsell_target_id: null,
    sort_order: 3,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

export const mockUser: User = {
  id: "user-001",
  account_id: ACCOUNT_ID,
  auth_user_id: "auth-001",
  email: "weylin@austincleanouts.com",
  name: "Weylin",
  phone: "+15125551234",
  role: "owner",
  is_active: true,
  last_login_at: "2025-01-31T00:00:00Z",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

export const mockSubcontractors: Subcontractor[] = [
  {
    id: "sub-001",
    account_id: ACCOUNT_ID,
    name: "Mike Johnson",
    phone: "+15125559001",
    email: "mike@example.com",
    status: "active",
    w9_on_file: true,
    insurance_on_file: true,
    insurance_expiry: "2025-12-31",
    jobs_completed: 47,
    total_earnings: 18800,
    review_bonuses_earned: 12,
    rating: 4.8,
    notes: "Reliable, great with customers",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "sub-002",
    account_id: ACCOUNT_ID,
    name: "Carlos Rivera",
    phone: "+15125559002",
    email: "carlos@example.com",
    status: "active",
    w9_on_file: true,
    insurance_on_file: true,
    insurance_expiry: "2025-06-30",
    jobs_completed: 32,
    total_earnings: 12800,
    review_bonuses_earned: 8,
    rating: 4.6,
    notes: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

export const mockLeads: Lead[] = [
  {
    id: "lead-001",
    account_id: ACCOUNT_ID,
    source: "gmb",
    source_detail: "Google Maps - Garage Cleanout",
    customer_name: "Sarah Thompson",
    phone: "+15125558001",
    email: "sarah.t@email.com",
    address_line1: "1234 Oak Street",
    address_line2: null,
    city: "Austin",
    state: "TX",
    zip: "78701",
    photos: [],
    notes: "2-car garage, lots of boxes and old furniture",
    status: "new",
    quoted_package_id: null,
    quoted_price: null,
    quoted_at: null,
    assigned_user_id: "user-001",
    created_at: "2025-01-30T14:00:00Z",
    updated_at: "2025-01-30T14:00:00Z",
  },
  {
    id: "lead-002",
    account_id: ACCOUNT_ID,
    source: "facebook",
    source_detail: "Facebook Ad - Garage Transformation",
    customer_name: "Michael Chen",
    phone: "+15125558002",
    email: "mchen@email.com",
    address_line1: "567 Maple Ave",
    address_line2: "Unit B",
    city: "Austin",
    state: "TX",
    zip: "78702",
    photos: [],
    notes: "Interested in full cleanout, has heavy items",
    status: "photo_requested",
    quoted_package_id: null,
    quoted_price: null,
    quoted_at: null,
    assigned_user_id: "user-001",
    created_at: "2025-01-29T10:30:00Z",
    updated_at: "2025-01-29T11:00:00Z",
  },
  {
    id: "lead-003",
    account_id: ACCOUNT_ID,
    source: "referral",
    source_detail: "Referred by Sarah Thompson",
    customer_name: "Jennifer Williams",
    phone: "+15125558003",
    email: "jwilliams@email.com",
    address_line1: "890 Cedar Lane",
    address_line2: null,
    city: "Round Rock",
    state: "TX",
    zip: "78664",
    photos: [],
    notes: "Estate cleanout, 3 rooms",
    status: "quoted",
    quoted_package_id: "pkg-004",
    quoted_price: 1497,
    quoted_at: "2025-01-28T16:00:00Z",
    assigned_user_id: "user-001",
    created_at: "2025-01-27T09:00:00Z",
    updated_at: "2025-01-28T16:00:00Z",
  },
  {
    id: "lead-004",
    account_id: ACCOUNT_ID,
    source: "gmb",
    source_detail: null,
    customer_name: "Robert Davis",
    phone: "+15125558004",
    email: null,
    address_line1: "321 Pine Road",
    address_line2: null,
    city: "Austin",
    state: "TX",
    zip: "78745",
    photos: [],
    notes: null,
    status: "won",
    quoted_package_id: "pkg-003",
    quoted_price: 997,
    quoted_at: "2025-01-25T14:00:00Z",
    assigned_user_id: "user-001",
    created_at: "2025-01-24T11:00:00Z",
    updated_at: "2025-01-26T10:00:00Z",
  },
];

export const mockJobs: Job[] = [
  {
    id: "job-001",
    account_id: ACCOUNT_ID,
    lead_id: "lead-004",
    customer_name: "Robert Davis",
    customer_phone: "+15125558004",
    customer_email: null,
    address_line1: "321 Pine Road",
    address_line2: null,
    city: "Austin",
    state: "TX",
    zip: "78745",
    package_id: "pkg-003",
    price: 997,
    scheduled_date: "2025-02-01",
    time_window: "morning",
    assigned_sub_id: "sub-001",
    dispatch_sent_at: "2025-01-26T10:00:00Z",
    claimed_at: "2025-01-26T10:05:00Z",
    status: "assigned",
    stripe_customer_id: null,
    stripe_payment_method_id: null,
    card_last_four: "4242",
    payment_status: "pending",
    is_prepaid: false,
    agreement_signed: false,
    agreement_signed_at: null,
    agreement_ip: null,
    agreement_document_url: null,
    started_at: null,
    completed_at: null,
    actual_duration_minutes: null,
    was_upgraded: false,
    original_package_id: null,
    original_price: null,
    upgraded_at: null,
    dump_receipt_url: null,
    completion_video_url: null,
    review_requested: false,
    review_requested_at: null,
    review_bonus_claimed: false,
    review_bonus_verified: false,
    notes: "Customer prefers morning arrival",
    internal_notes: null,
    cancelled_at: null,
    cancellation_reason: null,
    magic_token: "abc123xyz",
    magic_token_expires_at: "2025-02-03T00:00:00Z",
    created_at: "2025-01-26T10:00:00Z",
    updated_at: "2025-01-26T10:05:00Z",
  },
];

export const mockPayouts: Payout[] = [
  {
    id: "payout-001",
    account_id: ACCOUNT_ID,
    sub_id: "sub-001",
    job_id: "job-001",
    base_amount: 400,
    bonus_amount: 0,
    total_amount: 400,
    status: "pending",
    paid_at: null,
    notes: null,
    created_at: "2025-01-26T10:05:00Z",
    updated_at: "2025-01-26T10:05:00Z",
  },
  {
    id: "payout-002",
    account_id: ACCOUNT_ID,
    sub_id: "sub-001",
    job_id: "job-002",
    base_amount: 160,
    bonus_amount: 25,
    total_amount: 185,
    status: "paid",
    paid_at: "2025-01-20T15:00:00Z",
    notes: "Review bonus earned",
    created_at: "2025-01-18T10:00:00Z",
    updated_at: "2025-01-20T15:00:00Z",
  },
  {
    id: "payout-003",
    account_id: ACCOUNT_ID,
    sub_id: "sub-002",
    job_id: "job-003",
    base_amount: 400,
    bonus_amount: 25,
    total_amount: 425,
    status: "paid",
    paid_at: "2025-01-15T12:00:00Z",
    notes: "Review bonus earned",
    created_at: "2025-01-12T10:00:00Z",
    updated_at: "2025-01-15T12:00:00Z",
  },
  {
    id: "payout-004",
    account_id: ACCOUNT_ID,
    sub_id: "sub-002",
    job_id: "job-004",
    base_amount: 640,
    bonus_amount: 0,
    total_amount: 640,
    status: "pending",
    paid_at: null,
    notes: null,
    created_at: "2025-01-28T10:00:00Z",
    updated_at: "2025-01-28T10:00:00Z",
  },
];

// =============================================================================
// Helper functions to simulate database queries
// =============================================================================

export function getAccount(): Account {
  return mockAccount;
}

export function getPackages(includeHidden = false): Package[] {
  return includeHidden
    ? mockPackages
    : mockPackages.filter((p) => !p.is_hidden);
}

export function getPackageById(id: string): Package | undefined {
  return mockPackages.find((p) => p.id === id);
}

export function getCurrentUser(): User {
  return mockUser;
}

export function getLeads(status?: string): Lead[] {
  if (status && status !== "all") {
    return mockLeads.filter((l) => l.status === status);
  }
  return mockLeads;
}

export function getLeadById(id: string): Lead | undefined {
  return mockLeads.find((l) => l.id === id);
}

export function getJobs(status?: string): Job[] {
  if (status && status !== "all") {
    return mockJobs.filter((j) => j.status === status);
  }
  return mockJobs;
}

export function getJobById(id: string): Job | undefined {
  return mockJobs.find((j) => j.id === id);
}

export function getSubcontractors(status?: string): Subcontractor[] {
  if (status && status !== "all") {
    return mockSubcontractors.filter((s) => s.status === status);
  }
  return mockSubcontractors;
}

export function getSubById(id: string): Subcontractor | undefined {
  return mockSubcontractors.find((s) => s.id === id);
}

export function getPayouts(status?: string): Payout[] {
  if (status && status !== "all") {
    return mockPayouts.filter((p) => p.status === status);
  }
  return mockPayouts;
}

export function getPayoutById(id: string): Payout | undefined {
  return mockPayouts.find((p) => p.id === id);
}

export function getPayoutStats() {
  const pending = mockPayouts.filter((p) => p.status === "pending");
  const paid = mockPayouts.filter((p) => p.status === "paid");

  return {
    pendingCount: pending.length,
    pendingTotal: pending.reduce((sum, p) => sum + p.total_amount, 0),
    paidCount: paid.length,
    paidTotal: paid.reduce((sum, p) => sum + p.total_amount, 0),
  };
}
