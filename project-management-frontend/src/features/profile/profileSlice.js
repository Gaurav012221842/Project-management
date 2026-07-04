// src/features/profile/profileSlice.js
import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import profileService
  from '../../services/api/profileService'
import { updateUser } from '../auth/authSlice'
import toast from 'react-hot-toast'

// ============================
// Thunks
// ============================
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await profileService.getProfile()
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data, { rejectWithValue }) => {
    try {
      const res = await profileService
        .updateProfile(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await profileService
        .uploadAvatar(formData)
      dispatch(updateUser({
        ...res.data,
        avatarUrl: res.data?.profilePic,
      }))
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      await profileService.changePassword(data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchActivityLog = createAsyncThunk(
  'profile/fetchActivity',
  async (
    { page = 0, size = 10 } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await profileService
        .getActivityLog(page, size)
      return { ...res.data, page }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchUserStats = createAsyncThunk(
  'profile/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await profileService.getUserStats()
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ============================
// Slice
// ============================
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile:         null,
    stats:           null,
    activityLog:     [],
    loading:         false,
    updateLoading:   false,
    avatarLoading:   false,
    passwordLoading: false,
    activityLoading: false,
    hasMoreActivity: true,
    currentPage:     0,
    error:           null,
    activeTab:       'overview',
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    clearProfile: (state) => {
      state.profile     = null
      state.stats       = null
      state.activityLog = []
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action) => {
          state.loading = false
          state.profile = action.payload
        }
      )
      .addCase(
        fetchProfile.rejected,
        (state, action) => {
          state.loading = false
          state.error   = action.payload
        }
      )

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action) => {
          state.updateLoading = false
          state.profile       = action.payload
          toast.success('Profile updated! ✅')
        }
      )
      .addCase(
        updateProfile.rejected,
        (state, action) => {
          state.updateLoading = false
          toast.error(
            action.payload || 'Update failed'
          )
        }
      )

      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.avatarLoading = true
      })
      .addCase(
        uploadAvatar.fulfilled,
        (state, action) => {
          state.avatarLoading = false
          if (state.profile) {
            state.profile.profilePic =
              action.payload.profilePic
          }
          toast.success('Avatar updated! 🖼️')
        }
      )
      .addCase(
        uploadAvatar.rejected,
        (state, action) => {
          state.avatarLoading = false
          toast.error('Failed to upload avatar')
        }
      )

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.passwordLoading = true
      })
      .addCase(
        changePassword.fulfilled,
        (state) => {
          state.passwordLoading = false
          toast.success('Password changed! 🔒')
        }
      )
      .addCase(
        changePassword.rejected,
        (state, action) => {
          state.passwordLoading = false
          toast.error(
            action.payload || 'Failed to change password'
          )
        }
      )

      // Fetch Activity
      .addCase(
        fetchActivityLog.pending,
        (state) => {
          state.activityLoading = true
        }
      )
      .addCase(
        fetchActivityLog.fulfilled,
        (state, action) => {
          state.activityLoading = false
          if (action.payload.page === 0) {
            state.activityLog = action.payload.content
          } else {
            state.activityLog = [
              ...state.activityLog,
              ...action.payload.content,
            ]
          }
          state.currentPage   = action.payload.currentPage
          state.hasMoreActivity = !action.payload.last
        }
      )
      .addCase(
        fetchActivityLog.rejected,
        (state) => {
          state.activityLoading = false
        }
      )

      // Fetch Stats
      .addCase(
        fetchUserStats.fulfilled,
        (state, action) => {
          state.stats = action.payload
        }
      )
  },
})

export const {
  setActiveTab,
  clearProfile,
} = profileSlice.actions

// Selectors
export const selectProfile =
  (state) => state.profile.profile

export const selectProfileStats =
  (state) => state.profile.stats

export const selectActivityLog =
  (state) => state.profile.activityLog

export const selectProfileLoading =
  (state) => state.profile.loading

export const selectUpdateLoading =
  (state) => state.profile.updateLoading

export const selectAvatarLoading =
  (state) => state.profile.avatarLoading

export const selectPasswordLoading =
  (state) => state.profile.passwordLoading

export const selectActiveTab =
  (state) => state.profile.activeTab

export const selectHasMoreActivity =
  (state) => state.profile.hasMoreActivity

export const selectActivityLoading =
  (state) => state.profile.activityLoading

export const selectCurrentPage =
  (state) => state.profile.currentPage

export default profileSlice.reducer
