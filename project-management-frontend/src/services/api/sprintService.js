// src/services/api/sprintService.js
import api from './axiosInstance'

const sprintService = {

  getSprints: (projectId) =>
    api.get(
      `/api/v1/projects/${projectId}/sprints`
    ),

  getSprintById: (projectId, sprintId) =>
    api.get(
      `/api/v1/projects/${projectId}/sprints/${sprintId}`
    ),

  createSprint: (projectId, data) =>
    api.post(
      `/api/v1/projects/${projectId}/sprints`,
      data
    ),

  updateSprint: (projectId, sprintId, data) =>
    api.put(
      `/api/v1/projects/${projectId}/sprints/${sprintId}`,
      data
    ),

  deleteSprint: (projectId, sprintId) =>
    api.delete(
      `/api/v1/projects/${projectId}/sprints/${sprintId}`
    ),

  startSprint: (projectId, sprintId) =>
    api.post(
      `/api/v1/projects/${projectId}/sprints/${sprintId}/start`
    ),

  completeSprint: (projectId, sprintId) =>
    api.post(
      `/api/v1/projects/${projectId}/sprints/${sprintId}/complete`
    ),

  getBurndown: (projectId, sprintId) =>
    api.get(
      `/api/v1/projects/${projectId}/sprints/${sprintId}/burndown`
    ),

  moveTaskToSprint: (taskId, sprintId) =>
    api.post(
      `/api/v1/tasks/${taskId}/move-to-sprint`,
      { sprintId }
    ),

  getSprintTasks: (projectId, sprintId) =>
    api.get(
      `/api/v1/projects/${projectId}/sprints/${sprintId}/tasks`
    ),
}

export default sprintService