# AI Support Ticket Triage

Skygnosis full-stack take-home: users submit support tickets, Gemini triages them (priority, category, suggested reply), and admins review them on a protected dashboard.

## Structure

```
frontend/   Next.js (React) — user form + admin dashboard
backend/    Express REST API — auth, tickets, Gemini triage, PostgreSQL
```

## Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js + TypeScript + Tailwind |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| AI | Google Gemini |
| Auth | JWT (admin login) |

## Quick start

Detailed run instructions will be finalized in a later step. For now:

### Backend

```bash
cd backend
cp .env.example .env   # fill in Neon DATABASE_URL and GEMINI_API_KEY
npm install
npm run db:migrate
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

API: `http://localhost:4000` · App: `http://localhost:3000`

## Assignment notes

Trade-offs, assumptions, and “what I’d improve with more time” will be documented here before submission.
