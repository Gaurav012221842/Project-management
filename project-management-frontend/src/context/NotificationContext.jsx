// src/context/NotificationContext.jsx
import React, { createContext, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import {
  selectNotifications,
  selectUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../features/notification/notificationSlice'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const dispatch      = useDispatch()
  const notifications = useSelector(selectNotifications)
  const unreadCount   = useSelector(selectUnreadCount)

  const markRead    = (id) => dispatch(markAsRead(id))
  const markAllRead = ()   => dispatch(markAllAsRead())
  const showToast   = (message, type = 'success') => toast[type](message)

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, showToast }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotificationContext must be inside NotificationProvider')
  return ctx
}

export default NotificationContext
