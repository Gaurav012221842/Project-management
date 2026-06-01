// src/components/task/TaskStatusBadge.jsx
import React from 'react'
import { TASK_STATUS_LABELS } from '../../constants/taskConstants'
import { statusToBadgeClass } from '../../utils/colorUtils'

function TaskStatusBadge({ status, size = 'sm' }) {
  if (!status) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium text-xs ${statusToBadgeClass(status)}`}>
      {TASK_STATUS_LABELS[status] || status}
    </span>
  )
}

export default TaskStatusBadge
