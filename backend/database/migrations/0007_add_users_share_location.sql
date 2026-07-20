-- add profile related location's fields required for the "my profile" flow

ALTER TABLE users
    ADD COLUMN location_text VARCHAR(225);