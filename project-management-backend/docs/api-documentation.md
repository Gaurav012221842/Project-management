# API Documentation

## Base URL
`http://localhost:9989/api/v1`

## Authentication
All endpoints (except `/auth/*`) require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <jwt-token>
```

---

## Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

---

## User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me` | Update current user profile |
| GET | `/users/{id}` | Get user by ID |

---

## Workspace Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/workspaces` | Create workspace |
| GET | `/workspaces` | List user workspaces |
| GET | `/workspaces/{id}` | Get workspace |
| PUT | `/workspaces/{id}` | Update workspace |
| DELETE | `/workspaces/{id}` | Delete workspace |
| POST | `/workspaces/{id}/members` | Add member |
| DELETE | `/workspaces/{id}/members/{userId}` | Remove member |

---

## Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/workspaces/{workspaceId}/projects` | Create project |
| GET | `/workspaces/{workspaceId}/projects` | List projects |
| GET | `/projects/{id}` | Get project |
| PUT | `/projects/{id}` | Update project |
| DELETE | `/projects/{id}` | Delete project |
| GET | `/projects/{id}/stats` | Get project stats |

---

## Sprint Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects/{projectId}/sprints` | Create sprint |
| GET | `/projects/{projectId}/sprints` | List sprints |
| GET | `/sprints/{id}` | Get sprint |
| PUT | `/sprints/{id}` | Update sprint |
| DELETE | `/sprints/{id}` | Delete sprint |
| GET | `/sprints/{id}/burndown` | Get burndown chart data |

---

## Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects/{projectId}/tasks` | Create task |
| GET | `/projects/{projectId}/tasks` | List tasks |
| GET | `/tasks/{id}` | Get task |
| PUT | `/tasks/{id}` | Update task |
| PATCH | `/tasks/{id}/status` | Update task status |
| PATCH | `/tasks/{id}/assign` | Assign task |
| DELETE | `/tasks/{id}` | Delete task |

---

## Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/overview` | Overview analytics |
| GET | `/analytics/team-performance` | Team performance metrics |

---

## WebSocket Endpoints

| Endpoint | Description |
|----------|-------------|
| `/ws` | WebSocket connection endpoint |
| `/topic/notifications/{userId}` | Subscribe to user notifications |
| `/topic/chat/{workspaceId}` | Subscribe to workspace chat |
| `/app/chat/send` | Send a chat message |
