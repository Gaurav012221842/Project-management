// src/constants/apiEndpoints.js
const BASE = ''

export const AUTH_ENDPOINTS = {
  LOGIN:           `${BASE}/api/auth/login`,
  REGISTER:        `${BASE}/api/auth/register`,
  LOGOUT:          `${BASE}/api/auth/logout`,
  REFRESH:         `${BASE}/api/auth/refresh`,
  FORGOT_PASSWORD: `${BASE}/api/auth/forgot-password`,
  RESET_PASSWORD:  `${BASE}/api/auth/reset-password`,
  ME:              `${BASE}/api/auth/me`,
}

export const WORKSPACE_ENDPOINTS = {
  LIST:      `${BASE}/api/workspaces`,
  CREATE:    `${BASE}/api/workspaces`,
  GET:    (id) => `${BASE}/api/workspaces/${id}`,
  UPDATE: (id) => `${BASE}/api/workspaces/${id}`,
  DELETE: (id) => `${BASE}/api/workspaces/${id}`,
  MEMBERS:(id) => `${BASE}/api/workspaces/${id}/members`,
  INVITE: (id) => `${BASE}/api/workspaces/${id}/invite`,
}

export const PROJECT_ENDPOINTS = {
  LIST:      `${BASE}/api/projects`,
  CREATE:    `${BASE}/api/projects`,
  GET:    (id) => `${BASE}/api/projects/${id}`,
  UPDATE: (id) => `${BASE}/api/projects/${id}`,
  DELETE: (id) => `${BASE}/api/projects/${id}`,
  MEMBERS:(id) => `${BASE}/api/projects/${id}/members`,
}

export const SPRINT_ENDPOINTS = {
  LIST:      (projectId) => `${BASE}/api/projects/${projectId}/sprints`,
  CREATE:    (projectId) => `${BASE}/api/projects/${projectId}/sprints`,
  GET:    (id) => `${BASE}/api/sprints/${id}`,
  UPDATE: (id) => `${BASE}/api/sprints/${id}`,
  DELETE: (id) => `${BASE}/api/sprints/${id}`,
  START:  (id) => `${BASE}/api/sprints/${id}/start`,
  COMPLETE:(id)=> `${BASE}/api/sprints/${id}/complete`,
}

export const TASK_ENDPOINTS = {
  LIST:      (projectId) => `${BASE}/api/projects/${projectId}/tasks`,
  CREATE:    (projectId) => `${BASE}/api/projects/${projectId}/tasks`,
  GET:    (id) => `${BASE}/api/tasks/${id}`,
  UPDATE: (id) => `${BASE}/api/tasks/${id}`,
  DELETE: (id) => `${BASE}/api/tasks/${id}`,
  ASSIGN: (id) => `${BASE}/api/tasks/${id}/assign`,
  STATUS: (id) => `${BASE}/api/tasks/${id}/status`,
}

export const COMMENT_ENDPOINTS = {
  LIST:   (taskId) => `${BASE}/api/tasks/${taskId}/comments`,
  CREATE: (taskId) => `${BASE}/api/tasks/${taskId}/comments`,
  UPDATE: (id)     => `${BASE}/api/comments/${id}`,
  DELETE: (id)     => `${BASE}/api/comments/${id}`,
}

export const NOTIFICATION_ENDPOINTS = {
  LIST:       `${BASE}/api/notifications`,
  MARK_READ:  (id) => `${BASE}/api/notifications/${id}/read`,
  MARK_ALL:   `${BASE}/api/notifications/read-all`,
  DELETE:     (id) => `${BASE}/api/notifications/${id}`,
}

export const USER_ENDPOINTS = {
  PROFILE:        `${BASE}/api/users/me`,
  UPDATE_PROFILE: `${BASE}/api/users/me`,
  UPLOAD_AVATAR:  `${BASE}/api/users/me/avatar`,
  CHANGE_PASSWORD:`${BASE}/api/users/me/password`,
}

export const AI_ENDPOINTS = {
  SUGGEST:  `${BASE}/api/ai/suggest`,
  ANALYZE:  `${BASE}/api/ai/analyze`,
  PRIORITY: `${BASE}/api/ai/priority`,
}

export const ANALYTICS_ENDPOINTS = {
  PROJECT:   (id) => `${BASE}/api/analytics/projects/${id}`,
  WORKSPACE: (id) => `${BASE}/api/analytics/workspaces/${id}`,
  TEAM:      (id) => `${BASE}/api/analytics/teams/${id}`,
}

export const CHAT_ENDPOINTS = {
  ROOMS:    `${BASE}/api/chat/rooms`,
  MESSAGES: (roomId) => `${BASE}/api/chat/rooms/${roomId}/messages`,
  SEND:     (roomId) => `${BASE}/api/chat/rooms/${roomId}/messages`,
}

export const FILE_ENDPOINTS = {
  UPLOAD:   `${BASE}/api/files/upload`,
  DOWNLOAD: (id) => `${BASE}/api/files/${id}`,
  DELETE:   (id) => `${BASE}/api/files/${id}`,
}
