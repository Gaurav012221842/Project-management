-- V9: Align DB schema with all JPA entities.
-- Safe to run because dev DB has no business data yet.
-- Each statement uses IF EXISTS / IF NOT EXISTS so it's idempotent.

-- =========================================================================
-- users: entity expects name, profile_pic, refresh_token; drops username, full_name, avatar_url
-- =========================================================================
ALTER TABLE users DROP COLUMN IF EXISTS username CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS full_name;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name          VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_pic   VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token VARCHAR(255);
ALTER TABLE users ALTER COLUMN name DROP DEFAULT;

-- =========================================================================
-- projects: entity expects owner_id (NOT NULL); drops slug
-- (created_by was already dropped in V7)
-- =========================================================================
ALTER TABLE projects DROP COLUMN IF EXISTS slug CASCADE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE CASCADE;
-- can't enforce NOT NULL while existing rows have NULL, but dev table is empty:
UPDATE projects SET owner_id = (SELECT id FROM users LIMIT 1) WHERE owner_id IS NULL;
ALTER TABLE projects ALTER COLUMN owner_id SET NOT NULL;

-- =========================================================================
-- sprints: entity expects start_date / end_date NOT NULL
-- =========================================================================
UPDATE sprints SET start_date = CURRENT_DATE WHERE start_date IS NULL;
UPDATE sprints SET end_date   = CURRENT_DATE WHERE end_date   IS NULL;
ALTER TABLE sprints ALTER COLUMN start_date SET NOT NULL;
ALTER TABLE sprints ALTER COLUMN end_date   SET NOT NULL;

-- =========================================================================
-- tasks: rename `type` -> `task_type`, `assignee_id` -> `assigned_to`; add `position`
-- =========================================================================
ALTER TABLE tasks RENAME COLUMN type        TO task_type;
ALTER TABLE tasks RENAME COLUMN assignee_id TO assigned_to;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- =========================================================================
-- sub_tasks: entity expects is_completed; drops status, assignee_id
-- =========================================================================
ALTER TABLE sub_tasks DROP COLUMN IF EXISTS status;
ALTER TABLE sub_tasks DROP COLUMN IF EXISTS assignee_id;
ALTER TABLE sub_tasks ADD COLUMN IF NOT EXISTS is_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- =========================================================================
-- comments: rename author_id -> user_id; add parent_id self FK
-- =========================================================================
ALTER TABLE comments RENAME COLUMN author_id TO user_id;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- =========================================================================
-- attachments: rename content_type -> file_type
-- =========================================================================
ALTER TABLE attachments RENAME COLUMN content_type TO file_type;

-- =========================================================================
-- notifications: reference_id UUID -> VARCHAR, add reference_type
-- =========================================================================
ALTER TABLE notifications ALTER COLUMN reference_id TYPE VARCHAR(255) USING reference_id::text;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_type VARCHAR(255);
