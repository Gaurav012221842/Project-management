// src/components/workspace/WorkspaceMembers.jsx
import React from 'react'
import Avatar from '../common/Avatar/Avatar'
import Badge  from '../common/Badge/Badge'

function WorkspaceMembers({ members = [] }) {
  if (!members.length) {
    return <p className="text-sm text-gray-400">No members found.</p>
  }

  return (
    <div className="space-y-2">
      {members.map(member => (
        <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <Avatar name={member.name || member.username} src={member.avatarUrl} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{member.name || member.username}</p>
            <p className="text-xs text-gray-400 truncate">{member.email}</p>
          </div>
          <Badge variant={member.role === 'OWNER' ? 'primary' : 'default'} className="capitalize">
            {(member.role || 'member').toLowerCase()}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export default WorkspaceMembers
