// src/components/task/TaskDetail.jsx
import { motion }    from 'framer-motion'
import { format }    from 'date-fns'
import {
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export default function TaskDetail({ task }) {
  return (
    <div className="space-y-6">

      {/* Description */}
      <div>
        <h3 className="text-sm font-bold
                        text-gray-500 uppercase
                        tracking-wider mb-3">
          Description
        </h3>
        {task.description ? (
          <div className="prose prose-sm max-w-none
                           text-gray-700 bg-gray-50
                           rounded-2xl p-4
                           leading-relaxed">
            {task.description}
          </div>
        ) : (
          <div className="flex items-center
                           justify-center h-24
                           bg-gray-50 rounded-2xl
                           border-2 border-dashed
                           border-gray-200">
            <p className="text-sm text-gray-400">
              No description provided
            </p>
          </div>
        )}
      </div>

      {/* Meta Info Row */}
      <div className="grid grid-cols-2 gap-4">
        {task.dueDate && (
          <div className="flex items-center gap-3
                           bg-gray-50 rounded-xl p-3">
            <CalendarIcon
              className="w-5 h-5 text-gray-400"
            />
            <div>
              <p className="text-xs text-gray-400
                             font-medium">
                Due Date
              </p>
              <p className="text-sm font-semibold
                             text-gray-800">
                {format(
                  new Date(task.dueDate),
                  'MMM dd, yyyy'
                )}
              </p>
            </div>
          </div>
        )}
        {task.createdAt && (
          <div className="flex items-center gap-3
                           bg-gray-50 rounded-xl p-3">
            <ClockIcon
              className="w-5 h-5 text-gray-400"
            />
            <div>
              <p className="text-xs text-gray-400
                             font-medium">
                Created
              </p>
              <p className="text-sm font-semibold
                             text-gray-800">
                {format(
                  new Date(task.createdAt),
                  'MMM dd, yyyy'
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}