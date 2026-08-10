// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } 
  from '@reduxjs/toolkit'
import authService from '../../services/api/authService'
import toast       from 'react-hot-toast'

// Thunks
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Logout failed'
      )
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      // FIX: axiosInstance already unwraps the envelope → response.data IS the payload
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Login failed'
      )
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      // FIX: axiosInstance already unwraps the envelope → response.data IS the payload
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Registration failed'
      )
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    (() => {
      const raw = localStorage.getItem('user')
      if (!raw || raw === 'undefined') return null
      try { return JSON.parse(raw) } catch { return null }
    })(),
    token:   localStorage.getItem('token') || null,
    loading: false,
    error:   null
  },
  reducers: {
    logout: (state) => {
      state.user  = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem(
        'user', 
        JSON.stringify(state.user)
      )
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.accessToken
        localStorage.setItem(
          'token', action.payload.accessToken
        )
        localStorage.setItem(
          'refreshToken', action.payload.refreshToken
        )
        localStorage.setItem(
          'user', 
          JSON.stringify(action.payload.user)
        )
        toast.success('Welcome back!')
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.accessToken
        localStorage.setItem(
          'token', action.payload.accessToken
        )
        localStorage.setItem(
          'refreshToken', action.payload.refreshToken
        )
        localStorage.setItem(
          'user',
          JSON.stringify(action.payload.user)
        )
        toast.success('Account created successfully!')
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user    = null
        state.token   = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        toast.success('Logged out successfully!')
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload || 'Logout failed'
        state.user    = null
        state.token   = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        toast.error(
          action.payload
            ? `Logout failed: ${action.payload}`
            : 'Logout failed. You have been signed out locally.'
        )
      })
  }
})

export const { logout, updateUser, clearError } = 
  authSlice.actions

export const selectAuth  = (state) => state.auth
export const selectUser  = (state) => state.auth.user
export const selectToken = (state) => state.auth.token

export default authSlice.reducer

// ================================
