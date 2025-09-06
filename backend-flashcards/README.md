## Environment Variables

Create a local config from the template .env.example:

- macOS/Linux/Git Bash: `cp .env.example .env`
- Windows PowerShell: `Copy-Item .env.example .env`

Then edit `.env` with the values for your machine.

| Variable      | Example                 | Description                                      |
| ------------- | ----------------------- | ------------------------------------------------ |
| `PORT`        | `3001`                  | API server port.                                 |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated list of allowed browser origins. |
| `PGHOST`      | `localhost`             | PostgreSQL host.                                 |
| `PGUSER`      | `postgres`              | PostgreSQL user.                                 |
| `PGPASSWORD`  | `secret123`             | PostgreSQL password.                             |
| `PGDATABASE`  | `flashcards`            | Database name.                                   |
| `PGPORT`      | `5432`                  | PostgreSQL port.                                 |

### Quick setup checklist

1. Copy template `.env.example` → `.env`
2. Fill Postgres creds and `CORS_ORIGIN`
3. Start the API: `npm run dev`
4. Health check:
   - In a different terminal run: `curl.exe -i http://localhost:%PORT%/health` (replace `%PORT%` with your value)
   - **Expected output**: `{"ok":true,"time": "YYYY-MM-DDTHH:mm:ss.sssZ"}` ← ISO-8601 (UTC), varies per request.
