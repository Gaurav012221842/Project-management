// src/components/workspace/WorkspaceList.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { selectWorkspaces, selectSelectedWorkspace, selectWorkspaceLoading } from '../../features/workspace/workspaceSlice'
import WorkspaceCard from './WorkspaceCard'
import Skeleton      from '../common/Loader/Skeleton'
import EmptyState    from '../common/EmptyState/EmptyState'
import { FolderIcon } from '@heroicons/react/24/outline'

function WorkspaceList({ onCreateNew }) {
  const workspaces = useSelector(selectWorkspaces)
  const selected   = useSelector(selectSelectedWorkspace)
  const loading    = useSelector(selectWorkspaceLoading)

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    )
  }

  if (!workspaces.length) {
    return (
      <EmptyState
        icon={<FolderIcon className="w-full h-full" />}
        title="No workspaces"
        description="Create a workspace to organize your projects."
        action={onCreateNew && (
          <button onClick={onCreateNew} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
            Create Workspace
          </button>
        )}
      />
    )
  }

  return (
    <div className="space-y-2">
      {workspaces.map(ws => (
        <WorkspaceCard key={ws.id} workspace={ws} selected={selected?.id === ws.id} />
      ))}
    </div>
  )
}

export default WorkspaceList
