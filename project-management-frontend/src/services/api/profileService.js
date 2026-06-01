// src/services/api/profileService.js
import api from './axiosInstance'

const profileService = {

  getProfile: () =>
    api.get('/api/v1/users/profile'),

  updateProfile: (data) =>
    api.put('/api/v1/users/profile', data),

  uploadAvatar: (formData) =>
    api.post('/api/v1/users/upload-avatar', formData),

  changePassword: (data) =>
    api.put('/api/v1/users/change-password', data),

  getActivityLog: (page = 0, size = 10) =>
    api.get('/api/v1/users/activity', {
      params: { page, size },
    }),

  getUserStats: () =>
    api.get('/api/v1/users/stats'),

  searchUsers: (query) =>
    api.get('/api/v1/users/search', {
      params: { query },
    }),

  deleteAccount: () =>
    api.delete('/api/v1/users/account'),
}

export default profileService