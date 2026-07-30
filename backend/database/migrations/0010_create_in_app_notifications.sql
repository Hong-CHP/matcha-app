CREATE TABLE IF NOT EXISTS in_app_notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    actor_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_id INT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT in_app_notifications_type_check
      CHECK (type IN ('liked', 'visited', 'matched', 'unliked', 'message'))
);

CREATE INDEX idx_in_app_notifications_user_created
  ON in_app_notifications (user_id, created_at DESC);

CREATE INDEX idx_in_app_notifications_user_unread
  ON in_app_notifications (user_id) WHERE read_at IS NULL;
