# MediTrack — Pharmacy Expiry Shelf Check

**Team LSH26-T005 · Problem P02**

A neighbourhood pharmacy loses money when medicine expires unnoticed on a shelf. MediTrack gives the pharmacist one screen that shows what's expiring, when, and how much taka is at risk — computed live from today's date, not from stale numbers someone typed in once.

**Live app:** https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev
**Live API:** https://backend.tahsinhasib.workers.dev

## What it does

**Required (all 4 implemented):**

1. **Stock list** — 46 seeded medicines (name, batch, quantity, unit price, expiry), spanning already-expired to years-safe. A Quick Add form lets the pharmacist add more, with shelf-life presets that auto-fill a sensible expiry date.
2. **Dashboard** — splits stock into four groups (expired / expiring ≤30 days / expiring ≤90 days / safe), each with a live count and taka value, computed from the real current date on every load.
3. **Mark returned** — pulls an item out of active stock into a separate Returned list, excluded from every active count and value; reversible with one click.
4. **Value at risk** — the taka figure sitting in the expired + expiring-soon groups is shown up front, so the loss is a number, not a feeling.

**Bonus (also implemented):** search + company filter, a 6-month value-at-risk trend chart, and the shelf-life quick-add presets above.

**Beyond the brief**, built out over the course of the hackathon:

- **Overview insights** — a donut chart of stock value composition and a horizontal bar chart of top companies by value at risk, alongside the required group cards
- **PDF reports** — one-click, print-ready stock report (executive summary, group breakdown, top at-risk items, company breakdown, full listing), generated client-side
- **Import data** — load a stock list from a JSON file (including the judges' own test-case format) to verify the app against specific data, with a one-click reset back to the demo stock
- **Help & Guide** — an in-app walkthrough for a first-time user, with worked examples and "try it" links into each feature
- **Table pagination**, debounced search with a loading spinner, a custom dropdown and date picker (no native browser chrome), dark mode, and a responsive layout (fixed sidebar/topbar on desktop, a bottom tab bar on mobile)

See `agents/CHANGELOG.md` for the full build history and `agents/FEATURES.md` for a running status list.

## Tech stack

- **Backend:** [Hono](https://hono.dev) on Cloudflare Workers, [D1](https://developers.cloudflare.com/d1/) (SQLite) for storage
- **Frontend:** Vite + React + TypeScript, deployed as static assets on Cloudflare Workers
- No UI framework/component library — hand-built design system (CSS custom properties, light/dark themes) and hand-built charts (plain SVG, no charting library)

## Project structure

```
backend/
  src/index.ts          API entry point — all routes
  src/lib/grouping.ts    expiry-group + days-left logic
  src/lib/demoData.ts    demo stock list (mirrors seed.sql, computed relative to today)
  migrations/            D1 SQL migrations
  seed.sql               46-item demo stock list
  bruno/                 Bruno API collection (Local + Production environments)
  wrangler.jsonc          Cloudflare Workers config (D1 binding: DB)

frontend/
  src/App.tsx             app shell, routing between pages, filters/search state
  src/components/         Sidebar, Topbar, Overview, MedicineTable, DataTools,
                           ReportsPage, HelpPage, Dropdown, DatePicker, charts, ...
  src/lib/api.ts          typed fetch wrappers for the backend API
  src/lib/report.ts       client-side PDF report generation (jsPDF)

agents/
  CHANGELOG.md            dated log of every change made
  FEATURES.md             current status: done / pending
  instructions/           local instruction queue (gitignored)
```

## API reference

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | health check |
| GET | `/api/medicines` | list stock (`search`, `company`, `group`, `status` query params) |
| GET | `/api/companies` | distinct company list |
| GET | `/api/dashboard` | group counts/values + 6-month risk chart data |
| POST | `/api/medicines` | quick add a medicine |
| POST | `/api/medicines/:id/return` | mark returned |
| POST | `/api/medicines/:id/unreturn` | undo a return |
| POST | `/api/import` | bulk-replace the stock list (used for grading/testing) |
| POST | `/api/demo/reset` | restore the original demo stock list |

Full request examples live in `backend/bruno/` — open that folder in the [Bruno](https://www.usebruno.com/) app, or run `npx @usebruno/cli run --env Local` from inside it.

## Setup

### Backend

```bash
cd backend
npm install
npx wrangler login                          # first time only
npx wrangler d1 create lsh26-t005-p02-db     # copy the returned database_id into wrangler.jsonc
npx wrangler d1 execute lsh26-t005-p02-db --local --file=./migrations/0002_medicines.sql
npx wrangler d1 execute lsh26-t005-p02-db --local --file=./seed.sql
npm run dev                                  # http://localhost:8787
```

Before deploying, apply the same migration and seed remotely:

```bash
npx wrangler d1 execute lsh26-t005-p02-db --remote --file=./migrations/0002_medicines.sql
npx wrangler d1 execute lsh26-t005-p02-db --remote --file=./seed.sql
npm run deploy
```

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Local dev points at `http://localhost:8787` via `frontend/.env.development.local` (gitignored, dev-only). Production build falls back to the deployed backend URL if `VITE_API_URL` isn't set.

## Secrets

Never commit real secrets. `.env`, `.env.local`, `.dev.vars` are gitignored in both `frontend/` and `backend/`.

- **Local dev (backend):** copy `backend/.dev.vars.example` to `backend/.dev.vars` — `wrangler dev` reads it automatically.
- **Production (backend):** use `npx wrangler secret put SECRET_NAME` — encrypted server-side, never touches the repo.
- **Frontend:** `VITE_*` env vars are bundled into the client build and publicly visible — never put real secrets there.
- `wrangler.jsonc`'s `database_id` is not a secret (a resource identifier, useless without Cloudflare account auth) — safe to commit.

## Licenses

See [`LICENSES.md`](LICENSES.md) for the full list of third-party dependencies and their licenses.
