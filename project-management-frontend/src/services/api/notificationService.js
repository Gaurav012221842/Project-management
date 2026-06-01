// src/services/api/notificationService.js
import api from './axiosInstance'

const notificationService = {
  getNotifications: (page = 0, size = 20) =>
    api.get('/api/v1/notifications', { params: { page, size } }),

  getUnreadCount: () =>
    api.get('/api/v1/notifications/unread-count'),

  markAsRead: (id) =>
    api.put(`/api/v1/notifications/${id}/read`),

  markAllAsRead: () =>
    api.put('/api/v1/notifications/read-all'),

  deleteNotification: (id) =>
    api.delete(`/api/v1/notifications/${id}`),
}

export default notificationService
