// src/components/task/SubTaskItem.jsx
import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

function SubTaskItem({ task, onToggle }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group">
      <button
        onClick={() => onToggle?.(task.id)}
        className="flex-shrink-0 text-gray-400 hover:text-indigo-600 transition-colors"
      >
        {task.completed
          ? <CheckCircleSolid className="w-5 h-5 text-indigo-600" />
          : <CheckCircleIcon  className="w-5 h-5" />}
      </button>
      <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {task.title}
      </span>
    </div>
  )
}

export default SubTaskItem
