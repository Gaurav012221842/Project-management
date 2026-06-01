# Database Schema

## Tables Overview

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| full_name | VARCHAR(100) | NOT NULL |
| avatar_url | VARCHAR(500) | |
| is_active | BOOLEAN | DEFAULT TRUE |
| is_email_verified | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### workspaces
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| description | TEXT | |
| logo_url | VARCHAR(500) | |
| owner_id | UUID | FK -> users.id |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### workspace_members
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| workspace_id | UUID | FK -> workspaces.id |
| user_id | UUID | FK -> users.id |
| role | VARCHAR(20) | NOT NULL (OWNER/ADMIN/MEMBER/VIEWER) |
| joined_at | TIMESTAMP | NOT NULL |

### projects
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| workspace_id | UUID | FK -> workspaces.id |
| name | VARCHAR(100) | NOT NULL |
| slug | VARCHAR(100) | NOT NULL |
| description | TEXT | |
| status | VARCHAR(20) | NOT NULL |
| start_date | DATE | |
| end_date | DATE | |
| created_by | UUID | FK -> users.id |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### sprints
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| project_id | UUID | FK -> projects.id |
| name | VARCHAR(100) | NOT NULL |
| goal | TEXT | |
| status | VARCHAR(20) | NOT NULL |
| start_date | DATE | |
| end_date | DATE | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### tasks
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| project_id | UUID | FK -> projects.id |
| sprint_id | UUID | FK -> sprints.id, NULLABLE |
| parent_task_id | UUID | FK -> tasks.id, NULLABLE |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| status | VARCHAR(20) | NOT NULL |
| priority | VARCHAR(20) | NOT NULL |
| type | VARCHAR(20) | NOT NULL |
| assignee_id | UUID | FK -> users.id, NULLABLE |
| reporter_id | UUID | FK -> users.id |
| story_points | INTEGER | |
| due_date | DATE | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### comments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| task_id | UUID | FK -> tasks.id |
| author_id | UUID | FK -> users.id |
| content | TEXT | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### notifications
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK -> users.id |
| type | VARCHAR(50) | NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| message | TEXT | |
| is_read | BOOLEAN | DEFAULT FALSE |
| reference_id | UUID | |
| created_at | TIMESTAMP | NOT NULL |
