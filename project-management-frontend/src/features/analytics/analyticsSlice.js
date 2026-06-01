// src/features/analytics/analyticsSlice.js
import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit'
import analyticsService
  from '../../services/api/analyticsService'

// ============================
// Thunks
// ============================
export const fetchProjectOverview = createAsyncThunk(
  'analytics/fetchOverview',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await analyticsService
        .getProjectOverview(projectId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchBurndown = createAsyncThunk(
  'analytics/fetchBurndown',
  async ({ projectId, sprintId }, { rejectWithValue }) => {
    try {
      const res = await analyticsService
        .getBurndown(projectId, sprintId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchVelocity = createAsyncThunk(
  'analytics/fetchVelocity',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await analyticsService
        .getVelocity(projectId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchTeamPerformance = createAsyncThunk(
  'analytics/fetchTeamPerformance',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await analyticsService
        .getTeamPerformance(projectId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchWeeklyProgress = createAsyncThunk(
  'analytics/fetchWeeklyProgress',
  async (
    { projectId, weeks = 8 },
    { rejectWithValue }
  ) => {
    try {
      const res = await analyticsService
        .getWeeklyProgress(projectId, weeks)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchTaskDistribution = createAsyncThunk(
  'analytics/fetchTaskDistribution',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await analyticsService
        .getTaskDistribution(projectId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ============================
// Slice
// ============================
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    overview:         null,
    burndown:         null,
    velocity:         null,
    teamPerformance:  null,
    weeklyProgress:   null,
    taskDistribution: null,
    loading: {
      overview:         false,
      burndown:         false,
      velocity:         false,
      teamPerformance:  false,
      weeklyProgress:   false,
      taskDistribution: false,
    },
    error: null,
  },
  reducers: {
    clearAnalytics: (state) => {
      state.overview         = null
      state.burndown         = null
      state.velocity         = null
      state.teamPerformance  = null
      state.weeklyProgress   = null
      state.taskDistribution = null
    }
  },
  extraReducers: (builder) => {
    // Overview
    builder
      .addCase(
        fetchProjectOverview.pending,
        (state) => {
          state.loading.overview = true
        }
      )
      .addCase(
        fetchProjectOverview.fulfilled,
        (state, action) => {
          state.loading.overview = false
          state.overview         = action.payload
        }
      )
      .addCase(
        fetchProjectOverview.rejected,
        (state, action) => {
          state.loading.overview = false
          state.error            = action.payload
        }
      )

    // Burndown
    builder
      .addCase(fetchBurndown.pending, (state) => {
        state.loading.burndown = true
      })
      .addCase(
        fetchBurndown.fulfilled,
        (state, action) => {
          state.loading.burndown = false
          state.burndown         = action.payload
        }
      )
      .addCase(fetchBurndown.rejected, (state) => {
        state.loading.burndown = false
      })

    // Velocity
    builder
      .addCase(fetchVelocity.pending, (state) => {
        state.loading.velocity = true
      })
      .addCase(
        fetchVelocity.fulfilled,
        (state, action) => {
          state.loading.velocity = false
          state.velocity         = action.payload
        }
      )
      .addCase(fetchVelocity.rejected, (state) => {
        state.loading.velocity = false
      })

    // Team Performance
    builder
      .addCase(
        fetchTeamPerformance.pending,
        (state) => {
          state.loading.teamPerformance = true
        }
      )
      .addCase(
        fetchTeamPerformance.fulfilled,
        (state, action) => {
          state.loading.teamPerformance = false
          state.teamPerformance         = action.payload
        }
      )
      .addCase(
        fetchTeamPerformance.rejected,
        (state) => {
          state.loading.teamPerformance = false
        }
      )

    // Weekly Progress
    builder
      .addCase(
        fetchWeeklyProgress.pending,
        (state) => {
          state.loading.weeklyProgress = true
        }
      )
      .addCase(
        fetchWeeklyProgress.fulfilled,
        (state, action) => {
          state.loading.weeklyProgress = false
          state.weeklyProgress         = action.payload
        }
      )
      .addCase(
        fetchWeeklyProgress.rejected,
        (state) => {
          state.loading.weeklyProgress = false
        }
      )

    // Task Distribution
    builder
      .addCase(
        fetchTaskDistribution.pending,
        (state) => {
          state.loading.taskDistribution = true
        }
      )
      .addCase(
        fetchTaskDistribution.fulfilled,
        (state, action) => {
          state.loading.taskDistribution = false
          state.taskDistribution         = action.payload
        }
      )
      .addCase(
        fetchTaskDistribution.rejected,
        (state) => {
          state.loading.taskDistribution = false
        }
      )
  }
})

export const { clearAnalytics } = analyticsSlice.actions

// Selectors
export const selectOverview =
  (state) => state.analytics.overview

export const selectBurndown =
  (state) => state.analytics.burndown

export const selectVelocity =
  (state) => state.analytics.velocity

export const selectTeamPerformance =
  (state) => state.analytics.teamPerformance

export const selectWeeklyProgress =
  (state) => state.analytics.weeklyProgress

export const selectTaskDistribution =
  (state) => state.analytics.taskDistribution

export const selectAnalyticsLoading =
  (state) => state.analytics.loading

export default analyticsSlice.reducer