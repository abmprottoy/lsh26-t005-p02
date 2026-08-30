# Features

Current status of every feature. Updated whenever an instruction is implemented or changed.

## Done

- **Project scaffold** — Hono backend (Cloudflare Workers) + Vite/React frontend, monorepo layout.
- **D1 database** — `lsh26-t005-p02-db`, bound as `env.DB`. Migration `backend/migrations/0001_init.sql` creates an `items` table (id, name, created_at). No API routes use it yet.
- **Backend deploy** — live at https://backend.tahsinhasib.workers.dev. Routes: `GET /` (hello), `GET /api/health` (status check). CORS open to all origins.
- **Frontend deploy** — live at https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev. Shows a backend online/offline indicator on load.
- **Frontend–backend wiring** — `frontend/src/lib/api.ts` reads `VITE_API_URL` (falls back to the deployed backend URL); local dev points at `http://localhost:8787` via `frontend/.env.development.local`.

## Pending / not started

- No real data model or CRUD routes on top of the `items` table yet — it's just a schema placeholder.
- No auth.
- CORS is wide open (`*`) — fine for a hackathon demo, tighten if this needs to go further.
- Whatever the next instruction in `agents/instructions/` asks for.
