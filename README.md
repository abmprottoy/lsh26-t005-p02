# MediTrack — Pharmacy Expiry Shelf Check

**Team LSH26-T005 · Problem P02**

A neighbourhood pharmacy loses money when medicine expires unnoticed on a shelf. MediTrack gives the pharmacist one screen that shows what's expiring, when, and how much taka is at risk — computed live from today's date, not from stale numbers someone typed in once.

## Project information

- **Team:** Automagic
- **Team ID:** LSH26-T005
- **Problem:** P02 — Pharmacy Expiry Shelf Check
- **Repository:** <https://github.com/abmprottoy/lsh26-t005-p02>
- **Live application:** <https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev>
- **Live API:** <https://backend.tahsinhasib.workers.dev>
- **Demo video:** Not supplied

> Judges evaluate only the exact 40-character commit SHA entered in the Final Submission Form.

## Requirement proof

| Requirement | Status | Where to verify |
| --- | --- | --- |
| R1 — Maintain a pharmacy stock list with the required medicine fields | Complete | **Stock** page, `backend/seed.sql`, `backend/src/lib/demoData.ts`, and `GET /api/medicines`. Reset restores 46 medicines. |
| R2 — Group active stock by expiry urgency | Complete | **Overview** and `backend/src/lib/grouping.ts`: expired, 0–30 days inclusive, 31–90 days, and safe are calculated from the effective date. |
| R3 — Mark stock returned and remove it from active totals | Complete | **Stock** → **Mark returned**, the separate **Returned** page, and the return/unreturn API routes. |
| R4 — Calculate taka value at risk | Complete | **Overview** risk banner and `GET /api/dashboard`; item value is quantity × unit purchase price, and risk is expired plus 0–30-day value. |

## How judges can verify it

1. Open the live application. The Overview should show 46 active medicines after a demo reset.
2. Confirm the four expiry groups and the value-at-risk banner.
3. Open **Stock**, mark one medicine returned, and confirm it leaves active totals and appears under **Returned**.
4. Use **Undo** on the Returned page and confirm it returns to active stock.
5. Open **Import data** to load the published JSON wrapper or one case. Select the desired case before importing.
6. Choose **Reset to demo data** when finished to restore the 46-medicine demonstration set.

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
npm ci
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
npm ci
npm run dev          # http://localhost:5173
```

Local dev points at `http://localhost:8787` via `frontend/.env.development.local` (gitignored, dev-only). Production build falls back to the deployed backend URL if `VITE_API_URL` isn't set.

### Verification

```bash
cd backend
npm run cf-typegen
npm run typecheck

cd ../frontend
npm run lint
npm run build
```

The frontend linter currently reports one non-blocking immutability warning in the hand-built donut-chart accumulator. The production build and TypeScript checks complete successfully.

## Secrets

Never commit real secrets. `.env`, `.env.local`, `.dev.vars` are gitignored in both `frontend/` and `backend/`.

- **Local dev (backend):** copy `backend/.dev.vars.example` to `backend/.dev.vars` — `wrangler dev` reads it automatically.
- **Production (backend):** use `npx wrangler secret put SECRET_NAME` — encrypted server-side, never touches the repo.
- **Frontend:** `VITE_*` env vars are bundled into the client build and publicly visible — never put real secrets there.
- `wrangler.jsonc`'s `database_id` is not a secret (a resource identifier, useless without Cloudflare account auth) — safe to commit.

## Licenses

See [`LICENSES.md`](LICENSES.md) for the full list of third-party dependencies and their licenses.

## Problem-solving approach

The implementation keeps time-sensitive expiry logic explicit: each item is classified from the current or imported effective date instead of storing a status that can become stale. The Worker returns computed days remaining, group, and stock value, while React renders the operational workflow without duplicating the rules. Returned inventory remains stored for auditability but is excluded from every active total.

## Major design decisions

- **Live classification:** expiry groups are recalculated from dates on every request.
- **Clarification-aligned value:** every taka value uses quantity multiplied by unit purchase price; value at risk includes expired and 0–30-day stock only.
- **Reversible return workflow:** marking returned removes an item from active figures without deleting its record.
- **Judge-controlled data:** Import data accepts the published wrapper or one case and allows a reset to the demonstration inventory.
- **Separate deploys:** the React frontend and Hono/D1 backend can be deployed and diagnosed independently.

## Team contributions

| Registered member | GitHub username | Major contribution | Evidence |
| --- | --- | --- | --- |
| Ammar Bin Mahmud | `abmprottoy` | Team lead; submission coordination, history-preserving repository transfer, compliance review, and final judging documentation | `README.md`, `evaluation-manifest.json` |
| Md. Tahsin Hasib | `tahsinhasib` | Primary P02 implementation: backend, D1 model, expiry and value calculations, return workflow, frontend, charts, reports, import workflow, responsive UI, and deployment | `backend/`, `frontend/`, commits `5e1d90b` and `6fe4f43` |

Commit count alone does not represent contribution. The original 16 implementation commits remain attributed to Tahsin's declared GitHub identity.

## AI usage

Anthropic Claude assisted the implementation and iterative feature workflow recorded under `agents/`. OpenAI Codex assisted the final submission audit, v2.2 manifest conversion, contribution evidence, documentation, and release verification. The outputs were checked through review of the preserved history, TypeScript and production builds, direct API probes, and the deployed application.

## Known limitations

- The API has no authentication; import and demo reset replace the shared production stock data.
- The backend currently accepts cross-origin requests from any origin.
- There is no committed automated test suite; verification uses TypeScript/build checks, direct API probes, and manual fixture imports.
- The live frontend and API remain deployed in Tahsin's Cloudflare account.

## Repository records

- [`EVENT.md`](EVENT.md) — event start code and pre-event-material declaration
- [`evaluation-manifest.json`](evaluation-manifest.json) — structured requirement and contribution evidence
- [`LICENSES.md`](LICENSES.md) — dependencies, assets, and AI disclosure
