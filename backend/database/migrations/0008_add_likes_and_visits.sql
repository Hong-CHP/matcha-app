CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    from_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT likes_from_to_unique UNIQUE (from_user_id, to_user_id),
    CONSTRAINT likes_no_self CHECK (from_user_id <> to_user_id),
    CONSTRAINT likes_status_check CHECK (status IN ('active', 'inactive'))
);

CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    viewer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visited_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT visits_viewer_target_unique UNIQUE (viewer_id, target_id),
    CONSTRAINT visits_no_self CHECK (viewer_id <> target_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_to_user_active
    ON likes (to_user_id)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_likes_from_user_active
    ON likes (from_user_id)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_visits_target
    ON visits (target_id, visited_at DESC);
