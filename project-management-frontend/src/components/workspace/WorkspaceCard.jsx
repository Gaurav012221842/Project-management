// src/components/workspace/WorkspaceCard.jsx
import React from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedWorkspace } from '../../features/workspace/workspaceSlice'
import { FolderIcon } from '@heroicons/react/24/outline'
import { formatDate } from '../../utils/dateUtils'

function WorkspaceCard({ workspace, selected = false }) {
  const dispatch = useDispatch()

  return (
    <button
      onClick={() => dispatch(setSelectedWorkspace(workspace))}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <FolderIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{workspace.name}</p>
          {workspace.description && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{workspace.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{formatDate(workspace.createdAt)}</p>
        </div>
      </div>
    </button>
  )
}

export default WorkspaceCard
