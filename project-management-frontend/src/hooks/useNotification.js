// src/hooks/useNotification.js
import {
  useEffect,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import socketClient  from '../services/websocket/socketClient'
import { SOCKET_EVENTS }
  from '../services/websocket/socketEvents'
import {
  addNotification,
  setUnreadCount,
  fetchUnreadCount,
  selectUnreadCount,
} from '../features/notification/notificationSlice'
import { selectUser }
  from '../features/auth/authSlice'

export function useNotification() {
  const dispatch    = useDispatch()
  const user        = useSelector(selectUser)
  const unreadCount = useSelector(selectUnreadCount)

  // ============================
  // Subscribe to WS Notifications
  // ============================
  useEffect(() => {
    if (!user) return

    // Fetch initial count
    dispatch(fetchUnreadCount())

    // Subscribe to real-time notifications
    const subscribeNotifications = () => {
      socketClient.subscribe(
        SOCKET_EVENTS.NOTIFICATION.RECEIVE,
        (notification) => {
          dispatch(addNotification(notification))
        }
      )

      // Subscribe to count updates
      socketClient.subscribe(
        '/user/queue/notifications/count',
        (count) => {
          dispatch(setUnreadCount(count))
        }
      )
    }

    if (socketClient.isConnected()) {
      subscribeNotifications()
    } else {
      socketClient.connect(() => {
        subscribeNotifications()
      })
    }

    return () => {
      socketClient.unsubscribe(
        SOCKET_EVENTS.NOTIFICATION.RECEIVE
      )
      socketClient.unsubscribe(
        '/user/queue/notifications/count'
      )
    }
  }, [user, dispatch])

  return { unreadCount }
}