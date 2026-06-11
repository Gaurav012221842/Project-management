// src/features/workspace/workspaceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import workspaceService from '../../services/api/workspaceService'
import toast from 'react-hot-toast'

export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await workspaceService.getWorkspaces()
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createWorkspace = createAsyncThunk(
  'workspace/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await workspaceService.createWorkspace(data)
      toast.success('Workspace created!')
      return res.data
    } catch (err) {
      toast.error('Failed to create workspace')
      return rejectWithValue(err.message)
    }
  }
)

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    workspaces:        [],
    selectedWorkspace: null,
    loading:           false,
    error:             null,
  },
  reducers: {
    setSelectedWorkspace: (state, action) => {
      state.selectedWorkspace = action.payload
    },
    clearWorkspaces: (state) => {
      state.workspaces        = []
      state.selectedWorkspace = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading    = false
        state.workspaces = action.payload
        if (!state.selectedWorkspace && action.payload.length > 0) {
          state.selectedWorkspace = action.payload[0]
        }
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.push(action.payload)
      })
  },
})

export const { setSelectedWorkspace, clearWorkspaces } =
  workspaceSlice.actions

export const selectWorkspaces        = (state) => state.workspace.workspaces
export const selectSelectedWorkspace = (state) => state.workspace.selectedWorkspace
export const selectWorkspaceLoading  = (state) => state.workspace.loading

export default workspaceSlice.reducer
