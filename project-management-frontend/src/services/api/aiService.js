// src/services/api/aiService.js
import api from './axiosInstance'

const aiService = {

  generateDescription: (data) =>
    api.post(
      '/api/v1/ai/generate-description',
      data
    ),

  suggestPriority: (data) =>
    api.post('/api/v1/ai/suggest-priority', data),

  suggestAssignee: (data) =>
    api.post('/api/v1/ai/suggest-assignee', data),

  analyzeBug: (data) =>
    api.post('/api/v1/ai/analyze-bug', data),

  generateSprintGoal: (data) =>
    api.post(
      '/api/v1/ai/generate-sprint-goal',
      data
    ),

  estimateStoryPoints: (data) =>
    api.post(
      '/api/v1/ai/estimate-story-points',
      data
    ),

  generateSubTasks: (data) =>
    api.post(
      '/api/v1/ai/generate-subtasks',
      data
    ),

  chat: (data) =>
    api.post('/api/v1/ai/chat', data),

  summarizeProject: (data) =>
    api.post(
      '/api/v1/ai/summarize-project',
      data
    ),
}

export default aiService