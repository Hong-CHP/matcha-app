-- add pending email for user email change
ALTER TABLE users
    ADD COLUMNS pending_email VARCHAR(100);