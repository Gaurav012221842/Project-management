-- Align DB schema with BaseEntity (created_by/updated_by VARCHAR(255)).
-- BaseEntity maps every entity to columns: created_at, updated_at, created_by, updated_by.
-- Earlier migrations only added created_at/updated_at, and V3.projects.created_by was UUID
-- (conflicts with BaseEntity String type). This migration fixes all of that.

-- Drop the misnamed/mistyped FK column on projects (entity uses owner_id; created_by must be VARCHAR).
ALTER TABLE projects DROP COLUMN IF EXISTS created_by;

-- Add audit columns to every table whose entity extends BaseEntity.
ALTER TABLE users              ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE workspaces         ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE workspace_members  ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE projects           ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE project_members    ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE sprints            ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE tasks              ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE sub_tasks          ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE comments           ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE attachments        ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE task_labels        ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE notifications      ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE messages           ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE activity_logs      ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
                               ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
