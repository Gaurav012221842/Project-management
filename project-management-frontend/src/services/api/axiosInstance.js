// src/services/api/axiosInstance.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9989',
  withCredentials: false,
})

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Unwrap ApiResponse envelope `{ success, data, message }`
// and handle 401 — clear session and redirect to login
api.interceptors.response.use(
  (response) => {
    const body = response.data
    if (
      body &&
      typeof body === 'object' &&
      'success' in body &&
      'data' in body
    ) {
      response.data = body.data
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    // Surface backend error message if envelope present
    const body = error.response?.data
    if (body && typeof body === 'object' && 'message' in body) {
      error.message = body.message || error.message
    }
    return Promise.reject(error)
  }
)

export default api
