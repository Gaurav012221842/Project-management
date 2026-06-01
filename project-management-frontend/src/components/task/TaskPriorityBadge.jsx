// src/components/task/TaskPriorityBadge.jsx
import React from 'react'
import { TASK_PRIORITY_LABELS } from '../../constants/taskConstants'
import { priorityToBadgeClass } from '../../utils/colorUtils'

const DOTS = { LOW: '\u25CF', MEDIUM: '\u25CF', HIGH: '\u25CF', URGENT: '\u25CF' }
const DOT_COLORS = { LOW: 'text-green-500', MEDIUM: 'text-yellow-500', HIGH: 'text-orange-500', URGENT: 'text-red-500' }

function TaskPriorityBadge({ priority }) {
  if (!priority) return null
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityToBadgeClass(priority)}`}>
      <span className={DOT_COLORS[priority]}>{DOTS[priority]}</span>
      {TASK_PRIORITY_LABELS[priority] || priority}
    </span>
  )
}

export default TaskPriorityBadge
