// src/constants/socketEvents.js
export const SOCKET_EVENTS = {
  // Connection
  CONNECT:    'connect',
  DISCONNECT: 'disconnect',
  ERROR:      'error',

  // Tasks
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_MOVED:   'task:moved',
  TASK_ASSIGNED:'task:assigned',

  // Comments
  COMMENT_ADDED:   'comment:added',
  COMMENT_UPDATED: 'comment:updated',
  COMMENT_DELETED: 'comment:deleted',

  // Notifications
  NOTIFICATION:       'notification:new',
  NOTIFICATION_READ:  'notification:read',

  // Chat
  CHAT_MESSAGE:  'chat:message',
  CHAT_TYPING:   'chat:typing',
  CHAT_READ:     'chat:read',
  CHAT_JOINED:   'chat:joined',
  CHAT_LEFT:     'chat:left',

  // Sprint
  SPRINT_STARTED:   'sprint:started',
  SPRINT_COMPLETED: 'sprint:completed',

  // Presence
  USER_ONLINE:  'user:online',
  USER_OFFLINE: 'user:offline',
}

export default SOCKET_EVENTS
