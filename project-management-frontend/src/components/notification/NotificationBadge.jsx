// src/components/notification/NotificationBadge.jsx
import React from 'react'

function NotificationBadge({ count, className = '' }) {
  if (!count || count <= 0) return null
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default NotificationBadge
