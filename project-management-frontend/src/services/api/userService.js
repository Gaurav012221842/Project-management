// src/services/api/userService.js
import api from './axiosInstance'

const userService = {
  getUsers: (params) =>
    api.get('/api/v1/users', { params }),

  getUserById: (id) =>
    api.get(`/api/v1/users/${id}`),

  updateUser: (id, data) =>
    api.put(`/api/v1/users/${id}`, data),

  searchUsers: (query) =>
    api.get('/api/v1/users/search', { params: { q: query } }),
}

export default userService
