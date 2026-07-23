# API contracts — auth session

## GET /auth/me

Requires: `Authorization: Bearer <access_token>`

Response fields:

- `id` — auth owns
- `username` — auth owns
- `email` — auth owns
- `first_name`, `last_name` — auth owns
- `email_verified` — auth owns
- `profile_completed` — read by auth; set by profiles module when ready
- `has_password` — auth owns (false for OAuth-only users)

Errors: `{ detail, code, field }` with codes `MISSING_TOKEN`, `INVALID_TOKEN`, `EXPIRED_TOKEN`

Token TTL: 1 day

# API contracts — users self profile (WP0/WP1)

## GET /users/me

Requires: `Authorization: Bearer <access_token>`

Response fields (self profile — users owns):

- existing: `id`, `email`, `username`, `first_name`, `last_name`, `is_verified`, `created_at`
- existing profile: `gender`, `sexual_preference`, `age`, `bio`, `is_profile_completed`
- `fame_rating` — int 0–100, cached, default 0
- `latitude`, `longitude` — nullable until location set
- `location_label` — optional free-text display / manual label
- `location_consent` — bool, whether user accepted location sharing
- `last_connection` — nullable timestamp (presence semantics later)

Do **not** treat this payload as `/auth/me`.

## PATCH /users/me/location

Requires auth.

Input (JSON):

- `latitude` — required float
- `longitude` — required float
- `location_label` — optional string
- `location_consent` — required bool

Rules:

- Client always sends coordinates (GPS or FE city/map picker approx).
- Server does not reverse-geocode.
- `location_consent=true` expected when storing location for matching use.
- Response: same shape as `GET /users/me`.

Errors (users domain):

- `INVALID_LOCATION` — missing/invalid coords or consent rules violated

## PATCH /users/me/account

Requires auth.

Input (JSON):

- `first_name` — required string
- `last_name` — required string
- `email` — required email

Response: same shape as `GET /users/me`.

Errors:

- `EMAIL_TAKEN` — email already registered (same code as auth register)
- `USER_NOT_FOUND`

# API contracts — public profile (document now; read endpoint later)

## Public profile (future GET /users/{id} or equivalent)

Include: username, names (as agreed), gender, preference, age, bio, tags, photos,
`fame_rating`, `location_label` / approx location, later online/last seen and
liked-you/connected/blocked flags.

Exclude: email, password, tokens.

# API contracts — discovery suggest / search (WP4)

## Shared behavior

Requires auth. Presence: authenticated discovery requests touch `users.last_connection` via the shared dependency (same as users/social).

### Candidate pool (both endpoints)

Exclude:

- self
- users who are not profile-completed (twin of `UsersService.get_profile`): `bio`, `age`, `gender`, `sexual_preference` all set **and** at least one `user_tags` row **and** at least one `user_photos` row
- either-direction **active** block with the viewer (same semantics as social `is_blocked_either_way`)

### Mutual orientation (both, always on)

Viewer interested in candidate gender **and** candidate interested in viewer gender.

- Preference → genders: `man` → `{male}`, `woman` → `{female}`, `bisexual` → `{male, female}`
- Gender `other` matches only when the other party’s preference is `bisexual`

### Distance

Haversine km (earth radius 6371). `distance_km` is `null` if **either** viewer or candidate lacks coordinates. Values rounded to 1 decimal.

### Pagination / response shape

- `limit` — default 20, max 100
- `offset` — default 0
- Response: **bare array** of `DiscoveryProfileCard` (no total count)

### Sort

`sort`: `age` | `distance` | `fame` | `common_tags`  
`order`: `asc` | `desc`  
Defaults when `order` omitted: age asc, distance asc, fame desc, common_tags desc.  
Final tie-breaker always `id` ascending.

- Explicit `sort=distance` without viewer coordinates → `400` `LOCATION_REQUIRED`
- Suggest **or search default** (no `sort`) without viewer coordinates → silent fallback to fame → common_tags → id (not an error)

### DiscoveryProfileCard

```json
{
  "id": 2,
  "username": "alice",
  "first_name": "Alice",
  "last_name": "A",
  "age": 28,
  "gender": "female",
  "fame_rating": 12,
  "distance_km": 3.4,
  "common_tags_count": 2,
  "location_label": "Paris"
}
```

- `distance_km` — number or null
- `location_label` — string or null
- No email, photos array, or relationship flags on the card (use `GET /social/relationship/{id}`)

### Errors

| Code | HTTP | When |
|------|------|------|
| `LOCATION_REQUIRED` | 400 | `max_distance_km` set, or explicit `sort=distance`, without viewer coordinates |
| `INVALID_FILTER` | 400 | Bad age/fame ranges, unknown sort, invalid `tag_ids` |

Viewer missing `gender` or `sexual_preference` (**orientation-unusable**): return empty array `[]` (not 403). Distinct from candidate pool completion (which also requires tags + photos).

---

## GET /discovery/suggest

Query (`SuggestQueryParams` only — no age/fame/distance/tag filters):

- `limit`, `offset`, optional `sort`, optional `order`

Rules:

- candidate pool + mutual orientation
- no age/fame/tag filters
- default sort: distance → fame → common_tags → id; if viewer has no coords: fame → common_tags → id

Response: bare array of `DiscoveryProfileCard`

---

## GET /discovery/search

Query (`SearchQueryParams`):

- `limit`, `offset`, optional `sort`, optional `order`
- optional `age_min` / `age_max` (inclusive, candidate age)
- optional `fame_min` / `fame_max` (inclusive, 0–100)
- optional `max_distance_km` (> 0): viewer must have coordinates else `LOCATION_REQUIRED`; drop candidates with null distance and those beyond max
- optional `tag_ids` — **repeated** query params (`tag_ids=1&tag_ids=2`); AND semantics (candidate must have all); omit or empty = no tag filter

Invalid ranges (`age_min > age_max`, etc.) → `INVALID_FILTER`.

Response: bare array of `DiscoveryProfileCard`

# API contracts — social visits / likes / connected (WP2)

## POST /social/visits/{target_user_id}

Requires auth.

Rules:

- no self-visit (`CANNOT_VISIT_SELF`)
- upsert one row per (viewer, target); refresh `visited_at` on repeat
- fame on target: +1 **only on first insert** (repeat views do not bump), clamp 0–100

Response: `{ "ok": true }`

Errors: `USER_NOT_FOUND`, `CANNOT_VISIT_SELF`

## GET /social/visitors?limit=&offset=

Requires auth.

Response: bare array of `{ id, username, first_name, last_name, visited_at }` (no email, no total)
Defaults: `limit=20` (max 100), `offset=0`

## POST /social/likes/{target_user_id}

Requires auth.

Rules:

- no self-like (`CANNOT_LIKE_SELF`)
- actor must have an avatar (`user_photos.is_profile_photo = true`) (`PROFILE_PHOTO_REQUIRED`)
- soft status: insert `active`, or reactivate existing inactive row
- fame on target: +5 **only when the like row is newly inserted** (first like ever for the pair);
  soft re-activate after unlike does **not** bump fame again; clamp 0–100

Response: `{ "liked": true, "connected": <bool> }`

Errors: `USER_NOT_FOUND`, `CANNOT_LIKE_SELF`, `PROFILE_PHOTO_REQUIRED`

## DELETE /social/likes/{target_user_id}

Requires auth.

Rules:

- soft-unlike → status `inactive`
- idempotent if row missing or already inactive
- does **not** reverse fame in WP2 (likes fame is monotonic this slice)

Response: `{ "liked": false, "connected": <bool> }`

## GET /social/likes/received?limit=&offset=

Requires auth. Active likes toward current user only.

Response: bare array of `{ id, username, first_name, last_name, liked_at }`

- `liked_at` = `likes.updated_at`
- no email, no total

## GET /social/relationship/{target_user_id}

Requires auth. Target must exist (`USER_NOT_FOUND`). Self is allowed.

Response: `{ "liked_by_me": bool, "liked_you": bool, "connected": bool }`

`connected` = mutual active likes.

# API contracts — social blocks / reports / presence (WP3)

## POST /social/blocks/{target_user_id}

Requires auth.

Rules:

- soft-activate block (insert `active`, or reactivate inactive row)
- no self-block (`CANNOT_BLOCK_SELF`)

Response: `{ "blocked": true }`

Errors: `USER_NOT_FOUND`, `CANNOT_BLOCK_SELF`

## DELETE /social/blocks/{target_user_id}

Requires auth.

Rules:

- soft-unblock → status `inactive`
- idempotent if missing or already inactive

Response: `{ "blocked": false }`

## GET /social/blocks?limit=&offset=

Requires auth.

Response: bare array of `{ id, username, first_name, last_name, blocked_at }` (no email, no total)

- `blocked_at` = `blocks.updated_at`
- Defaults: `limit=20` (max 100), `offset=0`

## POST /social/reports/{target_user_id}

Requires auth.

Input (JSON):

- `reason` — optional string (max 500)

Rules:

- store-only upsert one row per (reporter, target); refresh reason/`updated_at` on repeat
- no fame penalty
- no self-report (`CANNOT_REPORT_SELF`)

Response: `{ "ok": true }`

Errors: `USER_NOT_FOUND`, `CANNOT_REPORT_SELF`

## Interaction + block

`POST /social/visits/{target_user_id}` and `POST /social/likes/{target_user_id}`:

- if either-direction active block → `403` with code `BLOCKED`

## GET /social/relationship/{target_user_id} (WP3 fields)

Also returns:

- `blocked_by_me` — bool
- `blocked_you` — bool
- `last_connection` — nullable datetime of target
- `is_online` — bool (`last_connection` within 900 seconds)

## Presence write

No public write endpoint. Authenticated users/social (and tags if wired) requests touch `users.last_connection` via a shared dependency.
