// src/components/notification/NotificationPanel.jsx
import { useRef, useEffect, useCallback }
  from 'react'
import { useDispatch, useSelector }
  from 'react-redux'
import { motion }           from 'framer-motion'
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { BellSlashIcon }
  from '@heroicons/react/24/solid'
import NotificationItem    from './NotificationItem'
import {
  fetchNotifications,
  markAllAsRead,
  clearReadNotifications,
  selectNotifications,
  selectNotificationLoading,
  selectHasMoreNotifications,
  selectCurrentNotificationPage,
} from '../../features/notification/notificationSlice'

export default function NotificationPanel({
  onClose
}) {
  const dispatch    = useDispatch()
  const panelRef    = useRef(null)

  const notifications = useSelector(selectNotifications)
  const loading       = useSelector(selectNotificationLoading)
  const hasMore       = useSelector(selectHasMoreNotifications)
  const currentPage   = useSelector(selectCurrentNotificationPage)

  const unreadCount   = notifications
    .filter(n => !n.isRead).length

  // ============================
  // Infinite Scroll
  // ============================
  const handleScroll = useCallback(() => {
    const el = panelRef.current
    if (!el || !hasMore || loading) return

    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight - scrollTop - clientHeight < 50) {
      dispatch(fetchNotifications({
        page: currentPage + 1
      }))
    }
  }, [hasMore, loading, currentPage, dispatch])

  useEffect(() => {
    const el = panelRef.current
    if (el) {
      el.addEventListener('scroll', handleScroll)
      return () =>
        el.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{ opacity: 0, y: 10, scale: 0.96    }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-12
                  w-96 bg-white rounded-2xl
                  shadow-2xl border border-gray-100
                  overflow-hidden z-50"
      style={{ maxHeight: '80vh' }}
    >

      {/* ======================== */}
      {/*         Header           */}
      {/* ======================== */}
      <div className="sticky top-0 bg-white
                       border-b border-gray-100
                       px-4 py-4 z-10">
        <div className="flex items-center
                         justify-between mb-3">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5
                                   text-gray-700" />
            <h3 className="font-bold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5
                                bg-indigo-100
                                text-indigo-700
                                text-xs font-bold
                                rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg
                        text-gray-400
                        hover:text-gray-600
                        hover:bg-gray-100
                        transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="flex items-center gap-1.5
                            px-3 py-1.5 text-xs
                            font-medium text-indigo-600
                            bg-indigo-50
                            hover:bg-indigo-100
                            rounded-lg
                            transition-colors"
              >
                <CheckIcon className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={() =>
                dispatch(clearReadNotifications())
              }
              className="flex items-center gap-1.5
                          px-3 py-1.5 text-xs
                          font-medium text-gray-500
                          bg-gray-100
                          hover:bg-gray-200
                          rounded-lg
                          transition-colors"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              Clear read
            </button>
          </div>
        )}
      </div>

      {/* ======================== */}
      {/*    Notifications List    */}
      {/* ======================== */}
      <div
        ref={panelRef}
        className="overflow-y-auto"
        style={{ maxHeight: '60vh' }}
      >
        {/* Loading State */}
        {loading && notifications.length === 0 && (
          <div className="space-y-1 p-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3
                            p-3 rounded-xl
                            animate-pulse"
              >
                <div className="w-10 h-10 bg-gray-200
                                 rounded-xl
                                 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200
                                   rounded w-3/4" />
                  <div className="h-3 bg-gray-100
                                   rounded w-full" />
                  <div className="h-3 bg-gray-100
                                   rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading &&
         notifications.length === 0 && (
          <div className="flex flex-col items-center
                           justify-center py-16 px-4
                           text-center">
            <div className="w-16 h-16 bg-gray-100
                             rounded-2xl flex
                             items-center
                             justify-center mb-4">
              <BellSlashIcon
                className="w-8 h-8 text-gray-300"
              />
            </div>
            <h4 className="font-semibold
                            text-gray-600 mb-1">
              All caught up! 🎉
            </h4>
            <p className="text-sm text-gray-400">
              No notifications yet
            </p>
          </div>
        )}

        {/* Notification Items */}
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            index={index}
          />
        ))}

        {/* Load More */}
        {loading && notifications.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2
                             text-xs text-gray-400">
              <div className="w-3 h-3 border-2
                               border-indigo-400
                               border-t-transparent
                               rounded-full
                               animate-spin" />
              Loading more...
            </div>
          </div>
        )}

        {/* End of List */}
        {!hasMore && notifications.length > 0 && (
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">
              You've seen all notifications
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}