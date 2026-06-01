// src/components/board/AddTaskButton.jsx
import React from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'

function AddTaskButton({ onClick, label = 'Add task' }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors group"
    >
      <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
      {label}
    </button>
  )
}

export default AddTaskButton
