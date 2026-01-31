# Task: Supabase Project Setup

**Status:** pending
**Phase:** 0 - Project Setup
**Depends On:** 00-01-init-nextjs
**Estimated Time:** 30 minutes

---

## 1. Overview

Create a Supabase project and configure the Next.js app to connect to it. Set up both client-side and server-side Supabase clients.

## 2. Goals

- Create a Supabase project for HaulPro CRM
- Install Supabase client libraries
- Configure environment variables
- Create reusable Supabase client utilities
- Verify connection works

## 3. User Stories

### 3.1 App can connect to Supabase
**As a** developer
**I want** the app to connect to Supabase on startup
**So that** I can read and write data

**Acceptance Criteria:**
- [ ] Environment variables are configured
- [ ] Browser client can query Supabase
- [ ] Server components can query Supabase
- [ ] No connection errors in console

## 4. Functional Requirements

**FR-1:** Install Supabase packages:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

**FR-2:** Create `.env.local` with Supabase credentials (copied from `.env.local.example`)

**FR-3:** Create browser client at `src/lib/supabase/client.ts`:
```typescript
// Creates client for use in Client Components
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**FR-4:** Create server client at `src/lib/supabase/server.ts`:
```typescript
// Creates client for use in Server Components, Route Handlers, Server Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**FR-5:** Create middleware at `src/middleware.ts` for session refresh:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

## 5. Non-Goals

- No database tables created in this task
- No authentication UI in this task
- No RLS policies in this task

## 6. Technical Considerations

- Use `@supabase/ssr` package (not the older auth-helpers)
- Middleware is required for proper session handling
- Server client must be created fresh for each request

## 7. Acceptance Criteria (Verification Commands)

```bash
npm run build        # Builds with Supabase imports
npm run typecheck    # No TypeScript errors
npm run dev          # No runtime errors, check console
```

Manual verification:
- Add a test query in `src/app/page.tsx` to verify connection
- Check browser console for any Supabase errors

## 8. Output Files

After completion, these files should exist:
- `.env.local` with real Supabase credentials
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/middleware.ts`

---

## Implementation Notes

1. Create Supabase project at https://supabase.com/dashboard
2. Copy URL and anon key from Settings > API
3. Create the files as specified above
4. Test with a simple query on the home page
