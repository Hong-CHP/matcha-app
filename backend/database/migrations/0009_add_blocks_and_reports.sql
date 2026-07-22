CREATE TABLE IF NOT EXISTS blocks (
    id SERIAL PRIMARY KEY,
    from_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT blocks_from_to_unique UNIQUE (from_user_id, to_user_id),
    CONSTRAINT blocks_no_self CHECK (from_user_id <> to_user_id),
    CONSTRAINT blocks_status_check CHECK (status IN ('active', 'inactive'))
);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT reports_reporter_target_unique UNIQUE (reporter_id, target_id),
    CONSTRAINT reports_no_self CHECK (reporter_id <> target_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_from_active
    ON blocks (from_user_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_blocks_to_active
    ON blocks (to_user_id) WHERE status = 'active';
