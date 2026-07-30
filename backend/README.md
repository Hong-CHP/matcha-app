# Backend

## Seed demo data

For discovery/search demos you need enough profiles (≥500 for subject eval).

1. Start a migrated Postgres (e.g. `docker compose up` from the repo root so
   `backend/database/migrations/*` init scripts apply).
2. From `backend/` with the venv active and `DATABASE_URL` set:

```bash
python -m database.seed --users 500
```

Default `--users` is already `500`. Every seeded user shares password
`Password123!` (printed again when the script finishes). Prefer a fresh
database; re-running against a populated DB may fail unique email/username
constraints.
