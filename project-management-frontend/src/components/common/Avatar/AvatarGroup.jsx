// src/components/common/Avatar/AvatarGroup.jsx
import React from 'react'
import Avatar from './Avatar'

function AvatarGroup({ users = [], max = 4, size = 'sm' }) {
  const visible  = users.slice(0, max)
  const overflow = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <div key={user.id || i} className="ring-2 ring-white rounded-full">
          <Avatar name={user.name || user.username} src={user.avatarUrl} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
          +{overflow}
        </div>
      )}
    </div>
  )
}

export default AvatarGroup
