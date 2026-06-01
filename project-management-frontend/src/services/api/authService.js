// src/services/api/authService.js
import api from './axiosInstance'

const authService = {
  register: (data) => 
    api.post('/api/v1/auth/register', data),

  login: (data) => 
    api.post('/api/v1/auth/login', data),

  logout: () => 
    api.post('/api/v1/auth/logout'),

  refreshToken: (data) => 
    api.post('/api/v1/auth/refresh-token', data),

  forgotPassword: (data) => 
    api.post('/api/v1/auth/forgot-password', data),
}

export default authService

// ================================

