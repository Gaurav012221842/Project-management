// src/features/ai/aiSlice.js
import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import aiService
  from '../../services/api/aiService'
import toast from 'react-hot-toast'

// ============================
// Thunks
// ============================
export const generateDescription = createAsyncThunk(
  'ai/generateDescription',
  async (data, { rejectWithValue }) => {
    try {
      const res = await aiService
        .generateDescription(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const suggestPriority = createAsyncThunk(
  'ai/suggestPriority',
  async (data, { rejectWithValue }) => {
    try {
      const res = await aiService
        .suggestPriority(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const analyzeBug = createAsyncThunk(
  'ai/analyzeBug',
  async (data, { rejectWithValue }) => {
    try {
      const res = await aiService.analyzeBug(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const estimateStoryPoints = createAsyncThunk(
  'ai/estimateStoryPoints',
  async (data, { rejectWithValue }) => {
    try {
      const res = await aiService
        .estimateStoryPoints(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const generateSubTasks = createAsyncThunk(
  'ai/generateSubTasks',
  async (data, { rejectWithValue }) => {
    try {
      const res = await aiService
        .generateSubTasks(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const generateSprintGoal = createAsyncThunk(
  'ai/generateSprintGoal',
  async (data, { rejectWithValue }) => {
    try {
      const res = await aiService
        .generateSprintGoal(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const sendChatMessage = createAsyncThunk(
  'ai/sendChat',
  async (data, { rejectWithValue }) => {
    try {
      const res = await aiService.chat(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const summarizeProject = createAsyncThunk(
  'ai/summarizeProject',
  async (data, { rejectWithValue }) => {
    try {
      const res = await aiService
        .summarizeProject(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ============================
// Slice
// ============================
const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    chatHistory:      [],
    lastDescription:  null,
    lastPriority:     null,
    lastBugAnalysis:  null,
    lastEstimate:     null,
    lastSubTasks:     null,
    lastSprintGoal:   null,
    lastSummary:      null,
    loading:          false,
    chatLoading:      false,
    error:            null,
    activeFeature:    'chat',
  },
  reducers: {
    setActiveFeature: (state, action) => {
      state.activeFeature = action.payload
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload)
    },
    clearChat: (state) => {
      state.chatHistory = []
    },
    clearResults: (state) => {
      state.lastDescription = null
      state.lastPriority    = null
      state.lastBugAnalysis = null
      state.lastEstimate    = null
      state.lastSubTasks    = null
      state.lastSprintGoal  = null
      state.lastSummary     = null
    },
  },
  extraReducers: (builder) => {
    builder

      // Description
      .addCase(
        generateDescription.pending,
        (state) => { state.loading = true }
      )
      .addCase(
        generateDescription.fulfilled,
        (state, action) => {
          state.loading         = false
          state.lastDescription = action.payload.text
        }
      )
      .addCase(
        generateDescription.rejected,
        (state) => {
          state.loading = false
          toast.error('AI unavailable')
        }
      )

      // Priority
      .addCase(
        suggestPriority.pending,
        (state) => { state.loading = true }
      )
      .addCase(
        suggestPriority.fulfilled,
        (state, action) => {
          state.loading      = false
          state.lastPriority = action.payload
        }
      )
      .addCase(
        suggestPriority.rejected,
        (state) => { state.loading = false }
      )

      // Bug Analysis
      .addCase(
        analyzeBug.pending,
        (state) => { state.loading = true }
      )
      .addCase(
        analyzeBug.fulfilled,
        (state, action) => {
          state.loading        = false
          state.lastBugAnalysis = action.payload
        }
      )
      .addCase(
        analyzeBug.rejected,
        (state) => { state.loading = false }
      )

      // Estimate
      .addCase(
        estimateStoryPoints.pending,
        (state) => { state.loading = true }
      )
      .addCase(
        estimateStoryPoints.fulfilled,
        (state, action) => {
          state.loading      = false
          state.lastEstimate = action.payload
        }
      )
      .addCase(
        estimateStoryPoints.rejected,
        (state) => { state.loading = false }
      )

      // SubTasks
      .addCase(
        generateSubTasks.pending,
        (state) => { state.loading = true }
      )
      .addCase(
        generateSubTasks.fulfilled,
        (state, action) => {
          state.loading      = false
          state.lastSubTasks = action.payload
        }
      )
      .addCase(
        generateSubTasks.rejected,
        (state) => { state.loading = false }
      )

      // Sprint Goal
      .addCase(
        generateSprintGoal.pending,
        (state) => { state.loading = true }
      )
      .addCase(
        generateSprintGoal.fulfilled,
        (state, action) => {
          state.loading        = false
          state.lastSprintGoal = action.payload.text
        }
      )
      .addCase(
        generateSprintGoal.rejected,
        (state) => { state.loading = false }
      )

      // Chat
      .addCase(
        sendChatMessage.pending,
        (state) => { state.chatLoading = true }
      )
      .addCase(
        sendChatMessage.fulfilled,
        (state, action) => {
          state.chatLoading = false
          state.chatHistory.push({
            role:    'assistant',
            content: action.payload.text,
          })
        }
      )
      .addCase(
        sendChatMessage.rejected,
        (state) => {
          state.chatLoading = false
          state.chatHistory.push({
            role:    'assistant',
            content: '❌ AI unavailable. Try again.',
          })
        }
      )

      // Summary
      .addCase(
        summarizeProject.pending,
        (state) => { state.loading = true }
      )
      .addCase(
        summarizeProject.fulfilled,
        (state, action) => {
          state.loading     = false
          state.lastSummary = action.payload.text
        }
      )
      .addCase(
        summarizeProject.rejected,
        (state) => { state.loading = false }
      )
  },
})

export const {
  setActiveFeature,
  addChatMessage,
  clearChat,
  clearResults,
} = aiSlice.actions

// Selectors
export const selectChatHistory =
  (state) => state.ai.chatHistory

export const selectAILoading =
  (state) => state.ai.loading

export const selectChatLoading =
  (state) => state.ai.chatLoading

export const selectActiveFeature =
  (state) => state.ai.activeFeature

export const selectLastDescription =
  (state) => state.ai.lastDescription

export const selectLastPriority =
  (state) => state.ai.lastPriority

export const selectLastBugAnalysis =
  (state) => state.ai.lastBugAnalysis

export const selectLastEstimate =
  (state) => state.ai.lastEstimate

export const selectLastSubTasks =
  (state) => state.ai.lastSubTasks

export const selectLastSprintGoal =
  (state) => state.ai.lastSprintGoal

export const selectLastSummary =
  (state) => state.ai.lastSummary

export default aiSlice.reducer