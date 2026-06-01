// src/services/api/messageService.js
import api from './axiosInstance'

const messageService = {

  getMessages: (projectId, page = 0, size = 30) =>
    api.get(
      `/api/v1/projects/${projectId}/messages`,
      { params: { page, size } }
    ),

  deleteMessage: (projectId, messageId) =>
    api.delete(
      `/api/v1/projects/${projectId}/messages/${messageId}`
    ),

  searchMessages: (projectId, query, page = 0) =>
    api.get(
      `/api/v1/projects/${projectId}/messages/search`,
      { params: { query, page } }
    ),

  uploadFile: (projectId, formData) =>
    api.post(
      `/api/v1/projects/${projectId}/messages/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ),
}

export default messageService