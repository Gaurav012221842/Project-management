// src/components/task/SubTaskList.jsx
import React from 'react'
import SubTaskItem from './SubTaskItem'

function SubTaskList({ subTasks = [], onToggle }) {
  if (!subTasks.length) return null

  const done    = subTasks.filter(t => t.completed).length
  const total   = subTasks.length
  const percent = Math.round((done / total) * 100)

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{done}/{total}</span>
      </div>
      {subTasks.map(t => (
        <SubTaskItem key={t.id} task={t} onToggle={onToggle} />
      ))}
    </div>
  )
}

export default SubTaskList
