# Backend — AI Support Ticket Triage

Express REST API with PostgreSQL and Gemini triage.

## Run

```bash
cp .env.example .env
# Set DATABASE_URL (Neon) and GEMINI_API_KEY
npm install
npm run db:migrate
npm run dev
```

API listens on [http://localhost:4000](http://localhost:4000).

Health check: `GET /api/health`

### Neon setup

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string into `DATABASE_URL` in `.env`
3. Run `npm run db:migrate` to create `admins` + `tickets` tables and seed the admin user

Default admin (override via env): `admin@skygnosis.demo` / `Admin123!`
