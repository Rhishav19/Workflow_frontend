# WorkFlow

A workspace-based project management and workflow tracking app — projects, tasks, time tracking, budgets, docs, announcements, and team activity, all scoped per-workspace with role-based access (Admin / Manager / Employee).

Built as a capstone project for the Bachelor of Software Engineering program at NCIT (Nepal College of Information Technology), Pokhara University.

## Tech stack

- **Frontend:** React 19 + Vite, `react-router-dom` v7, Tailwind CSS, `lucide-react` icons, `recharts` for charts, Zustand
- **Backend:** Supabase (PostgreSQL, Realtime, Storage) — no separate backend server; the frontend talks to Supabase directly
- **Auth:** Custom-built, not Supabase Auth. Passwords are bcrypt-hashed (`pgcrypto`) and every read/write to the `accounts` table goes through `SECURITY DEFINER` Postgres functions (`verify_login`, `register_account`, `change_password`) rather than direct table access
- **Testing:** Playwright

## Modules

| Module | Status |
|---|---|
| Auth (Login, Admin self-registration, admin-created Employee/Manager accounts) | Live |
| Projects | Live — create, edit status, delete, realtime sync |
| Tasks | Live — Kanban board, create/delete, submission + review flow |
| Time Tracking | Live — start/stop timers, auto-logs entries, moves a task to "In Progress" on start |
| Members | Live |
| Budget & Expenses | Live — Admin/Manager only |
| Docs | Live — real file upload via Supabase Storage |
| Announcements | Live |
| Activity feed | Live — dashboard widget + full `/dashboard/activity` page |
| Analytics | Present, not verified as part of this write-up |

## Getting started

```bash
npm install
```

Create a `.env` file in the project root (never committed — get these from Supabase Dashboard → Project Settings → API):

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```

## Database setup

All schema is in `sql query/`. Run these in the Supabase SQL editor, in this order, against a fresh project:

1. `workspace.sql`, `accounts.sql`, `membership.sql`, `members.sql`, `project.sql`, `tasks.sql`, `time_entries.sql`, `budget&expense.sql`, `spending.sql`
2. `securityhardening.sql` — enables `pgcrypto`, hashes any plaintext passwords, adds the auth functions, locks down `accounts`
3. `fix_pgcrypto.sql` — re-applies the same three auth functions with the correct `search_path`; Supabase installs `pgcrypto` outside the `public` schema, so this fixes a `function gen_salt(unknown) does not exist` error the first version hits
4. `policies_recreates.sql` — RLS policies for the rest of the tables

**Docs** and **Activity** each need one more table + a Storage bucket set up directly (not yet scripted into this repo — see below).

## Known gaps

- `docs` and `activity_log` tables exist in the live database but aren't yet documented as `.sql` files in this repo — anyone setting up a fresh instance from `git clone` alone will need to recreate them by hand for now.
- Org chart and a few other in-progress modules exist on separate branches, not yet merged into `main`.
- No formal test coverage beyond Playwright being present as a dependency.

## Project structure

```
src/
  context/     # one React Context per domain (Auth, Projects, Tasks, TimeTracking, ...)
  pages/       # top-level routed pages
  components/  # shared + domain-grouped UI components
  data/        # Supabase query functions
  lib/         # Supabase client setup
sql query/     # database schema and migrations, run manually in Supabase's SQL editor
```