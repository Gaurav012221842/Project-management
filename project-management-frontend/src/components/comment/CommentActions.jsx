// src/components/comment/CommentActions.jsx
import React from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

function CommentActions({ onEdit, onDelete, canEdit = false, canDelete = false }) {
  if (!canEdit && !canDelete) return null
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {canEdit && (
        <button
          onClick={onEdit}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="Edit"
        >
          <PencilIcon className="w-3.5 h-3.5" />
        </button>
      )}
      {canDelete && (
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

export default CommentActions
