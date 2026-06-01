// src/constants/routePaths.js
export const ROUTES = {
  HOME:               '/',
  LOGIN:              '/login',
  REGISTER:           '/register',
  FORGOT_PASSWORD:    '/forgot-password',
  RESET_PASSWORD:     '/reset-password',

  WORKSPACE:          '/workspaces',
  WORKSPACE_SETTINGS: '/workspaces/:workspaceId/settings',

  PROJECTS:           '/projects',
  PROJECT_DETAIL: (id = ':projectId') => `/projects/${id}`,
  PROJECT_BOARD:  (id = ':projectId') => `/projects/${id}/board`,
  PROJECT_SETTINGS:(id= ':projectId') => `/projects/${id}/settings`,

  SPRINTS:            '/sprints',
  SPRINT_DETAIL: (id = ':sprintId') => `/sprints/${id}`,

  ANALYTICS:          '/analytics',

  CHAT:               '/chat',

  AI_ASSISTANT:       '/ai-assistant',

  PROFILE:            '/profile',

  SETTINGS:           '/settings',

  NOT_FOUND:          '/404',
  SERVER_ERROR:       '/500',
}

export default ROUTES
