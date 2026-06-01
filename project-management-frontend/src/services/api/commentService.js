// src/services/api/commentService.js
import api from './axiosInstance'

const commentService = {
  getComments: (taskId) =>
    api.get(`/api/v1/tasks/${taskId}/comments`),

  createComment: (taskId, data) =>
    api.post(`/api/v1/tasks/${taskId}/comments`, data),

  updateComment: (taskId, commentId, data) =>
    api.put(`/api/v1/tasks/${taskId}/comments/${commentId}`, data),

  deleteComment: (taskId, commentId) =>
    api.delete(`/api/v1/tasks/${taskId}/comments/${commentId}`),
}

export default commentService
