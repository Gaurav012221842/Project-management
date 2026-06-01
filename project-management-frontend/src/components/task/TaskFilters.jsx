// src/components/task/TaskFilters.jsx
import React from 'react'
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_PRIORITY, TASK_PRIORITY_LABELS } from '../../constants/taskConstants'

function TaskFilters({ filters = {}, onChange }) {
  const update = (key, val) => onChange?.({ ...filters, [key]: val })

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filters.status || ''}
        onChange={e => update('status', e.target.value)}
        className="text-sm rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Status</option>
        {Object.values(TASK_STATUS).map(s => (
          <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
        ))}
      </select>

      <select
        value={filters.priority || ''}
        onChange={e => update('priority', e.target.value)}
        className="text-sm rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Priorities</option>
        {Object.values(TASK_PRIORITY).map(p => (
          <option key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</option>
        ))}
      </select>
    </div>
  )
}

export default TaskFilters
