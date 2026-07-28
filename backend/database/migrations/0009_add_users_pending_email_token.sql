-- add pending email token for user email change
ALTER TABLE users
    ADD COLUMN pending_email_token VARCHAR(255);