// src/components/layout/Navbar/NavbarNotifications.jsx
import React, { useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { useSelector } from 'react-redux'
import { selectUnreadCount } from '../../../features/notification/notificationSlice'

function NavbarNotifications() {
  const unread = useSelector(selectUnreadCount)
  return (
    <div className="relative">
      <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
        <BellIcon className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </div>
  )
}

export default NavbarNotifications
