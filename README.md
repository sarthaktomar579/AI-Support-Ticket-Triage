# Aitri — AI Support Ticket Triage

**Aitri** is the product UI for this Skygnosis take-home: users submit support tickets; Gemini assigns priority, category, and a suggested reply. Admins review results on a JWT-protected dashboard. If the model is unavailable, customers still get a saved ticket with a mock reply and safe defaults.

```
frontend/   Next.js + TypeScript + Tailwind
backend/    Express REST API, PostgreSQL (Neon), Gemini
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env   # set DATABASE_URL and GEMINI_API_KEY
npm install
npm run db:migrate
npm run dev
```

`http://localhost:4000`

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

`http://localhost:3000` — customer intake at `/` (Aitri), operations console at `/admin`

### Local admin (seeded)

| Email | Password |
|-------|----------|
| `admin@skygnosis.demo` | `Admin123!` |

These are **demo seed credentials** for local review only (also listed in `.env.example`). They are not production secrets. Change them before any real deploy. Never commit a real `.env`.

## Stack choices

- **Next.js** — typed UI, fast iteration on form + dashboard
- **Express** — explicit REST surface and status codes
- **Neon Postgres** — hosted DB without local install
- **Gemini** — free-tier triage with JSON output
- **JWT + bcrypt** — minimal admin gate

## Trade-off

Shipped the full submit → triage → admin filter path without automated tests or hosting. Prefer a reliable local demo over unfinished extras.

## Later

Auth cookies instead of localStorage, tests, pagination/search, AI retry queue, and a deployed environment.

## API

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/api/auth/login` | — |
| `POST` | `/api/tickets` | public |
| `GET` | `/api/tickets` | Bearer |
| `GET` | `/api/tickets/:id` | Bearer |

If Gemini fails or times out, the ticket is still stored with defaults (`Medium` / `Other`) and `aiStatus: failed`.
