// src/components/task/TaskList.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import TaskStatusBadge   from './TaskStatusBadge'
import TaskPriorityBadge from './TaskPriorityBadge'
import TaskAssignee      from './TaskAssignee'
import { formatDate }    from '../../utils/dateUtils'
import EmptyState        from '../common/EmptyState/EmptyState'
import Skeleton          from '../common/Loader/Skeleton'

function TaskList({ tasks = [], loading = false, onTaskClick }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!tasks.length) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Create your first task to get started."
      />
    )
  }

  return (
    <div className="space-y-1.5">
      {tasks.map(task => (
        <button
          key={task.id}
          onClick={() => onTaskClick?.(task)}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm transition-all text-left"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
            {task.dueDate && (
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(task.dueDate)}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge   status={task.status}    />
            <TaskAssignee assignee={task.assignee} size="xs" />
          </div>
        </button>
      ))}
    </div>
  )
}

export default TaskList
