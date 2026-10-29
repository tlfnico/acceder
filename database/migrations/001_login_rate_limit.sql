-- Aplicar una sola vez a las bases existentes antes del despliegue.
CREATE TABLE IF NOT EXISTS login_rate_limit (
    identifier_hash CHAR(64) PRIMARY KEY,
    attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    window_started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    locked_until TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_login_rate_limit_locked_until
    ON login_rate_limit (locked_until)
    WHERE locked_until IS NOT NULL;
