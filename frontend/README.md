# Frontend

Next.js client for ticket submission and the admin dashboard.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`). Backend must be running.

| Path | Purpose |
|------|---------|
| `/` | Public ticket form + confirmation |
| `/admin` | Login + filtered ticket list |

Admin: `admin@skygnosis.demo` / `Admin123!`
