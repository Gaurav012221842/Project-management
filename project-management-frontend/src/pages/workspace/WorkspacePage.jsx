// src/pages/workspace/WorkspacePage.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchWorkspaces } from '../../features/workspace/workspaceSlice'
import WorkspaceList         from '../../components/workspace/WorkspaceList'
import CreateWorkspaceModal  from '../../components/workspace/CreateWorkspaceModal'
import Button from '../../components/common/Button/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

function WorkspacePage() {
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { dispatch(fetchWorkspaces()) }, [dispatch])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Workspaces</h1>
        <Button leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          New Workspace
        </Button>
      </div>

      <WorkspaceList onCreateNew={() => setModalOpen(true)} />

      <CreateWorkspaceModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); dispatch(fetchWorkspaces()) }}
      />
    </div>
  )
}

export default WorkspacePage
