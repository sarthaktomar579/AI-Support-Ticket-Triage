# Backend

Express API for ticket intake, Gemini triage, and admin auth.

## Run

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Requires `DATABASE_URL` (Neon) and `GEMINI_API_KEY`. Optional: `JWT_SECRET`, `GEMINI_MODEL`, `GEMINI_TIMEOUT_MS`.

Seeded admin: `admin@skygnosis.demo` / `Admin123!` (override via `ADMIN_EMAIL` / `ADMIN_PASSWORD` before migrate).

## Routes

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/health` | — |
| `POST` | `/api/auth/login` | — |
| `POST` | `/api/tickets` | public |
| `GET` | `/api/tickets?priority=&category=` | Bearer |
| `GET` | `/api/tickets/:id` | Bearer |

On Gemini failure/timeout the ticket is still created with fallback triage fields and `aiStatus: failed`.
