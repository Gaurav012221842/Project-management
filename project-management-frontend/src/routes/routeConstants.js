// src/routes/routeConstants.js
export const PUBLIC_ROUTES  = ['/login', '/register', '/forgot-password', '/reset-password']
export const PRIVATE_ROUTES = ['/projects', '/workspaces', '/sprints', '/analytics', '/chat', '/ai-assistant', '/profile', '/settings']

export const DEFAULT_PRIVATE_ROUTE = '/projects'
export const DEFAULT_PUBLIC_ROUTE  = '/login'

export default { PUBLIC_ROUTES, PRIVATE_ROUTES, DEFAULT_PRIVATE_ROUTE, DEFAULT_PUBLIC_ROUTE }
