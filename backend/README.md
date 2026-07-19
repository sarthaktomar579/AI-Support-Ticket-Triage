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

AI triage fields are filled by Gemini on create. If the model errors or times out, the ticket is still saved with safe defaults (`Medium` / `Other` / generic reply) and `aiStatus: "failed"`.

List endpoints will be admin-protected in Step 5.

### Gemini setup

1. Create a free API key at [Google AI Studio](https://aistudio.google.com/apikey)
2. Set `GEMINI_API_KEY` in `.env`
3. Optional: `GEMINI_MODEL` (default `gemini-2.0-flash`), `GEMINI_TIMEOUT_MS` (default `15000`)

### Neon setup

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string into `DATABASE_URL` in `.env`
3. Run `npm run db:migrate` to create `admins` + `tickets` tables and seed the admin user

Default admin (override via env): `admin@skygnosis.demo` / `Admin123!`
