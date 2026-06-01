// src/components/notification/NotificationEmpty.jsx
import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'

function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BellIcon className="w-10 h-10 text-gray-300 mb-3" />
      <p className="text-sm font-medium text-gray-500">No notifications</p>
      <p className="text-xs text-gray-400 mt-1">You&apos;re all caught up!</p>
    </div>
  )
}

export default NotificationEmpty
