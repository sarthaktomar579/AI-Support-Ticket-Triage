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

### Ticket API (Step 3)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/tickets` | Create a ticket (`name`, `email`, `message`) |
| `GET` | `/api/tickets` | List tickets (newest first). Optional query: `priority`, `category` |
| `GET` | `/api/tickets/:id` | Get one ticket |

Example:

```bash
curl -X POST http://localhost:4000/api/tickets -H "Content-Type: application/json" -d "{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"message\":\"Billing charge looks wrong\"}"
curl "http://localhost:4000/api/tickets"
curl "http://localhost:4000/api/tickets?priority=High&category=Billing"
```

AI triage fields are stored as `pending` until Step 4. List endpoints will be admin-protected in Step 5.

### Neon setup

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string into `DATABASE_URL` in `.env`
3. Run `npm run db:migrate` to create `admins` + `tickets` tables and seed the admin user

Default admin (override via env): `admin@skygnosis.demo` / `Admin123!`
