# LSH26-T005-P02

Monorepo for the hackathon project. Two independent npm projects:

- `backend/` — [Hono](https://hono.dev) API on Cloudflare Workers, using D1 as the database.
- `frontend/` — Vite + React (TypeScript).

## Setup

### Backend

```bash
cd backend
npm install
npx wrangler login          # first time only, authenticates with Cloudflare
npx wrangler d1 create lsh26-t005-p02-db   # copy the returned database_id into wrangler.jsonc
npx wrangler d1 execute lsh26-t005-p02-db --local --file=./migrations/0001_init.sql
npm run dev                 # local dev server (http://localhost:8787)
```

Apply the same migration remotely before deploying:

```bash
npx wrangler d1 execute lsh26-t005-p02-db --remote --file=./migrations/0001_init.sql
npm run deploy
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Point the frontend at the backend via an env var (e.g. `VITE_API_URL=http://localhost:8787` in `frontend/.env.local`).

## Secrets

Never commit real secrets. `.env`, `.env.local`, `.dev.vars` are gitignored in both `frontend/` and `backend/`.

- **Local dev (backend):** copy `backend/.dev.vars.example` to `backend/.dev.vars` and fill in real values — `wrangler dev` reads it automatically.
- **Production (backend):** use `npx wrangler secret put SECRET_NAME` to upload a secret to Cloudflare — it's encrypted server-side and never touches the repo or `wrangler.jsonc`.
- **Frontend:** anything in `VITE_*` env vars is bundled into the client build and is publicly visible — never put real secrets there, only non-sensitive config like API URLs.
- `wrangler.jsonc`'s `database_id` is not a secret (it's just a resource identifier, useless without Cloudflare account auth), so it's safe to commit.

## Structure

```
backend/    Hono + Cloudflare Workers + D1
  src/index.ts       API entry point
  migrations/         D1 SQL migrations
  wrangler.jsonc      Cloudflare Workers config (D1 binding: DB)
frontend/   Vite + React + TypeScript
```
