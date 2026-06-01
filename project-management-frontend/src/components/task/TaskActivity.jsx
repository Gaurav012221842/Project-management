// src/components/task/TaskActivity.jsx
import { motion }                from 'framer-motion'
import { formatDistanceToNow }   from 'date-fns'
import { ClockIcon }             from '@heroicons/react/24/outline'

const ACTION_CONFIG = {
  CREATED:        { icon: '✨', color: 'bg-green-100  text-green-700'  },
  UPDATED:        { icon: '✏️', color: 'bg-blue-100   text-blue-700'   },
  STATUS_CHANGED: { icon: '🔄', color: 'bg-yellow-100 text-yellow-700' },
  ASSIGNED:       { icon: '👤', color: 'bg-purple-100 text-purple-700' },
  COMMENTED:      { icon: '💬', color: 'bg-indigo-100 text-indigo-700' },
  COMPLETED:      { icon: '✅', color: 'bg-green-100  text-green-700'  },
}

export default function TaskActivity({ task }) {

  // Use task activity log or empty
  const activities = task.activityLog || []

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center
                       justify-center py-16 text-center">
        <div className="text-4xl mb-3">📋</div>
        <h4 className="font-semibold text-gray-600 mb-1">
          No activity yet
        </h4>
        <p className="text-sm text-gray-400">
          Actions on this task will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <ClockIcon className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-bold text-gray-700">
          Activity Log
        </h3>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-0 bottom-0
                         w-0.5 bg-gray-100" />

        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config =
              ACTION_CONFIG[activity.action] ||
              ACTION_CONFIG.UPDATED

            return (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x:  0  }}
                transition={{
                  duration: 0.3,
                  delay:    index * 0.05,
                }}
                className="flex items-start gap-4
                             relative"
              >
                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center
                  justify-center text-base flex-shrink-0
                  z-10 ${config.color}
                `}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-2">
                  <p className="text-sm text-gray-700
                                 leading-relaxed">
                    <span className="font-semibold
                                      text-gray-900">
                      {activity.userName || 'User'}
                    </span>
                    {' '}
                    {activity.action
                      ?.toLowerCase()
                      .replace('_', ' ')
                    }
                    {activity.newValue && (
                      <span className="font-medium
                                        text-indigo-600">
                        {' → '}{activity.newValue}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400
                                 mt-0.5">
                    {activity.createdAt
                      ? formatDistanceToNow(
                          new Date(activity.createdAt),
                          { addSuffix: true }
                        )
                      : 'just now'
                    }
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}