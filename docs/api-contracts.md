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

# API contracts — discovery lists (document now; WP4 implements)

## Suggest / search pagination

- `limit` — page size
- `offset` — zero-based offset

Sort keys (later): `age`, `distance`, `fame`, `common_tags`
Filter keys (later): age range, fame range, distance/location, tags

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
