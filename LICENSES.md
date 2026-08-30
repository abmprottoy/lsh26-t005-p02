# Licenses

This project's own code (everything under `backend/src`, `frontend/src`, and the D1 schema/seed data) was written for the LSH26 hackathon and carries no separate license file at this time — treat it as all rights reserved to Team LSH26-T005 unless the team decides otherwise.

Below are the open-source third-party packages the project depends on, and their licenses, as declared in each package's own `package.json`.

## Backend (`backend/`)

| Package | Version | License |
| --- | --- | --- |
| [hono](https://github.com/honojs/hono) | ^4.13.5 | MIT |
| [wrangler](https://github.com/cloudflare/workers-sdk) | ^4.110.0 | MIT OR Apache-2.0 |

## Frontend (`frontend/`)

| Package | Version | License |
| --- | --- | --- |
| [react](https://github.com/facebook/react) | ^19.2.8 | MIT |
| [react-dom](https://github.com/facebook/react) | ^19.2.8 | MIT |
| [jspdf](https://github.com/parallax/jsPDF) | ^4.2.1 | MIT |
| [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | ^5.0.8 | MIT |
| [vite](https://github.com/vitejs/vite) | ^8.2.2 | MIT |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | ^6.1.0 | MIT |
| [@cloudflare/vite-plugin](https://github.com/cloudflare/workers-sdk) | ^1.54.2 | MIT |
| [wrangler](https://github.com/cloudflare/workers-sdk) | ^4.127.1 | MIT OR Apache-2.0 |
| [typescript](https://github.com/microsoft/TypeScript) | ~6.0.2 | Apache-2.0 |
| [oxlint](https://github.com/oxc-project/oxc) | ^1.79.0 | MIT |
| [@types/react](https://github.com/DefinitelyTyped/DefinitelyTyped) | ^19.2.18 | MIT |
| [@types/react-dom](https://github.com/DefinitelyTyped/DefinitelyTyped) | ^19.2.4 | MIT |
| [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped) | ^24.13.3 | MIT |

## Fonts

| Asset | Source | License |
| --- | --- | --- |
| Inter | [Google Fonts](https://fonts.google.com/specimen/Inter) | SIL Open Font License 1.1 |

## Notes

- All dependencies above are used as-is via npm/CDN, unmodified.
- Every listed license (MIT, Apache-2.0, SIL OFL 1.1) permits the use made of it here — production use in a hackathon submission, no attribution requirements beyond what's listed in this file.
- `wrangler` appears in both `backend/` and `frontend/` as separate installs at slightly different pinned versions; both are dual MIT/Apache-2.0 licensed by Cloudflare.
- This list was compiled from each package's own declared `license` field at the versions actually installed (`npm ls`), not just the `package.json` version ranges.
