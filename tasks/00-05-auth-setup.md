# Task: Authentication Setup

**Status:** pending
**Phase:** 0 - Project Setup
**Depends On:** 00-04-seed-data
**Estimated Time:** 2 hours

---

## 1. Overview

Configure Supabase Auth for email/password login. Create login and signup pages. Link authenticated users to accounts in the `users` table.

## 2. Goals

- Enable email/password auth in Supabase
- Create login page at `/login`
- Create signup page at `/signup`
- Create auth callback handler
- Protect dashboard routes
- Create first user (Weylin) linked to Austin Cleanouts

## 3. User Stories

### 3.1 User can sign up
**As a** new user
**I want** to create an account with email/password
**So that** I can access the CRM

**Acceptance Criteria:**
- [ ] Signup form at `/signup` with email, password, name fields
- [ ] Form validates required fields
- [ ] Successful signup creates auth user
- [ ] User record created in `users` table
- [ ] Redirects to dashboard after signup

### 3.2 User can log in
**As a** registered user
**I want** to log in with email/password
**So that** I can access my account's data

**Acceptance Criteria:**
- [ ] Login form at `/login` with email, password fields
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to dashboard
- [ ] Session persists on page refresh

### 3.3 User can log out
**As a** logged-in user
**I want** to log out
**So that** I can secure my session

**Acceptance Criteria:**
- [ ] Logout action clears session
- [ ] Redirects to login page
- [ ] Cannot access dashboard after logout

### 3.4 Dashboard routes are protected
**As a** visitor
**I want** to be redirected to login if not authenticated
**So that** the CRM data is secure

**Acceptance Criteria:**
- [ ] Accessing `/` without auth redirects to `/login`
- [ ] Accessing any dashboard route without auth redirects to `/login`

## 4. Functional Requirements

**FR-1:** Enable Email provider in Supabase Auth settings

**FR-2:** Create login page at `src/app/(auth)/login/page.tsx`:
- Email input
- Password input
- Submit button
- Link to signup
- Error message display

**FR-3:** Create signup page at `src/app/(auth)/signup/page.tsx`:
- Name input
- Email input
- Password input
- Submit button
- Link to login

**FR-4:** Create auth callback at `src/app/auth/callback/route.ts`:
- Handle OAuth redirects
- Exchange code for session

**FR-5:** Create server action for signup at `src/app/(auth)/actions.ts`:
```typescript
'use server'
export async function signup(formData: FormData) {
  // 1. Create auth user with Supabase
  // 2. Create user record in users table with account_id
  // 3. Redirect to dashboard
}
```

**FR-6:** Update middleware to:
- Check if user is authenticated
- Redirect to `/login` if accessing protected routes without auth
- Allow `/login`, `/signup`, `/auth/callback` without auth

**FR-7:** Create first user via Supabase dashboard or signup:
| Field | Value |
|-------|-------|
| email | weylin@austincleanouts.com |
| name | Weylin |
| role | owner |
| account_id | `11111111-1111-1111-1111-111111111111` |

## 5. Non-Goals

- No password reset flow in this task
- No email verification in this task
- No OAuth providers (Google, etc.)
- No invite flow for team members

## 6. Technical Considerations

- Use Server Actions for form submissions
- Store account_id in users table, not in JWT metadata
- The `get_user_account_id()` function uses auth.uid() to look up account
- Disable email confirmation in Supabase for faster dev

## 7. Acceptance Criteria (Verification)

```bash
npm run build        # No build errors
npm run typecheck    # No TypeScript errors
```

Manual testing:
1. Go to `/login` - see login form
2. Go to `/signup` - see signup form
3. Sign up with test email - redirected to dashboard
4. Refresh page - still logged in
5. Log out - redirected to login
6. Go to `/` - redirected to login

## 8. Output Files

```
src/app/(auth)/
├── layout.tsx           # Minimal layout for auth pages
├── login/
│   └── page.tsx         # Login form
├── signup/
│   └── page.tsx         # Signup form
└── actions.ts           # Server actions for auth

src/app/auth/
└── callback/
    └── route.ts         # Auth callback handler

src/middleware.ts        # Updated with route protection
```

---

## Implementation Notes

Supabase Auth settings to configure:
1. Go to Authentication > Providers > Email
2. Enable Email provider
3. Disable "Confirm email" for development
4. Set Site URL to `http://localhost:3000`
5. Add `http://localhost:3000/auth/callback` to Redirect URLs
