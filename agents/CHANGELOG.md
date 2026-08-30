# Changelog

Chronological log of changes made to this project. Newest first.

## 2026-08-30

- Set up `agents/` workflow folder (`instructions/`, `CHANGELOG.md`, `FEATURES.md`) for tracking future instruction-driven work.
- Connected frontend to backend: frontend fetches `/api/health` on load and shows an online/offline indicator (`frontend/src/lib/api.ts`); `VITE_API_URL` configurable, falls back to the deployed backend URL.
- Deployed backend to Cloudflare Workers: https://backend.tahsinhasib.workers.dev
- Deployed frontend to Cloudflare Workers (static assets): https://lsh26-t005-p02-frontend.tahsinhasib.workers.dev
- Created D1 database `lsh26-t005-p02-db`, applied initial migration (`backend/migrations/0001_init.sql`, creates `items` table) locally and remotely.
- Scaffolded backend (Hono + Cloudflare Workers) and frontend (Vite + React + TypeScript) as a monorepo.
