# Sprint plan — realtime backend (bde) ∥ discovery/social UI (Hong)

Single source for who-owns-what and merge order. The per-dev tickets link here; if a
rule below changes, change it **here**, not in the tickets.

**Tickets:** [bde](bde-public-profile-and-realtime-foundation.md) ·
[Hong](hong-discovery-social-ui.md)
**Decisions:** [ADR-0001](../ADR/0001-public-profile-is-a-projection-in-the-users-module.md) ·
[ADR-0002](../ADR/0002-chat-and-in-app-notifications-are-separate-modules-fed.md) ·
[ADR-0003](../ADR/0003-realtime-delivery-uses-a-fastapi-websocket-hub.md)

## Ownership

| Area | bde (Bernardo) | Hong |
|---|---|---|
| `backend/modules/users` | public `GET /users/{id}` only | — |
| `backend/modules/chat`, in-app `notifications`, WS hub | all | — |
| `backend/modules/social/service.py` | emit hooks only (see below) | — |
| `backend/database/seed.py` | `--users 500` | consumes for demos |
| `frontend/src/pages/**`, `layouts/RootLayout.tsx` (nav), routes | — | all |
| `frontend/src/api/` + hooks (discovery, social, public profile) | — | all |

## Dependencies and merge order

```
bde Task 1 (GET /users/{id})  ──unblocks──▶  Hong Task 4 (public profile page)

Everything else is parallel:
  Hong Tasks 1–3 (nav, suggest/search, visitors/likes)  → need nothing new
  bde Tasks 2–5 (seed, notifications, chat, WS)        → block no Hong work this sprint
```

1. bde merges Task 1 **early** — it is the only cross-dev dependency.
2. Hong merges Tasks 1–3 whenever ready, before or after that.
3. After bde Task 1 lands: Hong regenerates `frontend/src/types/api.d.ts`, then builds Task 4.
4. bde Tasks 3–5 merge independently; Hong does **not** wait on them.

## Shared touchpoints (the only overlap)

- **`social/service.py` emit hooks** — bde edits one agreed call site (ADR-0002).
  Hong does not touch this file. Any other change there: ping each other first.
- **OpenAPI types** — bde announces when `PublicProfile` is on `main`; Hong owns the
  regen of `api.d.ts`. Confirm the regen script/command once and note it here.

## Hard rules (both devs)

- No email/password/tokens on any public payload or view.
- No renaming `location_label`; no reopening auth; migration numbers `0010+` are bde's.
- No changes to fame/discovery ranking formulas this sprint.

## Next sprint (not now)

Hong builds notification center + chat UI on bde's APIs and WS envelope (ADR-0003).
