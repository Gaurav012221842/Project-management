// src/components/project/ProjectProgress.jsx
import React from 'react'

function ProjectProgress({ done = 0, total = 0, label = 'Tasks' }) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-700">{percent}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">{done} / {total} completed</p>
    </div>
  )
}

export default ProjectProgress
