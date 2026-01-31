# Task: Dashboard Layout Shell

**Status:** pending
**Phase:** 0 - Project Setup
**Depends On:** 00-05-auth-setup
**Estimated Time:** 2 hours

---

## 1. Overview

Create the main application shell with sidebar navigation, header, and responsive layout. This establishes the consistent UI structure for all dashboard pages.

## 2. Goals

- Create sidebar with navigation links
- Show account name in sidebar header
- Create responsive layout (sidebar collapses on mobile)
- Add user dropdown with logout
- Create placeholder pages for each nav item

## 3. User Stories

### 3.1 User sees sidebar navigation
**As a** logged-in user
**I want** to see a sidebar with navigation links
**So that** I can navigate between sections

**Acceptance Criteria:**
- [ ] Sidebar visible on desktop (left side)
- [ ] Nav items: Dashboard, Leads, Jobs, Subs, Payouts, Settings
- [ ] Current page highlighted
- [ ] Clicking nav item navigates to that page

### 3.2 User sees account branding
**As a** logged-in user
**I want** to see my company name in the sidebar
**So that** I know which account I'm viewing

**Acceptance Criteria:**
- [ ] Company name displayed at top of sidebar
- [ ] Company logo displayed if available

### 3.3 User can navigate on mobile
**As a** mobile user
**I want** the sidebar to work on small screens
**So that** I can use the app on my phone

**Acceptance Criteria:**
- [ ] Sidebar collapses to hamburger menu on mobile
- [ ] Tapping hamburger opens sidebar overlay
- [ ] Tapping nav item closes sidebar and navigates

### 3.4 User can log out
**As a** logged-in user
**I want** to log out from the header
**So that** I can end my session

**Acceptance Criteria:**
- [ ] User dropdown in header shows name/email
- [ ] Dropdown has "Log out" option
- [ ] Clicking logout ends session and redirects to login

## 4. Functional Requirements

**FR-1:** Create dashboard layout at `src/app/(dashboard)/layout.tsx`:
- Wrap all dashboard pages
- Fetch current user and account data
- Pass context to children

**FR-2:** Create Sidebar component at `src/components/layout/sidebar.tsx`:
- Logo/company name at top
- Navigation links with icons
- Active state styling
- Collapse for mobile

**FR-3:** Create Header component at `src/components/layout/header.tsx`:
- Mobile menu toggle (hamburger)
- User dropdown on right
- Log out action

**FR-4:** Create placeholder pages:
- `src/app/(dashboard)/page.tsx` - Dashboard home
- `src/app/(dashboard)/leads/page.tsx` - Leads list
- `src/app/(dashboard)/jobs/page.tsx` - Jobs list
- `src/app/(dashboard)/subs/page.tsx` - Subs list
- `src/app/(dashboard)/payouts/page.tsx` - Payouts list
- `src/app/(dashboard)/settings/page.tsx` - Settings

**FR-5:** Navigation items:
| Label | Icon | Path |
|-------|------|------|
| Dashboard | Home | `/` |
| Leads | Users | `/leads` |
| Jobs | Briefcase | `/jobs` |
| Subs | Truck | `/subs` |
| Payouts | DollarSign | `/payouts` |
| Settings | Settings | `/settings` |

**FR-6:** Use Lucide React for icons:
```bash
npm install lucide-react
```

## 5. Non-Goals

- No actual data displayed on pages yet
- No settings functionality yet
- No notifications in header yet

## 6. Technical Considerations

- Fetch account data in layout (Server Component)
- Use React Context or props for account/user data
- Use shadcn Sheet component for mobile sidebar
- Sidebar width: 256px on desktop

## 7. Acceptance Criteria (Verification)

```bash
npm run build        # No build errors
npm run typecheck    # No TypeScript errors
```

Manual testing:
1. Log in - see dashboard with sidebar
2. Click each nav item - page changes, active state updates
3. See company name "Austin Cleanouts" in sidebar
4. Resize to mobile - sidebar becomes hamburger menu
5. Open mobile menu - see nav items
6. Click user dropdown - see logout option
7. Log out - redirected to login

## 8. Output Files

```
src/app/(dashboard)/
├── layout.tsx              # Dashboard shell
├── page.tsx                # Dashboard home
├── leads/page.tsx          # Placeholder
├── jobs/page.tsx           # Placeholder
├── subs/page.tsx           # Placeholder
├── payouts/page.tsx        # Placeholder
└── settings/page.tsx       # Placeholder

src/components/layout/
├── sidebar.tsx             # Sidebar navigation
├── header.tsx              # Top header bar
└── mobile-nav.tsx          # Mobile menu (Sheet)
```

---

## Implementation Notes

Install additional shadcn components:
```bash
npx shadcn@latest add sheet dropdown-menu avatar separator
```

Example sidebar structure:
```tsx
<aside className="w-64 border-r bg-background">
  <div className="p-4 border-b">
    <h1>{account.company_name}</h1>
  </div>
  <nav className="p-2">
    {navItems.map(item => (
      <Link href={item.path} className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md",
        isActive && "bg-accent"
      )}>
        <item.icon className="h-4 w-4" />
        {item.label}
      </Link>
    ))}
  </nav>
</aside>
```
