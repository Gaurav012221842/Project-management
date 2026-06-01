// src/components/task/TaskAssignee.jsx
import React from 'react'
import Avatar from '../common/Avatar/Avatar'
import { AvatarGroup } from '../common/Avatar'

function TaskAssignee({ assignee, assignees, size = 'sm', showName = false }) {
  if (assignees?.length) {
    return <AvatarGroup users={assignees} max={3} size={size} />
  }

  if (!assignee) {
    return (
      <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
        <span className="text-gray-400 text-xs">+</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <Avatar name={assignee.name || assignee.username} src={assignee.avatarUrl} size={size} />
      {showName && <span className="text-xs text-gray-600 truncate max-w-[80px]">{assignee.name || assignee.username}</span>}
    </div>
  )
}

export default TaskAssignee
