// src/components/notification/NotificationItem.jsx
import { useDispatch }             from 'react-redux'
import { useNavigate }             from 'react-router-dom'
import { motion }                  from 'framer-motion'
import { formatDistanceToNow }     from 'date-fns'
import { TrashIcon }               from '@heroicons/react/24/outline'
import {
  markAsRead,
  deleteNotification,
} from '../../features/notification/notificationSlice'

// ============================
// Notification Config
// ============================
const NOTIFICATION_CONFIG = {
  TASK_ASSIGNED: {
    icon:      '📋',
    bg:        'bg-indigo-100',
    color:     'text-indigo-600',
    dot:       'bg-indigo-500',
    label:     'Task',
  },
  COMMENT_ADDED: {
    icon:      '💬',
    bg:        'bg-blue-100',
    color:     'text-blue-600',
    dot:       'bg-blue-500',
    label:     'Comment',
  },
  TASK_UPDATED: {
    icon:      '✏️',
    bg:        'bg-yellow-100',
    color:     'text-yellow-600',
    dot:       'bg-yellow-500',
    label:     'Update',
  },
  SPRINT_STARTED: {
    icon:      '🚀',
    bg:        'bg-green-100',
    color:     'text-green-600',
    dot:       'bg-green-500',
    label:     'Sprint',
  },
  MENTION: {
    icon:      '👋',
    bg:        'bg-purple-100',
    color:     'text-purple-600',
    dot:       'bg-purple-500',
    label:     'Mention',
  },
  DEADLINE_REMINDER: {
    icon:      '⏰',
    bg:        'bg-red-100',
    color:     'text-red-600',
    dot:       'bg-red-500',
    label:     'Deadline',
  },
}

export default function NotificationItem({
  notification,
  index,
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const config =
    NOTIFICATION_CONFIG[notification.type] ||
    NOTIFICATION_CONFIG.TASK_UPDATED

  const timeAgo = notification.createdAt
    ? formatDistanceToNow(
        new Date(notification.createdAt),
        { addSuffix: true }
      )
    : ''

  // ============================
  // Handle Click
  // ============================
  const handleClick = () => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification.id))
    }

    // Navigate based on type
    if (notification.referenceId) {
      switch (notification.type) {
        case 'TASK_ASSIGNED':
        case 'COMMENT_ADDED':
        case 'TASK_UPDATED':
        case 'DEADLINE_REMINDER':
          navigate(
            `/tasks/${notification.referenceId}`
          )
          break
        case 'SPRINT_STARTED':
          navigate(
            `/projects/${notification.referenceId}/sprints`
          )
          break
        default:
          break
      }
    }
  }

  // ============================
  // Handle Delete
  // ============================
  const handleDelete = (e) => {
    e.stopPropagation()
    dispatch(deleteNotification(notification.id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0   }}
      transition={{
        duration: 0.2,
        delay:    index * 0.03,
      }}
      onClick={handleClick}
      className={`group flex items-start gap-3
                   px-4 py-3.5 cursor-pointer
                   transition-all duration-200
                   border-b border-gray-50
                   last:border-b-0
                   ${notification.isRead
                     ? 'hover:bg-gray-50'
                     : 'bg-indigo-50/40 ' +
                       'hover:bg-indigo-50/70'
                   }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 ${config.bg}
                        rounded-xl flex items-center
                        justify-center
                        flex-shrink-0 text-lg
                        relative`}>
        {config.icon}

        {/* Unread Dot */}
        {!notification.isRead && (
          <div className={`absolute -top-0.5
                            -right-0.5 w-3 h-3
                            ${config.dot}
                            rounded-full border-2
                            border-white`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start
                         justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className={`text-sm font-semibold
                            truncate
                            ${notification.isRead
                              ? 'text-gray-700'
                              : 'text-gray-900'
                            }`}>
              {notification.title}
            </p>

            {/* Message */}
            <p className={`text-xs mt-0.5
                            leading-relaxed
                            line-clamp-2
                            ${notification.isRead
                              ? 'text-gray-400'
                              : 'text-gray-600'
                            }`}>
              {notification.message}
            </p>

            {/* Meta Row */}
            <div className="flex items-center
                             gap-2 mt-1.5">
              <span className={`text-[10px]
                                 font-semibold
                                 px-1.5 py-0.5
                                 rounded-full
                                 ${config.bg}
                                 ${config.color}`}>
                {config.label}
              </span>
              <span className="text-[11px]
                                text-gray-400">
                {timeAgo}
              </span>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100
                        p-1.5 rounded-lg
                        text-gray-300
                        hover:text-red-400
                        hover:bg-red-50
                        transition-all duration-200
                        flex-shrink-0"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}