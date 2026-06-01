// src/components/common/EmptyState/EmptyState.jsx
import React from 'react'

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 mb-4 text-gray-300">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>}
      {action && action}
    </div>
  )
}

export default EmptyState
