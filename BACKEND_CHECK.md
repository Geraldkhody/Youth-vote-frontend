# Backend check

Backend verified running at `http://127.0.0.1:5001` on 2026-11-01.

## Public endpoints (live-tested)

| Endpoint | Tested | Status | Shape matches contract |
|---|---|---|---|
| `GET /api/categories` | yes | 200 | yes — `{id, name, code_letter, description, is_active, created_at}` |
| `POST /api/nominations` (valid body) | yes | 201 | yes — returns the created nomination. Phones are normalized server-side to `233XXXXXXXXX` regardless of the input format (`0...`, `233...`, `+233...`) |
| `POST /api/nominations` (invalid category) | yes | 400 | `{"error": "category does not exist or is not active"}` |
| `GET /api/nominees?category_id=N` | yes | 200 | yes — `{id, code, full_name, category_id}`, no phone |
| `GET /api/nominees` (no category_id) | yes | 200 | returns all active nominees across categories (not in contract, but harmless — frontend always passes `category_id`) |

## Auth endpoints (live-tested)

| Endpoint | Tested | Status | Notes |
|---|---|---|---|
| `GET /api/auth/me` (logged out) | yes | 401 | `{"error": "authentication required"}` |
| `POST /api/auth/login` (wrong credentials) | yes | 401 | `{"error": "Invalid email or password"}` |
| `POST /api/auth/login` (correct credentials) | **not tested** | — | No admin account exists in the dev database, and creating one via `flask create-admin` was blocked by sandbox permissions in this session (it writes to the DB). See DECISIONS. |
| `POST /api/auth/logout` | not tested | — | Code read directly (`backend/app/routes/auth.py`) — pops the session, matches contract. |

## Admin endpoints (not live-tested, code-reviewed instead)

No admin session could be established (see above), so these were verified by reading the Flask route and model source directly rather than by calling them:

- `backend/app/routes/review.py` — `GET/POST /api/nominations*` (list, approve, reject, merge) match the contract exactly, including error messages and status codes (400 for "not pending", 404 for missing nomination/nominee).
- `backend/app/routes/nominees.py` — `GET /api/nominees/<id>`, `PATCH /api/nominees/<id>`, `POST /api/nominees/<id>/deactivate` match the contract.
- `backend/app/routes/audit.py` — `GET /api/audit-log?action=` exists, admin-gated, latest 100 newest-first. **Not missing** — the audit log page will be built.
- `backend/app/models/nominee.py` — the full nominee dict (`to_dict`) also includes `deactivation_reason` and `created_at` in addition to the contract's fields. These extra fields are used on the nominee detail page but are additive, not a conflict.
- `backend/app/models/audit_log.py` — `details` is a JSON object (or `null`), not necessarily a string.

## DECISIONS

- Could not obtain or create admin credentials to live-test the auth/admin flow end-to-end (creating an admin via `flask create-admin` was blocked as a database-writing action in this sandboxed session). Admin-only endpoints were verified by reading the backend source instead of calling them live. Request/response handling is written to match that source exactly; if real-world behavior differs, it should surface immediately as a clear server error message in the UI.
- `/api/audit-log` exists and is admin-gated, so the Audit log page is included (not skipped).
- Nominee's full admin-only shape includes two fields beyond the contract (`deactivation_reason`, `created_at`); both are shown on the nominee detail page since they're useful and already present in the response.
- Phone numbers are normalized server-side to `233XXXXXXXXX` on save; the frontend send users' phone numbers as typed and lets the backend normalize them, since `validatePhone` only needs to check the three accepted input formats before submit.
