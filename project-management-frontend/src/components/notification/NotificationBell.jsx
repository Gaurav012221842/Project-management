// src/components/notification/NotificationBell.jsx
import { useState, useRef, useEffect }
  from 'react'
import { useDispatch, useSelector }
  from 'react-redux'
import { motion, AnimatePresence }
  from 'framer-motion'
import { BellIcon }
  from '@heroicons/react/24/outline'
import { BellIcon as BellSolid }
  from '@heroicons/react/24/solid'
import NotificationPanel
  from './NotificationPanel'
import {
  fetchNotifications,
  selectUnreadCount,
} from '../../features/notification/notificationSlice'
import { useNotification }
  from '../../hooks/useNotification'

export default function NotificationBell() {
  const dispatch    = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const bellRef             = useRef(null)
  const unreadCount = useSelector(selectUnreadCount)

  // Connect WebSocket for live notifications
  useNotification()

  // ============================
  // Open Panel & Fetch
  // ============================
  const handleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      dispatch(fetchNotifications({ page: 0 }))
    }
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener(
      'mousedown',
      handleClickOutside
    )
    return () => document.removeEventListener(
      'mousedown',
      handleClickOutside
    )
  }, [])

  return (
    <div ref={bellRef} className="relative">

      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95  }}
        onClick={handleOpen}
        className={`relative w-10 h-10 flex
                     items-center justify-center
                     rounded-xl transition-colors
                     ${isOpen
                       ? 'bg-indigo-100 ' +
                         'text-indigo-600'
                       : 'text-gray-500 ' +
                         'hover:bg-gray-100 ' +
                         'hover:text-gray-700'
                     }`}
      >
        {/* Bell Icon */}
        {isOpen
          ? <BellSolid className="w-5 h-5" />
          : <BellIcon  className="w-5 h-5" />
        }

        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0   }}
              transition={{
                type:   'spring',
                bounce: 0.5,
              }}
              className="absolute -top-1 -right-1
                           min-w-[18px] h-[18px]
                           bg-red-500 text-white
                           text-[10px] font-bold
                           rounded-full flex items-center
                           justify-center px-1
                           border-2 border-white"
            >
              {unreadCount > 99
                ? '99+'
                : unreadCount
              }
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Ring for new notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1
                            w-[18px] h-[18px]
                            bg-red-400 rounded-full
                            opacity-75 animate-ping" />
        )}
      </motion.button>

      {/* Notification Panel Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <NotificationPanel
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}