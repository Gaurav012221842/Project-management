// src/features/sprint/sprintSlice.js
import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import sprintService
  from '../../services/api/sprintService'
import toast from 'react-hot-toast'

// ============================
// Thunks
// ============================
export const fetchSprints = createAsyncThunk(
  'sprint/fetchAll',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await sprintService
        .getSprints(projectId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchSprintById = createAsyncThunk(
  'sprint/fetchById',
  async (
    { projectId, sprintId },
    { rejectWithValue }
  ) => {
    try {
      const res = await sprintService
        .getSprintById(projectId, sprintId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createSprint = createAsyncThunk(
  'sprint/create',
  async (
    { projectId, data },
    { rejectWithValue }
  ) => {
    try {
      const res = await sprintService
        .createSprint(projectId, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateSprint = createAsyncThunk(
  'sprint/update',
  async (
    { projectId, sprintId, data },
    { rejectWithValue }
  ) => {
    try {
      const res = await sprintService
        .updateSprint(projectId, sprintId, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteSprint = createAsyncThunk(
  'sprint/delete',
  async (
    { projectId, sprintId },
    { rejectWithValue }
  ) => {
    try {
      await sprintService
        .deleteSprint(projectId, sprintId)
      return sprintId
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const startSprint = createAsyncThunk(
  'sprint/start',
  async (
    { projectId, sprintId },
    { rejectWithValue }
  ) => {
    try {
      const res = await sprintService
        .startSprint(projectId, sprintId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const completeSprint = createAsyncThunk(
  'sprint/complete',
  async (
    { projectId, sprintId },
    { rejectWithValue }
  ) => {
    try {
      const res = await sprintService
        .completeSprint(projectId, sprintId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const moveTaskToSprint = createAsyncThunk(
  'sprint/moveTask',
  async (
    { taskId, sprintId },
    { rejectWithValue }
  ) => {
    try {
      const res = await sprintService
        .moveTaskToSprint(taskId, sprintId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ============================
// Slice
// ============================
const sprintSlice = createSlice({
  name: 'sprint',
  initialState: {
    sprints:        [],
    selectedSprint: null,
    loading:        false,
    createLoading:  false,
    updateLoading:  false,
    actionLoading:  false,
    error:          null,
    activeView:     'board',
  },
  reducers: {
    setSelectedSprint: (state, action) => {
      state.selectedSprint = action.payload
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload
    },
    clearSprints: (state) => {
      state.sprints        = []
      state.selectedSprint = null
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch All
      .addCase(fetchSprints.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(
        fetchSprints.fulfilled,
        (state, action) => {
          state.loading  = false
          state.sprints  = action.payload
        }
      )
      .addCase(
        fetchSprints.rejected,
        (state, action) => {
          state.loading = false
          state.error   = action.payload
        }
      )

      // Fetch By ID
      .addCase(
        fetchSprintById.fulfilled,
        (state, action) => {
          state.selectedSprint = action.payload
        }
      )

      // Create
      .addCase(createSprint.pending, (state) => {
        state.createLoading = true
      })
      .addCase(
        createSprint.fulfilled,
        (state, action) => {
          state.createLoading = false
          state.sprints.push(action.payload)
          toast.success('Sprint created! 🚀')
        }
      )
      .addCase(
        createSprint.rejected,
        (state, action) => {
          state.createLoading = false
          toast.error(
            action.payload || 'Failed to create'
          )
        }
      )

      // Update
      .addCase(updateSprint.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(
        updateSprint.fulfilled,
        (state, action) => {
          state.updateLoading = false
          const idx = state.sprints.findIndex(
            s => s.id === action.payload.id
          )
          if (idx !== -1) {
            state.sprints[idx] = action.payload
          }
          toast.success('Sprint updated!')
        }
      )
      .addCase(updateSprint.rejected, (state) => {
        state.updateLoading = false
      })

      // Delete
      .addCase(deleteSprint.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(
        deleteSprint.fulfilled,
        (state, action) => {
          state.actionLoading = false
          state.sprints = state.sprints.filter(
            s => s.id !== action.payload
          )
          toast.success('Sprint deleted!')
        }
      )
      .addCase(deleteSprint.rejected, (state) => {
        state.actionLoading = false
      })

      // Start Sprint
      .addCase(startSprint.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(
        startSprint.fulfilled,
        (state, action) => {
          state.actionLoading = false
          const idx = state.sprints.findIndex(
            s => s.id === action.payload.id
          )
          if (idx !== -1) {
            state.sprints[idx] = action.payload
          }
          toast.success('Sprint started! 🚀')
        }
      )
      .addCase(startSprint.rejected, (state) => {
        state.actionLoading = false
      })

      // Complete Sprint
      .addCase(completeSprint.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(
        completeSprint.fulfilled,
        (state, action) => {
          state.actionLoading = false
          const idx = state.sprints.findIndex(
            s => s.id === action.payload.id
          )
          if (idx !== -1) {
            state.sprints[idx] = action.payload
          }
          toast.success('Sprint completed! 🎉')
        }
      )
      .addCase(
        completeSprint.rejected,
        (state) => {
          state.actionLoading = false
        }
      )
  },
})

export const {
  setSelectedSprint,
  setActiveView,
  clearSprints,
} = sprintSlice.actions

// Selectors
export const selectSprints =
  (state) => state.sprint.sprints

export const selectSelectedSprint =
  (state) => state.sprint.selectedSprint

export const selectSprintLoading =
  (state) => state.sprint.loading

export const selectCreateLoading =
  (state) => state.sprint.createLoading

export const selectUpdateLoading =
  (state) => state.sprint.updateLoading

export const selectActionLoading =
  (state) => state.sprint.actionLoading

export const selectActiveView =
  (state) => state.sprint.activeView

export const selectActiveSprint =
  (state) => state.sprint.sprints.find(
    s => s.status === 'ACTIVE'
  )

export const selectPlannedSprints =
  (state) => state.sprint.sprints.filter(
    s => s.status === 'PLANNED'
  )

export const selectCompletedSprints =
  (state) => state.sprint.sprints.filter(
    s => s.status === 'COMPLETED'
  )

export const selectSprintStats =
  (state) => {
    const { sprints } = state.sprint
    return {
      total:     sprints.length,
      planned:   sprints.filter(
        s => s.status === 'PLANNED'
      ).length,
      active:    sprints.filter(
        s => s.status === 'ACTIVE'
      ).length,
      completed: sprints.filter(
        s => s.status === 'COMPLETED'
      ).length,
    }
  }

export default sprintSlice.reducer