# Features

Current status of every feature. Updated whenever an instruction is implemented or changed.

## Done

- **P02 Pharmacy Expiry Shelf Check** — the actual hackathon deliverable.
  - Stock list of 46 medicines (backend/seed.sql), spanning expired → safe.
  - Dashboard split into expired / within-30 / within-90 / safe, with counts and taka values, computed from the real current date (not fixed data).
  - Mark-as-returned moves an item out of active groups/values into a separate Returned tab (`POST /api/medicines/:id/return`, `/unreturn` to undo).
  - Total value at risk shown (expired + within-30 combined, per clarification R-27/R-04).
  - Bonus: search + company filter, 6-month value-at-risk chart, quick-add form with shelf-life presets.
  - `POST /api/import` accepts the same shape as the grading JSON's cases (`{today, items, mark_returned}`) — used to self-test against `agents/P02_pharmacy_expiry_public.json`; all 25 provided cases pass.
  - Live at https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev (backend: https://backend.tahsinhasib.workers.dev).
- **Project scaffold** — Hono backend (Cloudflare Workers) + Vite/React frontend, monorepo layout.
- **D1 database** — `lsh26-t005-p02-db`, bound as `env.DB`. `medicines` + `settings` tables (migration `0002_medicines.sql`, superseded the old placeholder `items` table from `0001_init.sql`, which is dropped).
- **Backend deploy** — live at https://backend.tahsinhasib.workers.dev. CORS open to all origins.
- **Frontend deploy** — live at https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev.
- **Frontend–backend wiring** — `frontend/src/lib/api.ts` reads `VITE_API_URL` (falls back to the deployed backend URL); local dev points at `http://localhost:8787` via `frontend/.env.development.local`.

## Pending / not started

- No auth on any endpoint (including `/api/import`, which wipes and replaces the whole stock list — fine for a hackathon, would need protecting before any real use).
- CORS is wide open (`*`) — fine for a hackathon demo, tighten if this needs to go further.
- Whatever the next instruction in `agents/instructions/` asks for.
