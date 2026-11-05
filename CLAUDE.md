# CLAUDE.md — Frontend (Youth Awards Nomination & Voting)

## Shared rules (keep identical in both files)

### What the system does
A parish youth awards system. Public users nominate people for award categories through a web form (free). Anyone votes for approved nominees through a USSD menu and pays by Mobile Money (paid). Admins review nominations, manage nominees and categories, and see an audit log. There is also a public rankings page (no vote counts).

### Business rules
- Nominations are free. Voting is paid.
- Vote fee is one amount set by the admin, default GH₵1.00, stored in pesewas (100).
- Money is always stored as integer pesewas. Never floats.
- Nominee codes are a category letter plus two random digits from 10 to 99 (e.g. B47). Unique within a category. Never sequential.
- Phone numbers are accepted as 0XXXXXXXXX, 233XXXXXXXXX or +233XXXXXXXXX and stored as 233XXXXXXXXX.
- Nominations start as pending. Only pending nominations can be approved, rejected or merged.
- Deactivate, never delete. Nominees, categories and admins are deactivated.
- Testing: all manual testing uses port 5001. Show real terminal output and real responses, never a summary.

## Frontend rules

- Vite, React, TypeScript (react-ts template), react-router-dom, vitest with @testing-library/react.
- Experienced-level React: function components, hooks, typed API responses, small custom hooks where they help.
- No Redux. No UI component libraries. No CSS frameworks.
- Every component and page lives in its own folder named after it, containing its `.tsx` file, its `.module.css` file if it has component-specific styles, and its `.test.tsx` file if it has tests (e.g. `src/pages/NomineesPage/NomineesPage.tsx` + `NomineesPage.module.css`). Import CSS Modules as `styles` and reference classes via `styles.foo`.
- Styles genuinely shared across multiple components (buttons, form fields, cards, tables, status messages, page layout) stay as plain global classes in `src/index.css`. Only give a component its own `.module.css` for styles unique to that component. A component with no component-specific styles has no CSS file.
- To style a global class nested inside a CSS Module selector (e.g. a shared `.btn` inside `.detail`), wrap it in `:global(...)` so CSS Modules doesn't hash it.
- Mobile first. Inputs and buttons at least 44px tall. Admin tables scroll horizontally on small screens.
- All API calls go through `src/api/client.ts`, using `credentials: "include"`. No `fetch` calls in components.
- Errors from the server are shown as returned in the `error` field of the response body.
- A 401 on an admin call sends the user to `/admin/login`.
- Admin pages sit behind `RequireAdmin`.
- Dev server proxies `/api` to `http://127.0.0.1:5001`, so no CORS changes are needed.
- The backend is the source of truth. Do not change the backend from the frontend session. If an endpoint is missing or differs from the contract, record it and build to the real shape.
- Tests run from inside `frontend/`: `npm test` (which runs `vitest run`).

## Commands

- Install: `npm install` (from `frontend/`)
- Dev server: `npm run dev`
- Test: `npm test`
- Build: `npm run build`
