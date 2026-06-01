-- Recreate activity_logs to match the ActivityLog entity.
-- Old schema (V6) had: user_id (nullable), action, entity_type, entity_id UUID, details, workspace_id.
-- Entity expects: project_id (NOT NULL FK), user_id (NOT NULL FK), action, entity_type (NOT NULL),
--                 entity_id VARCHAR (NOT NULL), old_value TEXT, new_value TEXT + audit columns.

DROP TABLE IF EXISTS activity_logs;

CREATE TABLE activity_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    action      VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    entity_id   VARCHAR(255) NOT NULL,
    old_value   TEXT,
    new_value   TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255)
);

CREATE INDEX idx_activity_logs_project_id ON activity_logs(project_id);
CREATE INDEX idx_activity_logs_user_id    ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity     ON activity_logs(entity_type, entity_id);
