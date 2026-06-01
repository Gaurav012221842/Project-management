// src/services/api/analyticsService.js
import api from './axiosInstance'

const analyticsService = {

  getProjectOverview: (projectId) =>
    api.get(
      `/api/v1/analytics/projects/${projectId}/overview`
    ),

  getBurndown: (projectId, sprintId) =>
    api.get(
      `/api/v1/analytics/projects/${projectId}/burndown`,
      { params: { sprintId } }
    ),

  getVelocity: (projectId) =>
    api.get(
      `/api/v1/analytics/projects/${projectId}/velocity`
    ),

  getTeamPerformance: (projectId) =>
    api.get(
      `/api/v1/analytics/projects/${projectId}/team-performance`
    ),

  getWeeklyProgress: (projectId, weeks = 8) =>
    api.get(
      `/api/v1/analytics/projects/${projectId}/weekly-progress`,
      { params: { weeks } }
    ),

  getTaskDistribution: (projectId) =>
    api.get(
      `/api/v1/analytics/projects/${projectId}/task-distribution`
    ),
}

export default analyticsService