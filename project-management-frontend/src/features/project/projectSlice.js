// src/features/project/projectSlice.js
import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import projectService
  from '../../services/api/projectService'
import toast from 'react-hot-toast'

// ============================
// Thunks
// ============================
export const fetchProjects = createAsyncThunk(
  'project/fetchAll',
  async (
    { page = 0, size = 12 } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await projectService
        .getProjects({ page, size })
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchProjectById = createAsyncThunk(
  'project/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await projectService
        .getProjectById(id)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createProject = createAsyncThunk(
  'project/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await projectService
        .createProject(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProject = createAsyncThunk(
  'project/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await projectService
        .updateProject(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteProject = createAsyncThunk(
  'project/delete',
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchProjectStats = createAsyncThunk(
  'project/fetchStats',
  async (id, { rejectWithValue }) => {
    try {
      const res = await projectService
        .getProjectStats(id)
      return { id, stats: res.data }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const addProjectMember = createAsyncThunk(
  'project/addMember',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await projectService
        .addMember(projectId, data)
      return { projectId, member: res.data }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const removeProjectMember = createAsyncThunk(
  'project/removeMember',
  async (
    { projectId, userId },
    { rejectWithValue }
  ) => {
    try {
      await projectService
        .removeMember(projectId, userId)
      return { projectId, userId }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ============================
// Slice
// ============================
const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects:       [],
    selectedProject: null,
    stats:          {},
    loading:        false,
    createLoading:  false,
    updateLoading:  false,
    deleteLoading:  false,
    error:          null,
    totalPages:     0,
    currentPage:    0,
    totalElements:  0,
    viewMode:       'grid',
    filters: {
      status:  'ALL',
      search:  '',
      sortBy:  'createdAt',
      sortDir: 'desc',
    },
  },
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
    },
    clearFilters: (state) => {
      state.filters = {
        status:  'ALL',
        search:  '',
        sortBy:  'createdAt',
        sortDir: 'desc',
      }
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch All
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action) => {
          state.loading       = false
          state.projects      = action.payload.content
          state.totalPages    = action.payload.totalPages
          state.currentPage   = action.payload.currentPage
          state.totalElements = action.payload.totalElements
        }
      )
      .addCase(
        fetchProjects.rejected,
        (state, action) => {
          state.loading = false
          state.error   = action.payload
        }
      )

      // Fetch By ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true
      })
      .addCase(
        fetchProjectById.fulfilled,
        (state, action) => {
          state.loading        = false
          state.selectedProject = action.payload
        }
      )
      .addCase(fetchProjectById.rejected, (state) => {
        state.loading = false
      })

      // Create
      .addCase(createProject.pending, (state) => {
        state.createLoading = true
      })
      .addCase(
        createProject.fulfilled,
        (state, action) => {
          state.createLoading = false
          state.projects.unshift(action.payload)
          toast.success('Project created! 🎉')
        }
      )
      .addCase(
        createProject.rejected,
        (state, action) => {
          state.createLoading = false
          state.error         = action.payload
          toast.error(
            action.payload || 'Failed to create'
          )
        }
      )

      // Update
      .addCase(updateProject.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(
        updateProject.fulfilled,
        (state, action) => {
          state.updateLoading = false
          const idx = state.projects.findIndex(
            p => p.id === action.payload.id
          )
          if (idx !== -1) {
            state.projects[idx] = action.payload
          }
          if (
            state.selectedProject?.id ===
            action.payload.id
          ) {
            state.selectedProject = action.payload
          }
          toast.success('Project updated!')
        }
      )
      .addCase(updateProject.rejected, (state) => {
        state.updateLoading = false
      })

      // Delete
      .addCase(deleteProject.pending, (state) => {
        state.deleteLoading = true
      })
      .addCase(
        deleteProject.fulfilled,
        (state, action) => {
          state.deleteLoading = false
          state.projects = state.projects.filter(
            p => p.id !== action.payload
          )
          toast.success('Project deleted!')
        }
      )
      .addCase(deleteProject.rejected, (state) => {
        state.deleteLoading = false
      })

      // Fetch Stats
      .addCase(
        fetchProjectStats.fulfilled,
        (state, action) => {
          state.stats[action.payload.id] =
            action.payload.stats
        }
      )

      // Add Member
      .addCase(
        addProjectMember.fulfilled,
        (state, action) => {
          const project = state.projects.find(
            p => p.id === action.payload.projectId
          )
          if (project) {
            project.members?.push(
              action.payload.member
            )
          }
          toast.success('Member added!')
        }
      )

      // Remove Member
      .addCase(
        removeProjectMember.fulfilled,
        (state, action) => {
          const project = state.projects.find(
            p => p.id === action.payload.projectId
          )
          if (project) {
            project.members = project.members
              ?.filter(
                m => m.id !== action.payload.userId
              )
          }
          toast.success('Member removed!')
        }
      )
  },
})

export const {
  setSelectedProject,
  setViewMode,
  setFilters,
  clearFilters,
  clearSelectedProject,
} = projectSlice.actions

// Selectors
export const selectProjects =
  (state) => state.project.projects

export const selectSelectedProject =
  (state) => state.project.selectedProject

export const selectProjectStats =
  (id) => (state) => state.project.stats[id]

export const selectProjectLoading =
  (state) => state.project.loading

export const selectCreateLoading =
  (state) => state.project.createLoading

export const selectUpdateLoading =
  (state) => state.project.updateLoading

export const selectViewMode =
  (state) => state.project.viewMode

export const selectProjectFilters =
  (state) => state.project.filters

export const selectTotalElements =
  (state) => state.project.totalElements

export const selectFilteredProjects =
  (state) => {
    const { projects, filters } = state.project
    return projects
      .filter(p => {
        const matchStatus =
          filters.status === 'ALL' ||
          p.status === filters.status
        const matchSearch =
          !filters.search ||
          p.name.toLowerCase().includes(
            filters.search.toLowerCase()
          )
        return matchStatus && matchSearch
      })
  }

export default projectSlice.reducer