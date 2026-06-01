// src/constants/taskConstants.js
export const TASK_STATUS = {
  TODO:        'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW:   'IN_REVIEW',
  DONE:        'DONE',
}

export const TASK_STATUS_LABELS = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW:   'In Review',
  DONE:        'Done',
}

export const TASK_PRIORITY = {
  LOW:    'LOW',
  MEDIUM: 'MEDIUM',
  HIGH:   'HIGH',
  URGENT: 'URGENT',
}

export const TASK_PRIORITY_LABELS = {
  LOW:    'Low',
  MEDIUM: 'Medium',
  HIGH:   'High',
  URGENT: 'Urgent',
}

export const TASK_TYPE = {
  STORY: 'STORY',
  BUG:   'BUG',
  TASK:  'TASK',
  EPIC:  'EPIC',
}

export const TASK_TYPE_LABELS = {
  STORY: 'Story',
  BUG:   'Bug',
  TASK:  'Task',
  EPIC:  'Epic',
}

export const STATUS_COLUMNS = [
  { id: TASK_STATUS.TODO,        label: TASK_STATUS_LABELS.TODO,        color: 'bg-gray-200'   },
  { id: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS.IN_PROGRESS, color: 'bg-blue-200'  },
  { id: TASK_STATUS.IN_REVIEW,   label: TASK_STATUS_LABELS.IN_REVIEW,   color: 'bg-yellow-200'},
  { id: TASK_STATUS.DONE,        label: TASK_STATUS_LABELS.DONE,        color: 'bg-green-200' },
]
