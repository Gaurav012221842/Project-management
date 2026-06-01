// src/components/notification/NotificationToast.jsx
import { motion }   from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

const NOTIFICATION_CONFIG = {
  TASK_ASSIGNED:     { icon: '📋', color: 'indigo' },
  COMMENT_ADDED:     { icon: '💬', color: 'blue'   },
  TASK_UPDATED:      { icon: '✏️', color: 'yellow' },
  SPRINT_STARTED:    { icon: '🚀', color: 'green'  },
  MENTION:           { icon: '👋', color: 'purple' },
  DEADLINE_REMINDER: { icon: '⏰', color: 'red'    },
}

const COLOR_CLASSES = {
  indigo: 'border-l-indigo-500 bg-indigo-50',
  blue:   'border-l-blue-500   bg-blue-50',
  yellow: 'border-l-yellow-500 bg-yellow-50',
  green:  'border-l-green-500  bg-green-50',
  purple: 'border-l-purple-500 bg-purple-50',
  red:    'border-l-red-500    bg-red-50',
}

export default function NotificationToast({
  notification,
  onClose,
}) {
  const config =
    NOTIFICATION_CONFIG[notification.type] ||
    { icon: '🔔', color: 'indigo' }

  const colorClass =
    COLOR_CLASSES[config.color] ||
    COLOR_CLASSES.indigo

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0,   scale: 1    }}
      exit={{ opacity: 0, x: 100, scale: 0.95    }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 p-4
                   bg-white rounded-2xl shadow-xl
                   border border-gray-100
                   border-l-4 min-w-[300px]
                   max-w-sm ${colorClass}`}
    >
      {/* Icon */}
      <span className="text-xl flex-shrink-0 mt-0.5">
        {config.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900
                       text-sm">
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5
                       leading-relaxed line-clamp-2">
          {notification.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg
                    text-gray-400
                    hover:text-gray-600
                    hover:bg-white/80
                    transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  )
}