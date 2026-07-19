# Backend — AI Support Ticket Triage

Express REST API with PostgreSQL and Gemini triage.

## Run

```bash
cp .env.example .env
# Set DATABASE_URL and GEMINI_API_KEY
npm install
npm run dev
```

API listens on [http://localhost:4000](http://localhost:4000).

Health check: `GET /api/health`
