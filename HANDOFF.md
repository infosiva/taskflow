# HANDOFF — TaskFlow product scope + Neon dark redesign
**Date:** 2026-06-11  **Status:** IN PROGRESS
**Goal:** Make TaskFlow the #1 priority project: dark Neon design applied across all pages, internal ops kanban for tracking all portfolio agents, migration UX from Jira/Trello/Asana/Linear, and full Neon DB + auth stack wired.

## What's done
- [x] `app/(auth)/login/page.tsx` — dark Neon redesign, magic link, teal accent
- [x] `app/(auth)/signup/page.tsx` — dark Neon redesign, magic link, free tier checklist
- [x] `app/page.tsx` — dark Neon redesign (teal #14b8a6, #0a0a0b bg, radial mesh, interactive kanban demo)
- [x] Neon DB connected (DATABASE_URL, DATABASE_URL_UNPOOLED pushed to Vercel)
- [x] Production deployed to Vercel (sivaprakasam scope)

## Files to touch next
- `app/migrate/page.tsx` — NEW: migration landing page (Jira/Trello/Asana/Linear → TaskFlow)
- `app/app/page.tsx` (or `app/(app)/board/page.tsx`) — main app board, agent-ops mode
- `app/layout.tsx` — ensure metadataBase, OG image, sitemap wired
- `lib/db/schema.ts` — verify tables match product scope: tasks, boards, projects, members, agent_runs
- `components/migration/` — CSV upload, Jira XML import, Linear JSON import parsers

## Product scope (user's vision)
1. **TaskFlow as internal ops kanban** — every portfolio project gets a board, agents post task updates here
2. **Neon CLI aesthetic** — dark `#0a0a0b`, teal `#14b8a6`, same mesh gradient style as login/signup/home
3. **Migration UX** — easy path from Jira / Trello / Asana / Linear / GitHub Issues → TaskFlow
4. **Agent activity feed** — agents running on other projects post status cards to TaskFlow board

## Migration feature scope (per project type)
| Source | Import method | Priority |
|--------|--------------|---------|
| Jira | XML/CSV export upload | High |
| Trello | JSON export upload | High |
| Asana | CSV export upload | Medium |
| Linear | JSON export (API or file) | Medium |
| GitHub Issues | GitHub API (token) | High |
| Notion | CSV/Markdown export | Low |

## Steps
- [ ] §1 Build migration landing page `app/migrate/page.tsx` — dark Neon, shows 6 source options, CSV/JSON/XML upload UI
- [ ] §2 Build Jira XML parser — extract issues → TaskFlow task format
- [ ] §3 Build Trello JSON parser — extract cards → task format
- [ ] §4 Build GitHub Issues importer — gh API, repo URL + token
- [ ] §5 Agent activity feed schema — `agent_runs` table: id, project, agent_name, status, message, ts
- [ ] §6 Wire TaskFlow board to receive agent POST updates from other projects
- [ ] §7 Deploy + smoke test migration page
- [ ] §8 SEO: sitemap.ts, robots.txt, OG image, JSON-LD

## Success criteria
- Migration page loads, accepts Jira CSV/XML, shows preview before import
- Agent can POST a task update to TaskFlow board via API
- Homepage, login, signup all dark Neon — no light theme anywhere
- Build passes, Playwright screenshots taken

## Resume from here if interrupted
Homepage redesign written. Next: build migration landing page §1.
