// src/features/notification/notificationSlice.js
import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import notificationService
  from '../../services/api/notificationService'
import toast from 'react-hot-toast'

// ============================
// Thunks
// ============================
export const fetchNotifications = createAsyncThunk(
  'notification/fetchAll',
  async (
    { page = 0, size = 20 } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await notificationService
        .getNotifications(page, size)
      return { ...res.data, page }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService
        .getUnreadCount()
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteNotification = createAsyncThunk(
  'notification/delete',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService
        .deleteNotification(id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const clearReadNotifications = createAsyncThunk(
  'notification/clearRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService
        .clearReadNotifications()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ============================
// Slice
// ============================
const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications:  [],
    unreadCount:    0,
    loading:        false,
    loadingMore:    false,
    hasMore:        true,
    currentPage:    0,
    totalPages:     0,
    error:          null,
  },
  reducers: {
    // Real-time new notification
    addNotification: (state, action) => {
      const exists = state.notifications.find(
        n => n.id === action.payload.id
      )
      if (!exists) {
        state.notifications.unshift(action.payload)
        state.unreadCount += 1

        // Show toast
        toast(action.payload.message, {
          icon: getNotificationIcon(
            action.payload.type
          ),
          duration: 4000,
        })
      }
    },

    // Real-time unread count update
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload
    },

    // Remove notification from list
    removeNotification: (state, action) => {
      state.notifications =
        state.notifications.filter(
          n => n.id !== action.payload
        )
    },

    clearAll: (state) => {
      state.notifications = []
      state.unreadCount   = 0
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Notifications
      .addCase(
        fetchNotifications.pending,
        (state, action) => {
          if (action.meta.arg?.page === 0) {
            state.loading = true
          } else {
            state.loadingMore = true
          }
        }
      )
      .addCase(
        fetchNotifications.fulfilled,
        (state, action) => {
          state.loading     = false
          state.loadingMore = false

          if (action.payload.page === 0) {
            state.notifications =
              action.payload.content
          } else {
            state.notifications = [
              ...state.notifications,
              ...action.payload.content,
            ]
          }

          state.currentPage =
            action.payload.currentPage
          state.totalPages =
            action.payload.totalPages
          state.hasMore = !action.payload.last
        }
      )
      .addCase(
        fetchNotifications.rejected,
        (state) => {
          state.loading     = false
          state.loadingMore = false
        }
      )

      // Fetch Unread Count
      .addCase(
        fetchUnreadCount.fulfilled,
        (state, action) => {
          state.unreadCount = action.payload
        }
      )

      // Mark As Read
      .addCase(
        markAsRead.fulfilled,
        (state, action) => {
          const n = state.notifications.find(
            n => n.id === action.payload
          )
          if (n && !n.isRead) {
            n.isRead = true
            state.unreadCount = Math.max(
              0,
              state.unreadCount - 1
            )
          }
        }
      )

      // Mark All As Read
      .addCase(
        markAllAsRead.fulfilled,
        (state) => {
          state.notifications =
            state.notifications.map(n => ({
              ...n,
              isRead: true
            }))
          state.unreadCount = 0
          toast.success('All notifications read')
        }
      )

      // Delete
      .addCase(
        deleteNotification.fulfilled,
        (state, action) => {
          const n = state.notifications.find(
            n => n.id === action.payload
          )
          if (n && !n.isRead) {
            state.unreadCount = Math.max(
              0,
              state.unreadCount - 1
            )
          }
          state.notifications =
            state.notifications.filter(
              n => n.id !== action.payload
            )
        }
      )

      // Clear Read
      .addCase(
        clearReadNotifications.fulfilled,
        (state) => {
          state.notifications =
            state.notifications.filter(
              n => !n.isRead
            )
          toast.success('Cleared read notifications')
        }
      )
  },
})

// ============================
// Helper
// ============================
const getNotificationIcon = (type) => {
  const icons = {
    TASK_ASSIGNED:     '📋',
    COMMENT_ADDED:     '💬',
    TASK_UPDATED:      '✏️',
    SPRINT_STARTED:    '🚀',
    MENTION:           '👋',
    DEADLINE_REMINDER: '⏰',
  }
  return icons[type] || '🔔'
}

export const {
  addNotification,
  setUnreadCount,
  removeNotification,
  clearAll,
} = notificationSlice.actions

// Selectors
export const selectNotifications =
  (state) => state.notification.notifications

export const selectUnreadCount =
  (state) => state.notification.unreadCount

export const selectNotificationLoading =
  (state) => state.notification.loading

export const selectHasMoreNotifications =
  (state) => state.notification.hasMore

export const selectCurrentNotificationPage =
  (state) => state.notification.currentPage

export default notificationSlice.reducer