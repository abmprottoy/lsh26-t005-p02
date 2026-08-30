# Bruno collection

Open this folder (`backend/bruno`) as a collection in the [Bruno](https://www.usebruno.com/) app, or run it headlessly with the CLI:

```bash
npx @usebruno/cli run --env Local
```

Pick the `Local` environment (`http://localhost:8787`, needs `npm run dev` running in `backend/`) or `Production` (`https://backend.tahsinhasib.workers.dev`) from the environment dropdown.

Requests, in a sensible order to click through:

1. Health
2. Dashboard
3. List Medicines
4. List Companies
5. Quick Add Medicine
6. Mark Returned
7. Undo Return
8. Import Stock — wipes and replaces the whole stock list; use to replay a case from `agents/P02_pharmacy_expiry_public.json`
