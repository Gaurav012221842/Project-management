// src/components/workspace/WorkspaceCard.jsx
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedWorkspace } from '../../features/workspace/workspaceSlice'
import { FolderIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { formatDate } from '../../utils/dateUtils'

function WorkspaceCard({ workspace, selected = false }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSelect = () => {
    dispatch(setSelectedWorkspace(workspace))
  }

  const goToSettings = (e) => {
    e.stopPropagation() // IMPORTANT: prevents card click
    navigate(`/workspaces/${workspace.id}/settings`)
  }

  return (
    <div className="relative w-full">
      
      {/* Main Card */}
      <button
        onClick={handleSelect}
        className={`w-full text-left p-4 pr-12 rounded-xl border-2 transition-all ${
          selected
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm'
        }`}
      >
        <div className="flex items-start gap-3">

          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <FolderIcon className="w-5 h-5 text-indigo-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {workspace.name}
            </p>

            {workspace.description && (
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {workspace.description}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-1">
              {formatDate(workspace.createdAt)}
            </p>
          </div>
        </div>
      </button>

      {/* Settings Button (Option 1 Trigger) */}
      <button
        onClick={goToSettings}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   p-2 rounded-lg text-gray-400
                   hover:text-indigo-600 hover:bg-indigo-50
                   transition-colors"
        title="Workspace Settings"
      >
        <Cog6ToothIcon className="w-4 h-4" />
      </button>

    </div>
  )
}

export default WorkspaceCard