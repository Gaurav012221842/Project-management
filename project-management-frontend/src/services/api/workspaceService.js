// src/services/api/workspaceService.js
import api from './axiosInstance'

const workspaceService = {
  getWorkspaces: () =>
    api.get('/api/v1/workspaces'),

  getWorkspaceById: (id) =>
    api.get(`/api/v1/workspaces/${id}`),

  createWorkspace: (data) =>
    api.post('/api/v1/workspaces', data),

  updateWorkspace: (id, data) =>
    api.put(`/api/v1/workspaces/${id}`, data),

  deleteWorkspace: (id) =>
    api.delete(`/api/v1/workspaces/${id}`),

  inviteMember: (id, data) =>
    api.post(`/api/v1/workspaces/${id}/invite`, data),

  removeMember: (id, userId) =>
    api.delete(`/api/v1/workspaces/${id}/members/${userId}`),
}

export default workspaceService
