# Changelog

Chronological log of changes made to this project. Newest first.

## 2026-08-30 (Restore horizontal scroll on the stock table)

- The previous fix (fixed per-column widths as percentages summing to 100%) stopped the pagination jump but had a side effect: percentage widths always force the table to fit exactly inside its container, so on narrower screens content was getting truncated (ellipsis) with no way to see the rest. Switched the column widths from percentages to fixed px values (`min-width: 1160px` on the table) — now on wide screens the table still fills the container width, but on narrower ones it holds its columns at their real size and the existing `.table-scroll { overflow: auto }` container scrolls horizontally instead of cutting content off.

## 2026-08-30 (Stabilize table column widths and height across pages)

- Fixed the pagination Prev/Next buttons visibly shifting up/down between pages. Two causes: the table used `table-layout: auto`, so column widths resized per page based on that page's content (e.g. a longer medicine name on page 2 would widen that column and reflow everything); and the last page usually has fewer than 10 rows, so the table itself got shorter, moving the footer up. Fixed both — `table-layout: fixed` with explicit per-column width percentages (plus `text-overflow: ellipsis` so long content truncates instead of overflowing), and a `min-height` on the scroll container sized to a full 10-row page so a short last page just leaves blank space below its rows instead of shrinking the table.
- Deployed: https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev

## 2026-08-30 (PDF report, table pagination, search spinner)

- **PDF report** (sidebar → Reports, `frontend/src/lib/report.ts`, `jspdf` + `jspdf-autotable`): generates a multi-page, print-ready PDF — header with pharmacy name/date, an executive summary paragraph, a group-breakdown table (color-coded to match the app's badge colors), a top-15 at-risk items table, a value-at-risk-by-company table, a full active stock listing sorted by expiry on its own page, and page-number footers on every page. Downloads client-side via `doc.save()`, no backend involved. Uses "Tk" instead of "৳" in the PDF since jsPDF's built-in fonts don't render the Bengali taka glyph. The library is dynamically `import()`-ed only when the download button is clicked, so its ~430KB doesn't load on every page — kept the main bundle at its previous size.
- **Table pagination**: `MedicineTable` now paginates client-side at 10 rows/page (Prev/Next + "Page X of Y", "Showing A–B of N items"). Page resets to 1 whenever the active filters (search/company/group/tab) change, via a `resetKey` prop from `App.tsx`, so it doesn't reset on unrelated updates like marking an item returned.
- **Search spinner + debounce**: typing in the topbar search no longer fires a request per keystroke — it's debounced 300ms before triggering the fetch. While a fetch is in flight, the table shows a centered spinner over the existing (dimmed, non-interactive) rows instead of blanking the table, so filtering feels like a smooth transition rather than a flash of "Loading…".
- Deployed: https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev

## 2026-08-30 (Fix icon/label spacing in the Import data tab)

- The mobile bottom tab bar centered each tab's content vertically (`justify-content: center`). "Import data" is the only two-word label, so it wraps to 2 lines while the others (Overview, Stock, Returned) stay on 1 — centering meant its icon sat at a different height than the other tabs' icons, reading as inconsistent icon/label spacing. Switched to `justify-content: flex-start` with fixed top padding so every tab's icon aligns to the same position regardless of how many lines its label wraps to. Also added `flex-shrink: 0` on nav icons generally so they can't get squeezed.

## 2026-08-30 (Bottom tab bar on mobile)

- Sidebar navigation now becomes a fixed bottom tab bar on mobile (≤820px) instead of a horizontal strip at the top: `position: fixed; bottom: 0` with icon-over-label buttons, evenly spaced. Brand and the backend-status footer are hidden at that width (no room); the two nav groups (Workspace / Tools) collapse into one row of 4 tabs via `display: contents`.
- `.content-col` gets bottom padding at that breakpoint so page content (especially the last table rows) doesn't sit underneath the fixed bar; respects `env(safe-area-inset-bottom)` for phones with a home-indicator.

## 2026-08-30 (Mobile responsive fixes)

- Fixed several things that broke on narrow screens:
  - `.cards` (the 4 group stat cards) used `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` — a 200px hard minimum per card doesn't fit on most phones, which forced the whole page to scroll horizontally. Lowered the minimum and added explicit 2-column / 1-column breakpoints at 560px / 400px.
  - `.dropdown-menu` had a hardcoded `min-width: 200px`, so on a narrow trigger (e.g. a toolbar filter) the menu could render wider than its trigger and spill past the screen edge. Replaced with a `max-width: calc(100vw - 32px)` cap instead.
  - `.page-header` and `.risk-banner` didn't wrap, so title+button and the risk figure+SKU-count stat could overflow on small screens. Added `flex-wrap: wrap` and a mobile-only style for `.risk-meta` (drops the side border/margin and left-aligns when it wraps below).
  - Added a `@media (max-width: 560px)` pass: topbar loses the breadcrumb and the "/" search hint and tightens its padding/gaps, the chart's Y-axis column and bar gaps shrink so 6 months of bars stay legible instead of being crushed, and card/tool-card/main padding is reduced.
  - Added `overflow-x: hidden` on `html`/`body` as a backstop against any remaining 1–2px overflow.
- Deployed: https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev

## 2026-08-30 (Custom dropdown component + modal width fix)

- Replaced every native `<select>` (Quick Add's shelf-life picker, the Stock company filter, the Import-data case picker) with a new `Dropdown.tsx` component styled to match the rest of the app — same border/radius/padding as text inputs, a panel that reuses the same look as the Topbar's profile menu (rounded, shadowed, hover states, checkmark on the selected item), click-outside and Escape to close. Native selects render with browser/OS chrome that can't be fully styled and don't match the app's design system, which is what was reported as looking off.
- Fixed the Quick Add modal: inputs didn't have an explicit `width: 100%`, so on some rendering paths they didn't fill their label the same way the dropdown now does, reading as uneven padding. Made both explicit and consistent.

## 2026-08-30 (Table alignment fix + chart axes)

- Fixed the stock table: the sticky-header CSS trick from the earlier redesign (`display: table` on `thead`/each `tbody tr` separately) let each row compute its own column widths independently, so header and body columns didn't line up — that's what looked like inconsistent padding. Replaced it with a normal `<table>` inside a `.table-scroll` container (`overflow: auto; max-height`) and native `position: sticky` on `th`, which keeps one shared column layout. Also evened out edge padding (first/last cell get extra side padding so the grid isn't flush against the card border).
- Removed the `max-width: 1180px` cap on `.main` — the table/cards now use the full available width next to the sidebar instead of stopping short on wide screens.
- Chart ("value at risk, next 6 months") now has real axes: a Y-axis with 5 taka-value ticks (compact format, e.g. ৳21.3k) and dashed gridlines, plus the existing month labels turned into a proper X-axis row, with "Month" and "Value (৳)" axis titles. Previously it was bars with no scale reference at all.

## 2026-08-30 (Import-data feature)

- New sidebar page **Import data** (`frontend/src/components/DataTools.tsx`) so test files can be loaded through the UI instead of curl/Bruno:
  - Browse for a local `.json` file. Accepts either the judges' multi-case format (`{ "cases": [...] }`, e.g. `agents/P02_pharmacy_expiry_public.json`) or a single case object (`{ "today"?, "items": [...], "mark_returned"? }`). Parsing and format validation happen client-side before anything is sent to the backend.
  - If the file has multiple cases, a dropdown lists each one (case id, its "today" date, item/returned counts) to pick from before importing.
  - "Reset to demo data" button restores the original 46-item seed list, so a judge/test import can always be undone.
  - Both actions call the existing `/api/import` endpoint (unchanged) plus a new `POST /api/demo/reset` endpoint.
- Backend: `backend/src/lib/demoData.ts` mirrors `backend/seed.sql` as a TS array with day-offsets from today (verified to produce byte-identical dashboard totals to the SQL seed — 6/11/9/20 across the four groups). `/api/demo/reset` computes expiry dates from the real current date and reuses the same `replaceStock()` helper that `/api/import` uses (deduplicated from what was inline code before).
- Added a `09 - Reset Demo Data` request to the Bruno collection.
- Verified end-to-end: imported PUB-01 from the judges' file through the live endpoint (47 items, correct group split), then reset back to demo data (46 items) — both on local and deployed backend.
- Deployed: https://backend.tahsinhasib.workers.dev and https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev

## 2026-08-30 (ERP-style polish — top navbar, refined sidebar & cards)

- Added a proper **top navbar** (`Topbar.tsx`): breadcrumb (MediTrack / current section), a global search box that jumps to Stock and filters as you type, today's date, a notification bell with a dot when items are expired, and a profile menu (avatar, name/role, dropdown) — click-outside-to-close.
- Sidebar: added a "Workspace" section label above the nav for a more structured, ERP-like grouping.
- Overview cards now carry a per-group icon (alert / clock / calendar / check) in a tinted chip, and the risk banner shows a secondary stat (total active SKUs tracked) alongside the taka figure.
- Table: sticky header so column names stay visible on scroll, a "Showing N items" footer, tighter row/column spacing.
- Switched body font to Inter (Google Fonts, with system-font fallback) and tightened the spacing/radius/shadow scale across the app for a more consistent, "pixel-considered" look.
- Removed the redundant local search box from the Stock toolbar — search now lives once, in the topbar.
- Rebuilt and redeployed: https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev

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
