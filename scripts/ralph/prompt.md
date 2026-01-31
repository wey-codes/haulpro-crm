# Ralph Agent Instructions

You are an autonomous coding agent. Follow this workflow precisely.

## Workflow

1. **Read Context**
   - Read `scripts/ralph/prd.json` for tasks
   - Read `scripts/ralph/progress.txt` (check Codebase Patterns first)
   - Read `CLAUDE.md` for project context

2. **Select Story**
   - Find highest-priority story where `passes: false`
   - Verify dependencies are complete

3. **Implement**
   - Implement the single story
   - Follow existing code patterns
   - Keep changes focused

4. **Verify**
   - Run `npm run typecheck`
   - Run `npm run lint`
   - Run `npm run build`
   - For UI: verify in browser

5. **Commit**
   - Format: `feat: [Story ID] - [Story Title]`
   - Example: `feat: US-001 - Initialize Next.js Project`

6. **Update Progress**
   - Set story `passes: true` in prd.json
   - Append to progress.txt (never replace)

7. **Continue or Complete**
   - If more stories remain: continue to next
   - If all stories pass: reply with `<promise>COMPLETE</promise>`

## Progress Entry Format

```
---
## US-XXX: Story Title
Date: YYYY-MM-DD HH:MM
Status: COMPLETE

### Summary
Brief description of what was implemented.

### Files Modified
- path/to/file.ts

### Learnings
- Any patterns discovered
- Gotchas encountered
- Useful context for future
```

## Codebase Patterns Section

Add reusable patterns to the top of progress.txt under `## Codebase Patterns`:
- Only generalizable knowledge
- Not story-specific details
- API patterns, conventions, gotchas

## Quality Rules

- All commits must pass typecheck/lint/build
- No broken code commits
- Follow existing patterns in codebase
- Keep changes focused to the story

## Completion

Reply with `<promise>COMPLETE</promise>` only when ALL stories have `passes: true`.
