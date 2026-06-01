// src/services/api/taskService.js
import api from './axiosInstance'

const taskService = {

  // Tasks
  createTask: (projectId, data) =>
    api.post(
      `/api/v1/projects/${projectId}/tasks`,
      data
    ),

  getProjectTasks: (projectId) =>
    api.get(
      `/api/v1/projects/${projectId}/tasks`
    ),

  getTaskById: (taskId) =>
    api.get(`/api/v1/tasks/${taskId}`),

  updateTask: (taskId, data) =>
    api.put(`/api/v1/tasks/${taskId}`, data),

  updateTaskStatus: (taskId, data) =>
    api.put(`/api/v1/tasks/${taskId}/status`, data),

  assignTask: (taskId, data) =>
    api.put(`/api/v1/tasks/${taskId}/assign`, data),

  deleteTask: (taskId) =>
    api.delete(`/api/v1/tasks/${taskId}`),

  moveToSprint: (taskId, data) =>
    api.post(
      `/api/v1/tasks/${taskId}/move-to-sprint`,
      data
    ),

  // SubTasks
  createSubTask: (taskId, data) =>
    api.post(
      `/api/v1/tasks/${taskId}/subtasks`,
      data
    ),

  updateSubTask: (taskId, subTaskId, data) =>
    api.put(
      `/api/v1/tasks/${taskId}/subtasks/${subTaskId}`,
      data
    ),

  deleteSubTask: (taskId, subTaskId) =>
    api.delete(
      `/api/v1/tasks/${taskId}/subtasks/${subTaskId}`
    ),

  // Comments
  getTaskComments: (taskId) =>
    api.get(`/api/v1/tasks/${taskId}/comments`),

  addComment: (taskId, data) =>
    api.post(
      `/api/v1/tasks/${taskId}/comments`,
      data
    ),

  updateComment: (taskId, commentId, data) =>
    api.put(
      `/api/v1/tasks/${taskId}/comments/${commentId}`,
      data
    ),

  deleteComment: (taskId, commentId) =>
    api.delete(
      `/api/v1/tasks/${taskId}/comments/${commentId}`
    ),

  // Attachments
  uploadAttachment: (taskId, formData) =>
    api.post(
      `/api/v1/tasks/${taskId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  deleteAttachment: (taskId, attachmentId) =>
    api.delete(
      `/api/v1/tasks/${taskId}/attachments/${attachmentId}`
    ),
}

export default taskService