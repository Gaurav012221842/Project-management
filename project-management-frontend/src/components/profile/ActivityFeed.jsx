// src/components/profile/ActivityFeed.jsx
import { useEffect, useCallback }   from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion }                   from 'framer-motion'
import { formatDistanceToNow }      from 'date-fns'
import {
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import {
  fetchActivityLog,
  selectActivityLog,
  selectActivityLoading,
  selectHasMoreActivity,
  selectCurrentPage,
} from '../../features/profile/profileSlice'

const ACTION_CONFIG = {
  CREATED:        { icon: '✨', color: 'bg-green-100  text-green-700'  },
  UPDATED:        { icon: '✏️', color: 'bg-blue-100   text-blue-700'   },
  DELETED:        { icon: '🗑️', color: 'bg-red-100    text-red-700'    },
  STATUS_CHANGED: { icon: '🔄', color: 'bg-yellow-100 text-yellow-700' },
  ASSIGNED:       { icon: '👤', color: 'bg-purple-100 text-purple-700' },
  COMMENTED:      { icon: '💬', color: 'bg-indigo-100 text-indigo-700' },
  COMPLETED:      { icon: '✅', color: 'bg-green-100  text-green-700'  },
  STARTED:        { icon: '🚀', color: 'bg-indigo-100 text-indigo-700' },
}

export default function ActivityFeed() {
  const dispatch = useDispatch()

  const activities = useSelector(selectActivityLog)
  const loading    = useSelector(selectActivityLoading)
  const hasMore    = useSelector(selectHasMoreActivity)
  const page       = useSelector(selectCurrentPage)

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      dispatch(fetchActivityLog({ page: page + 1 }))
    }
  }, [hasMore, loading, page, dispatch])

  if (loading && activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border
                       border-gray-100 shadow-sm p-6
                       space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4
                                    animate-pulse">
            <div className="w-10 h-10 bg-gray-200
                             rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-gray-200 rounded
                               w-3/4" />
              <div className="h-3 bg-gray-100 rounded
                               w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y:  0 }}
      className="bg-white rounded-2xl border
                  border-gray-100 shadow-sm
                  overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between
                       px-6 py-5 border-b border-gray-100
                       bg-gray-50/50">
        <div>
          <h2 className="text-base font-bold
                          text-gray-900">
            Activity Log
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Your recent actions
          </p>
        </div>
        <div className="flex items-center gap-1.5
                         text-xs text-gray-400
                         bg-gray-100 px-3 py-1.5
                         rounded-full">
          <ClockIcon className="w-3.5 h-3.5" />
          {activities.length} activities
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-50">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center
                           justify-center py-16 px-4
                           text-center">
            <div className="text-4xl mb-3">📭</div>
            <h4 className="font-semibold text-gray-600
                            mb-1">
              No activity yet
            </h4>
            <p className="text-sm text-gray-400">
              Your actions will appear here
            </p>
          </div>
        ) : (
          activities.map((activity, index) => {
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
                  delay:    index * 0.04,
                }}
                className="flex items-start gap-4
                             px-6 py-4 hover:bg-gray-50/70
                             transition-colors"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl
                                  flex items-center
                                  justify-center
                                  text-lg flex-shrink-0
                                  ${config.color}`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800
                                 font-medium leading-relaxed">
                    <span className={`
                      px-1.5 py-0.5 rounded text-xs
                      font-bold mr-2
                      ${config.color}
                    `}>
                      {activity.action
                        ?.replace('_', ' ')
                        .toLowerCase()}
                    </span>
                    {activity.entityType?.toLowerCase()}{' '}
                    <span className="font-semibold
                                      text-gray-900">
                      {activity.newValue ||
                       activity.entityType}
                    </span>
                  </p>

                  {activity.oldValue &&
                   activity.newValue && (
                    <p className="text-xs text-gray-400
                                   mt-1">
                      Changed from{' '}
                      <span className="font-medium
                                        text-gray-600">
                        {activity.oldValue}
                      </span>
                      {' '}→{' '}
                      <span className="font-medium
                                        text-gray-600">
                        {activity.newValue}
                      </span>
                    </p>
                  )}

                  <p className="text-xs text-gray-400
                                 mt-1 flex items-center
                                 gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {activity.createdAt
                      ? formatDistanceToNow(
                          new Date(activity.createdAt),
                          { addSuffix: true }
                        )
                      : 'Just now'
                    }
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="px-6 py-4 border-t
                         border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full flex items-center
                        justify-center gap-2
                        py-2.5 text-sm font-medium
                        text-indigo-600
                        hover:text-indigo-700
                        hover:bg-indigo-50
                        rounded-xl transition-colors
                        disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2
                                 border-indigo-500
                                 border-t-transparent
                                 rounded-full
                                 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4" />
                Load More
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  )
}