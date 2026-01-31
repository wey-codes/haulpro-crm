# Task: Initialize Next.js Project

**Status:** pending
**Phase:** 0 - Project Setup
**Depends On:** none
**Estimated Time:** 30 minutes

---

## 1. Overview

Initialize a new Next.js 14 project with TypeScript, Tailwind CSS, and the App Router. This is the foundation for the HaulPro CRM application.

## 2. Goals

- Create a working Next.js 14 application with TypeScript
- Configure Tailwind CSS for styling
- Set up the App Router structure
- Install and configure shadcn/ui for components
- Establish consistent code formatting with ESLint/Prettier

## 3. User Stories

### 3.1 Developer can run the app locally
**As a** developer
**I want** to run `npm run dev` and see the app start
**So that** I can begin building features

**Acceptance Criteria:**
- [ ] `npm run dev` starts the app on localhost:3000
- [ ] No TypeScript errors on startup
- [ ] Tailwind CSS classes render correctly

### 3.2 Developer can build for production
**As a** developer
**I want** to run `npm run build` without errors
**So that** I know the app is production-ready

**Acceptance Criteria:**
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes with no warnings

## 4. Functional Requirements

**FR-1:** Project must use Next.js 14 with App Router (not Pages Router)

**FR-2:** TypeScript must be configured with strict mode enabled

**FR-3:** Tailwind CSS must be configured with the default theme extended for brand colors

**FR-4:** shadcn/ui must be initialized with the following components:
- Button
- Input
- Card
- Dialog

**FR-5:** ESLint must be configured with Next.js recommended rules

**FR-6:** The project must have this folder structure:
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/
└── lib/
    └── utils.ts
```

## 5. Non-Goals

- No database connection in this task
- No authentication in this task
- No actual page content beyond a placeholder

## 6. Technical Considerations

- Use `src/` directory for all source code
- Use path aliases (`@/` for `src/`)
- Configure for Vercel deployment compatibility

## 7. Acceptance Criteria (Verification Commands)

```bash
# All must pass:
npm run dev          # Starts without errors
npm run build        # Builds successfully
npm run lint         # No linting errors
npm run typecheck    # No TypeScript errors (add this script)
```

## 8. Output Files

After completion, these files should exist:
- `package.json` with all dependencies
- `tsconfig.json` with strict mode
- `tailwind.config.ts` with shadcn/ui config
- `src/app/layout.tsx` with basic HTML structure
- `src/app/page.tsx` with placeholder content
- `src/lib/utils.ts` with cn() helper
- `components.json` for shadcn/ui

---

## Implementation Notes

```bash
# Commands to run:
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx shadcn@latest init
npx shadcn@latest add button input card dialog
```

Add to `package.json` scripts:
```json
"typecheck": "tsc --noEmit"
```
