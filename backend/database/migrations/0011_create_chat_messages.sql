CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    from_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chat_messages_no_self CHECK (from_user_id <> to_user_id),
    CONSTRAINT chat_messages_body_nonempty CHECK (char_length(body) > 0)
);

CREATE INDEX idx_chat_messages_pair_created
  ON chat_messages (
    LEAST(from_user_id, to_user_id),
    GREATEST(from_user_id, to_user_id),
    created_at
  );
