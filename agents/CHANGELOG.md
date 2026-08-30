# Changelog

Chronological log of changes made to this project. Newest first.

## 2026-08-30 (UI redesign — sidebar navigation)

- Rebuilt the frontend UI to be more modern and easier to navigate:
  - Added a persistent left **sidebar** (`frontend/src/components/Sidebar.tsx`) with three sections — Overview, Stock, Returned — plus a live backend-connection indicator and an alert badge on Stock showing the expired count.
  - Split the old single-file dashboard into components: `Overview.tsx` (risk banner, group cards, 6-month chart), `MedicineTable.tsx` (shared table for active/returned views), `QuickAddModal.tsx`, and a small inline icon set (`icons.tsx`, no external icon library).
  - Clicking a group card on Overview now jumps to Stock pre-filtered to that group.
  - New visual design: cohesive color system (CSS variables for primary/danger/warn/info), card shadows, rounded corners, a dark sidebar with a green accent, hover states, and a responsive layout that collapses the sidebar to icons-only on narrow screens.
  - No backend or business-logic changes — same API, same grouping rules.
- Rebuilt and redeployed frontend: https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev

## 2026-08-30 (Pharmacy Expiry Shelf Check — P02)

- Implemented the full P02 problem statement, backend + frontend:
  - **D1 schema** (`backend/migrations/0002_medicines.sql`): `medicines` table (id, name, company, batch, quantity, unit_price_bdt, expiry, returned, returned_at) + a `settings` table used only to let the grading/test harness override "today" (production always uses the real date).
  - **Grouping logic** (`backend/src/lib/grouping.ts`): expired / within30 (0–30 days inclusive) / within90 (31–90) / safe (90+), computed live from the current date per item — never stored.
  - **Backend routes**: `GET /api/medicines` (search/company/group/status filters), `GET /api/dashboard` (group counts + values, returned count, 6-month value-at-risk chart), `GET /api/companies`, `POST /api/medicines` (quick add), `POST /api/medicines/:id/return` and `/unreturn`, `POST /api/import` (bulk load a stock list — same shape as the grading JSON's case objects, used for testing).
  - **Seed data** (`backend/seed.sql`): 46 medicines with expiry dates relative to `date('now', ...)`, spanning already-expired to 2-years-safe, so the demo always has items in all four groups regardless of when it's run.
  - **Frontend** (`frontend/src/App.tsx`): single dashboard screen — 4 clickable group cards (count + taka value), a red banner for total value at risk (expired + within30, per R-27/R-04), a 6-month value-at-risk bar chart, search + company filter, active/returned tabs, mark-returned/undo actions, and a quick-add modal with shelf-life presets (6mo/1yr/2yr) that auto-fills the expiry date.
  - Implements all 3 bonus features (search/filter, 6-month chart, quick-add with shelf-life default) since all 4 required items were done first.
- **Verified against the grading data**: wrote a throwaway Node script that replays all 25 cases in `agents/P02_pharmacy_expiry_public.json` through `/api/import` + `/api/dashboard` and independently recomputes expected group counts/values in JS — all 25/25 passed, confirming the day-boundary rule (0–30 inclusive) and the returned-item exclusion rule (R-24) are implemented correctly.
- Deployed: backend redeployed to https://backend.tahsinhasib.workers.dev, frontend rebuilt and redeployed to https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev. Remote D1 migrated and reseeded.

## 2026-08-30

- Set up `agents/` workflow folder (`instructions/`, `CHANGELOG.md`, `FEATURES.md`) for tracking future instruction-driven work.
- Connected frontend to backend: frontend fetches `/api/health` on load and shows an online/offline indicator (`frontend/src/lib/api.ts`); `VITE_API_URL` configurable, falls back to the deployed backend URL.
- Deployed backend to Cloudflare Workers: https://backend.tahsinhasib.workers.dev
- Deployed frontend to Cloudflare Workers (static assets): https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev
- Created D1 database `lsh26-t005-p02-db`, applied initial migration (`backend/migrations/0001_init.sql`, creates `items` table) locally and remotely.
- Scaffolded backend (Hono + Cloudflare Workers) and frontend (Vite + React + TypeScript) as a monorepo.
