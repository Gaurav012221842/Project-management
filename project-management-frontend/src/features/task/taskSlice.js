// src/features/task/taskSlice.js
import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import taskService
  from '../../services/api/taskService'
import toast from 'react-hot-toast'

// ============================
// Thunks
// ============================
export const fetchProjectTasks = createAsyncThunk(
  'task/fetchProjectTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await taskService
        .getProjectTasks(projectId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchTaskById = createAsyncThunk(
  'task/fetchById',
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await taskService
        .getTaskById(taskId)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createTask = createAsyncThunk(
  'task/create',
  async (
    { projectId, taskData },
    { rejectWithValue }
  ) => {
    try {
      const res = await taskService
        .createTask(projectId, taskData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateTask = createAsyncThunk(
  'task/update',
  async (
    { taskId, data },
    { rejectWithValue }
  ) => {
    try {
      const res = await taskService
        .updateTask(taskId, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateTaskStatus = createAsyncThunk(
  'task/updateStatus',
  async (
    { taskId, statusData },
    { rejectWithValue }
  ) => {
    try {
      const res = await taskService
        .updateTaskStatus(taskId, statusData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'task/delete',
  async (taskId, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(taskId)
      return taskId
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const assignTask = createAsyncThunk(
  'task/assign',
  async (
    { taskId, userId },
    { rejectWithValue }
  ) => {
    try {
      const res = await taskService
        .assignTask(taskId, { userId })
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// SubTasks
export const createSubTask = createAsyncThunk(
  'task/createSubTask',
  async (
    { taskId, title },
    { rejectWithValue }
  ) => {
    try {
      const res = await taskService
        .createSubTask(taskId, { title })
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateSubTask = createAsyncThunk(
  'task/updateSubTask',
  async (
    { taskId, subTaskId, data },
    { rejectWithValue }
  ) => {
    try {
      const res = await taskService
        .updateSubTask(taskId, subTaskId, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteSubTask = createAsyncThunk(
  'task/deleteSubTask',
  async (
    { taskId, subTaskId },
    { rejectWithValue }
  ) => {
    try {
      await taskService
        .deleteSubTask(taskId, subTaskId)
      return { taskId, subTaskId }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Comments
export const fetchComments = createAsyncThunk(
  'task/fetchComments',
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await taskService
        .getTaskComments(taskId)
      return { taskId, comments: res.data }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const addComment = createAsyncThunk(
  'task/addComment',
  async (
    { taskId, content, parentId },
    { rejectWithValue }
  ) => {
    try {
      const res = await taskService
        .addComment(taskId, { content, parentId })
      return { taskId, comment: res.data }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteComment = createAsyncThunk(
  'task/deleteComment',
  async (
    { taskId, commentId },
    { rejectWithValue }
  ) => {
    try {
      await taskService
        .deleteComment(taskId, commentId)
      return { taskId, commentId }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Attachments
export const uploadAttachment = createAsyncThunk(
  'task/uploadAttachment',
  async (
    { taskId, formData },
    { rejectWithValue }
  ) => {
    try {
      const res = await taskService
        .uploadAttachment(taskId, formData)
      return { taskId, attachment: res.data }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteAttachment = createAsyncThunk(
  'task/deleteAttachment',
  async (
    { taskId, attachmentId },
    { rejectWithValue }
  ) => {
    try {
      await taskService
        .deleteAttachment(taskId, attachmentId)
      return { taskId, attachmentId }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ============================
// Slice
// ============================
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks:           [],
    selectedTask:    null,
    comments:        {},
    loading:         false,
    taskLoading:     false,
    createLoading:   false,
    updateLoading:   false,
    commentLoading:  false,
    uploadLoading:   false,
    error:           null,
    filters: {
      status:   null,
      priority: null,
      assignee: null,
      sprint:   null,
      search:   '',
    },
  },
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
    },
    clearFilters: (state) => {
      state.filters = {
        status:   null,
        priority: null,
        assignee: null,
        sprint:   null,
        search:   '',
      }
    },
    updateTaskStatusOptimistic: (state, action) => {
      const { taskId, status } = action.payload
      const task = state.tasks.find(
        t => t.id === taskId
      )
      if (task) task.status = status
      if (state.selectedTask?.id === taskId) {
        state.selectedTask.status = status
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Tasks
      .addCase(
        fetchProjectTasks.pending,
        (state) => {
          state.loading = true
          state.error   = null
        }
      )
      .addCase(
        fetchProjectTasks.fulfilled,
        (state, action) => {
          state.loading = false

          state.tasks = Array.isArray(action.payload)
            ? action.payload
            : action.payload?.content || []
        }
      )
      .addCase(
        fetchProjectTasks.rejected,
        (state, action) => {
          state.loading = false
          state.error   = action.payload
        }
      )

      // Fetch By ID
      .addCase(fetchTaskById.pending, (state) => {
        state.taskLoading = true
      })
      .addCase(
        fetchTaskById.fulfilled,
        (state, action) => {
          state.taskLoading  = false
          state.selectedTask = action.payload
        }
      )
      .addCase(fetchTaskById.rejected, (state) => {
        state.taskLoading = false
      })

      // Create
      .addCase(createTask.pending, (state) => {
        state.createLoading = true
      })
      .addCase(
        createTask.fulfilled,
        (state, action) => {
          state.createLoading = false
          state.tasks.push(action.payload)
          toast.success('Task created! ✅')
        }
      )
      .addCase(
        createTask.rejected,
        (state, action) => {
          state.createLoading = false
          toast.error(
            action.payload || 'Failed to create task'
          )
        }
      )

      // Update
      .addCase(updateTask.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(
        updateTask.fulfilled,
        (state, action) => {
          state.updateLoading = false
          const idx = state.tasks.findIndex(
            t => t.id === action.payload.id
          )
          if (idx !== -1) {
            state.tasks[idx] = action.payload
          }
          if (
            state.selectedTask?.id ===
            action.payload.id
          ) {
            state.selectedTask = action.payload
          }
          toast.success('Task updated!')
        }
      )
      .addCase(updateTask.rejected, (state) => {
        state.updateLoading = false
      })

      // Delete
      .addCase(
        deleteTask.fulfilled,
        (state, action) => {
          state.tasks = state.tasks.filter(
            t => t.id !== action.payload
          )
          if (
            state.selectedTask?.id === action.payload
          ) {
            state.selectedTask = null
          }
          toast.success('Task deleted!')
        }
      )

      // Update Status
      .addCase(
        updateTaskStatus.fulfilled,
        (state, action) => {
          const idx = state.tasks.findIndex(
            t => t.id === action.payload.id
          )
          if (idx !== -1) {
            state.tasks[idx] = {
              ...state.tasks[idx],
              ...action.payload,
            }
          }
          if (
            state.selectedTask?.id ===
            action.payload.id
          ) {
            state.selectedTask = {
              ...state.selectedTask,
              ...action.payload,
            }
          }
        }
      )

      // Assign
      .addCase(
        assignTask.fulfilled,
        (state, action) => {
          const idx = state.tasks.findIndex(
            t => t.id === action.payload.id
          )
          if (idx !== -1) {
            state.tasks[idx] = action.payload
          }
          if (
            state.selectedTask?.id ===
            action.payload.id
          ) {
            state.selectedTask = action.payload
          }
          toast.success('Task assigned!')
        }
      )

      // Create SubTask
      .addCase(
        createSubTask.fulfilled,
        (state, action) => {
          if (state.selectedTask) {
            state.selectedTask.subTasks = [
              ...(state.selectedTask.subTasks || []),
              action.payload,
            ]
          }
        }
      )

      // Update SubTask
      .addCase(
        updateSubTask.fulfilled,
        (state, action) => {
          if (state.selectedTask?.subTasks) {
            const idx =
              state.selectedTask.subTasks
                .findIndex(
                  s => s.id === action.payload.id
                )
            if (idx !== -1) {
              state.selectedTask
                .subTasks[idx] = action.payload
            }
          }
        }
      )

      // Delete SubTask
      .addCase(
        deleteSubTask.fulfilled,
        (state, action) => {
          if (state.selectedTask?.subTasks) {
            state.selectedTask.subTasks =
              state.selectedTask.subTasks.filter(
                s => s.id !==
                  action.payload.subTaskId
              )
          }
        }
      )

      // Fetch Comments
      .addCase(
        fetchComments.fulfilled,
        (state, action) => {
          state.comments[action.payload.taskId] =
            action.payload.comments
        }
      )

      // Add Comment
      .addCase(
        addComment.pending,
        (state) => {
          state.commentLoading = true
        }
      )
      .addCase(
        addComment.fulfilled,
        (state, action) => {
          state.commentLoading = false
          const { taskId, comment } = action.payload
          if (!state.comments[taskId]) {
            state.comments[taskId] = []
          }
          state.comments[taskId].push(comment)
          if (state.selectedTask?.id === taskId) {
            state.selectedTask.commentsCount =
              (state.selectedTask.commentsCount || 0) + 1
          }
        }
      )
      .addCase(
        addComment.rejected,
        (state) => {
          state.commentLoading = false
        }
      )

      // Delete Comment
      .addCase(
        deleteComment.fulfilled,
        (state, action) => {
          const { taskId, commentId } = action.payload
          if (state.comments[taskId]) {
            state.comments[taskId] =
              state.comments[taskId].filter(
                c => c.id !== commentId
              )
          }
          if (state.selectedTask?.id === taskId) {
            state.selectedTask.commentsCount =
              Math.max(
                0,
                (state.selectedTask.commentsCount || 1) - 1
              )
          }
        }
      )

      // Upload Attachment
      .addCase(
        uploadAttachment.pending,
        (state) => {
          state.uploadLoading = true
        }
      )
      .addCase(
        uploadAttachment.fulfilled,
        (state, action) => {
          state.uploadLoading = false
          const { taskId, attachment } = action.payload
          if (state.selectedTask?.id === taskId) {
            state.selectedTask.attachments = [
              ...(state.selectedTask.attachments || []),
              attachment,
            ]
            state.selectedTask.attachmentsCount =
              (state.selectedTask.attachmentsCount || 0) + 1
          }
          toast.success('File uploaded!')
        }
      )
      .addCase(
        uploadAttachment.rejected,
        (state) => {
          state.uploadLoading = false
          toast.error('Upload failed')
        }
      )

      // Delete Attachment
      .addCase(
        deleteAttachment.fulfilled,
        (state, action) => {
          const { taskId, attachmentId } = action.payload
          if (state.selectedTask?.id === taskId) {
            state.selectedTask.attachments =
              state.selectedTask.attachments?.filter(
                a => a.id !== attachmentId
              )
            state.selectedTask.attachmentsCount =
              Math.max(
                0,
                (state.selectedTask.attachmentsCount || 1) - 1
              )
          }
        }
      )
  },
})

export const {
  setSelectedTask,
  clearSelectedTask,
  setFilters,
  clearFilters,
  updateTaskStatusOptimistic,
} = taskSlice.actions

// Selectors
export const selectTasks =
  (state) => state.task.tasks

export const selectSelectedTask =
  (state) => state.task.selectedTask

export const selectTaskComments =
  (taskId) => (state) =>
    state.task.comments[taskId] || []

export const selectTaskLoading =
  (state) => state.task.loading

export const selectCreateLoading =
  (state) => state.task.createLoading

export const selectUpdateLoading =
  (state) => state.task.updateLoading

export const selectCommentLoading =
  (state) => state.task.commentLoading

export const selectUploadLoading =
  (state) => state.task.uploadLoading

export const selectTaskFilters =
  (state) => state.task.filters

export const selectFilteredTasks = (state) => {
  const { tasks, filters } = state.task

  const taskList = Array.isArray(tasks)
    ? tasks
    : []

  return taskList.filter(task => {
    const matchStatus =
      !filters.status ||
      task.status === filters.status

    const matchPriority =
      !filters.priority ||
      task.priority === filters.priority

    const matchSearch =
      !filters.search ||
      task.title?.toLowerCase().includes(
        filters.search.toLowerCase()
      )

    return (
      matchStatus &&
      matchPriority &&
      matchSearch
    )
  })
}

export const selectTasksByStatus =
  (status) => (state) =>
    (state.task.tasks || []).filter(
      t => t.status === status
    )

export default taskSlice.reducer