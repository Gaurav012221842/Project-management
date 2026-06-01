// src/services/websocket/socketEvents.js

export const SOCKET_EVENTS = {

  // Chat Events
  CHAT: {
    SEND:    (projectId) =>
      `/app/project/${projectId}/chat.send`,
    RECEIVE: (projectId) =>
      `/topic/project/${projectId}/chat`,
    TYPING:  (projectId) =>
      `/app/project/${projectId}/chat.typing`,
    TYPING_RECEIVE: (projectId) =>
      `/topic/project/${projectId}/chat.typing`,
  },

  // User Events
  USER: {
    JOIN:   (projectId) =>
      `/app/project/${projectId}/user.join`,
    LEAVE:  (projectId) =>
      `/app/project/${projectId}/user.leave`,
    STATUS: (projectId) =>
      `/topic/project/${projectId}/user.status`,
  },

  // Notification Events
  NOTIFICATION: {
    RECEIVE: '/user/queue/notifications',
  },

  // Task Events
  TASK: {
    UPDATED: (projectId) =>
      `/topic/project/${projectId}/task.updated`,
  },
}