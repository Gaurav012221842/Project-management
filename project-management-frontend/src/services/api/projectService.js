// src/services/api/projectService.js
import api from './axiosInstance'

const projectService = {

  getProjects: (params) =>
    api.get('/api/v1/projects', { params }),

  getProjectById: (id) =>
    api.get(`/api/v1/projects/${id}`),

  createProject: (data) =>
    api.post('/api/v1/projects', data),

  updateProject: (id, data) =>
    api.put(`/api/v1/projects/${id}`, data),

  deleteProject: (id) =>
    api.delete(`/api/v1/projects/${id}`),

  getProjectStats: (id) =>
    api.get(`/api/v1/projects/${id}/stats`),

  getProjectActivity: (id, params) =>
    api.get(
      `/api/v1/projects/${id}/activity`,
      { params }
    ),

  addMember: (id, data) =>
    api.post(
      `/api/v1/projects/${id}/members`,
      data
    ),

  removeMember: (id, userId) =>
    api.delete(
      `/api/v1/projects/${id}/members/${userId}`
    ),

  searchUsers: (query) =>
    api.get('/api/v1/users/search', {
      params: { query }
    }),
}

export default projectService