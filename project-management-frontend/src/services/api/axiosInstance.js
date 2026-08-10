// src/services/api/axiosInstance.js
import axios from 'axios'

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || 'https://project-management-ac99.onrender.com',
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081',
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

// FIX: Track in-flight refresh to prevent multiple concurrent refresh calls
let isRefreshing = false
let refreshSubscribers = []

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb)
}

// Unwrap ApiResponse envelope `{ success, data, message }`
// FIX: On 401 — try to refresh the access token first before redirecting to login
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
  async (error) => {
    const originalRequest = error.config

    // Surface backend error message if envelope present
    const body = error.response?.data
    if (body && typeof body === 'object' && 'message' in body) {
      error.message = body.message || error.message
    }

    // FIX: Try refresh token before clearing session on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // No refresh token available — clear session and redirect
        clearSessionAndRedirect()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(
          `${api.defaults.baseURL}/api/v1/auth/refresh-token`,
          { refreshToken }
        )

        // Unwrap envelope if needed
        const responseData = response.data
        const payload =
          responseData && 'data' in responseData
            ? responseData.data
            : responseData

        const newAccessToken = payload?.accessToken
        const newRefreshToken = payload?.refreshToken

        if (!newAccessToken) throw new Error('No access token in refresh response')

        // Persist new tokens
        localStorage.setItem('token', newAccessToken)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }

        // Notify all queued requests
        onRefreshed(newAccessToken)
        isRefreshing = false

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh itself failed — clear session and redirect
        isRefreshing = false
        refreshSubscribers = []
        clearSessionAndRedirect()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

function clearSessionAndRedirect() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export default api
