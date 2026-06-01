// src/components/task/TaskLabels.jsx
import React from 'react'

const LABEL_COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-pink-100 text-pink-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
]

function TaskLabels({ labels = [], max = 3 }) {
  if (!labels.length) return null
  const visible  = labels.slice(0, max)
  const overflow = labels.length - max

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((label, i) => (
        <span
          key={label.id || i}
          className={`px-1.5 py-0.5 rounded text-xs font-medium ${LABEL_COLORS[i % LABEL_COLORS.length]}`}
        >
          {label.name || label}
        </span>
      ))}
      {overflow > 0 && (
        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
          +{overflow}
        </span>
      )}
    </div>
  )
}

export default TaskLabels
