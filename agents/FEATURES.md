# Features

Current status of every feature. Updated whenever an instruction is implemented or changed.

## Done

- **P02 Pharmacy Expiry Shelf Check** — the actual hackathon deliverable.
  - Stock list of 46 medicines (backend/seed.sql), spanning expired → safe, dated relative to today so it always demos correctly.
  - Dashboard split into expired / within-30 / within-90 / safe, with counts and taka values, computed from the real current date (not fixed data).
  - Mark-as-returned moves an item out of active groups/values into a separate Returned tab (`POST /api/medicines/:id/return`, `/unreturn` to undo).
  - Total value at risk shown (expired + within-30 combined, per clarification R-27/R-04).
  - Bonus: search + company filter, 6-month value-at-risk chart (now with real X/Y axes and gridlines), quick-add form with shelf-life presets.
  - `POST /api/import` accepts the same shape as the grading JSON's cases (`{today, items, mark_returned}`) — verified against all 25 cases in `agents/P02_pharmacy_expiry_public.json` (25/25 pass).
  - Live at https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev (backend: https://backend.tahsinhasib.workers.dev).
- **Import data page** (sidebar → Import data) — browse for a local JSON file (either the judges' multi-case format or a single case object), preview it, pick a case if there are several, and import it through `POST /api/import`. A "Reset to demo data" button restores the original 46-item seed via `POST /api/demo/reset` (mirrors `seed.sql`, computed in `backend/src/lib/demoData.ts`).
- **PDF stock report** (sidebar → Reports) — one-click, print-ready PDF: executive summary, group breakdown, top-15 at-risk items, value-at-risk by company, and a full stock listing on its own page, with page numbers. Generated client-side (`jspdf` + `jspdf-autotable`, dynamically loaded so it doesn't bloat the main bundle).
- **Table pagination & search UX** — the stock table paginates at 10 rows/page (Prev/Next, stable column widths and row height so the controls don't shift between pages); search is debounced (300ms) and shows a spinner over the existing rows while fetching instead of blanking the table. Mark returned/Undo are styled pill buttons (`.btn-pill`), not plain text links.
- **Overview insights** — donut chart (stock value composition by group), horizontal bar chart (top companies by value at risk), and a line/area chart (6-month value-at-risk trend, replacing the earlier bar chart) — all hand-built SVG/CSS, no charting library, theme-matched.
- **Help & Guide page** (sidebar → Help & Guide) — a from-scratch walkthrough for a first-time user: how expiry grouping works (with a worked example), and a collapsible section per page (Overview/Stock/Returned/Import data/Reports) with numbered steps, plus a Tips & FAQ section.
- **ERP-style UI** — sidebar navigation (Overview / Stock / Returned / Import data / Reports / Help & Guide, backend status indicator), a top navbar (breadcrumb, global search, notification bell, profile menu), stat cards with icons, a custom `Dropdown` component replacing all native `<select>`s (matches the app's input styling instead of browser chrome), Inter font, consistent spacing/radius/shadow scale. Fixed app-shell layout on desktop (sidebar/topbar pinned, only the content area scrolls) and a fixed bottom tab bar on mobile instead of a top strip.
- **Project scaffold** — Hono backend (Cloudflare Workers) + Vite/React frontend, monorepo layout.
- **D1 database** — `lsh26-t005-p02-db`, bound as `env.DB`. `medicines` + `settings` tables (migration `0002_medicines.sql`; the placeholder `items` table from `0001_init.sql` is dropped).
- **Backend deploy** — live at https://backend.tahsinhasib.workers.dev. CORS open to all origins.
- **Frontend deploy** — live at https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev.
- **Frontend–backend wiring** — `frontend/src/lib/api.ts` reads `VITE_API_URL` (falls back to the deployed backend URL); local dev points at `http://localhost:8787` via `frontend/.env.development.local`.
- **Bruno API collection** (`backend/bruno/`) — all 9 backend routes covered, Local and Production environments, validated end-to-end with the Bruno CLI.

## Pending / not started

- No auth on any endpoint (including `/api/import` and `/api/demo/reset`, which wipe and replace the whole stock list — fine for a hackathon, would need protecting before any real use).
- CORS is wide open (`*`) — fine for a hackathon demo, tighten if this needs to go further.
- Company search in the toolbar is a dropdown (exact match), not free-text like the name search — flagged as optional polish, not requested yet.
- Whatever the next instruction in `agents/instructions/` asks for.
