// src/features/chat/chatSlice.js
import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import messageService
  from '../../services/api/messageService'

// ============================
// Thunks
// ============================
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (
    { projectId, page = 0 },
    { rejectWithValue }
  ) => {
    try {
      const res = await messageService
        .getMessages(projectId, page)
      return { ...res.data, page }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const loadMoreMessages = createAsyncThunk(
  'chat/loadMore',
  async (
    { projectId, page },
    { rejectWithValue }
  ) => {
    try {
      const res = await messageService
        .getMessages(projectId, page)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async (
    { projectId, messageId },
    { rejectWithValue }
  ) => {
    try {
      await messageService
        .deleteMessage(projectId, messageId)
      return messageId
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ============================
// Slice
// ============================
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages:       [],
    typingUsers:    [],
    onlineUsers:    [],
    loading:        false,
    loadingMore:    false,
    hasMore:        true,
    currentPage:    0,
    totalPages:     0,
    error:          null,
    searchQuery:    '',
    searchResults:  [],
  },
  reducers: {
    // Add real-time message
    addMessage: (state, action) => {
      const exists = state.messages.find(
        m => m.id === action.payload.id
      )
      if (!exists) {
        state.messages.push(action.payload)
      }
    },

    // Remove message
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        m => m.id !== action.payload
      )
    },

    // Set typing users
    setTypingUser: (state, action) => {
      const { userId, userName, isTyping } =
        action.payload

      if (isTyping) {
        const exists = state.typingUsers.find(
          u => u.userId === userId
        )
        if (!exists) {
          state.typingUsers.push({
            userId, userName
          })
        }
      } else {
        state.typingUsers = state.typingUsers
          .filter(u => u.userId !== userId)
      }
    },

    // Set online users
    setUserOnlineStatus: (state, action) => {
      const { username, status } = action.payload
      if (status === 'ONLINE') {
        if (!state.onlineUsers.includes(username)) {
          state.onlineUsers.push(username)
        }
      } else {
        state.onlineUsers = state.onlineUsers
          .filter(u => u !== username)
      }
    },

    // Clear chat
    clearChat: (state) => {
      state.messages      = []
      state.typingUsers   = []
      state.onlineUsers   = []
      state.currentPage   = 0
      state.hasMore       = true
    },

    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(
        fetchMessages.fulfilled,
        (state, action) => {
          state.loading     = false
          state.messages    = action.payload.content
          state.totalPages  =
            action.payload.totalPages
          state.currentPage = 0
          state.hasMore     = !action.payload.last
        }
      )
      .addCase(
        fetchMessages.rejected,
        (state, action) => {
          state.loading = false
          state.error   = action.payload
        }
      )

      // Load More Messages
      .addCase(loadMoreMessages.pending, (state) => {
        state.loadingMore = true
      })
      .addCase(
        loadMoreMessages.fulfilled,
        (state, action) => {
          state.loadingMore = false
          // Prepend older messages
          state.messages = [
            ...action.payload.content,
            ...state.messages,
          ]
          state.currentPage =
            action.payload.currentPage
          state.hasMore = !action.payload.last
        }
      )
      .addCase(
        loadMoreMessages.rejected,
        (state) => {
          state.loadingMore = false
        }
      )

      // Delete Message
      .addCase(
        deleteMessage.fulfilled,
        (state, action) => {
          state.messages = state.messages.filter(
            m => m.id !== action.payload
          )
        }
      )
  },
})

export const {
  addMessage,
  removeMessage,
  setTypingUser,
  setUserOnlineStatus,
  clearChat,
  setSearchQuery,
} = chatSlice.actions

// Selectors
export const selectMessages =
  (state) => state.chat.messages

export const selectTypingUsers =
  (state) => state.chat.typingUsers

export const selectOnlineUsers =
  (state) => state.chat.onlineUsers

export const selectChatLoading =
  (state) => state.chat.loading

export const selectLoadingMore =
  (state) => state.chat.loadingMore

export const selectHasMore =
  (state) => state.chat.hasMore

export const selectCurrentPage =
  (state) => state.chat.currentPage

export default chatSlice.reducer