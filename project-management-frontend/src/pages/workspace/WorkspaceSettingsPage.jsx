import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  selectWorkspaces,
} from '../../features/workspace/workspaceSlice'

import WorkspaceMembers from '../../components/workspace/WorkspaceMembers'
import InviteMemberModal from '../../components/workspace/InviteMemberModal'
import EditWorkspaceModal from '../../components/workspace/EditWorkspaceModal'

import Button from '../../components/common/Button/Button'

import {
  UserPlusIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'

function WorkspaceSettingsPage() {
  const { workspaceId } = useParams()

  const workspaces = useSelector(selectWorkspaces)

  const workspace = useMemo(
    () =>
      workspaces.find(
        w => String(w.id) === String(workspaceId)
      ),
    [workspaces, workspaceId]
  )

  const [inviteOpen, setInviteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  if (!workspace) {
    return (
      <div className="p-6 text-center text-gray-500">
        Workspace not found
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          {workspace.name} — Settings
        </h1>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<PencilIcon className="w-4 h-4" />}
          onClick={() => setEditOpen(true)}
        >
          Edit
        </Button>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            Members
          </h2>

          <Button
            size="sm"
            leftIcon={<UserPlusIcon className="w-4 h-4" />}
            onClick={() => setInviteOpen(true)}
          >
            Invite
          </Button>
        </div>

        <WorkspaceMembers
          members={workspace.members || []}
        />
      </section>

      <InviteMemberModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        workspaceId={workspace.id}
      />

      <EditWorkspaceModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        workspace={workspace}
      />
    </div>
  )
}

export default WorkspaceSettingsPage