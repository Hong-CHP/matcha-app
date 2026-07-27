-- location label/consent for matching; fame bounds

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS location_label TEXT,
    ADD COLUMN IF NOT EXISTS location_consent BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE users
    ADD CONSTRAINT users_fame_rating_range
    CHECK (fame_rating IS NULL OR (fame_rating >= 0 AND fame_rating <= 100));
