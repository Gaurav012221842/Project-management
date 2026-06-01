// src/components/sprint/ActiveSprintBanner.jsx
import { useState }               from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { differenceInDays, format } from 'date-fns'
import {
  RocketLaunchIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  FlagIcon,
} from '@heroicons/react/24/outline'
import {
  completeSprint,
  selectActionLoading,
} from '../../features/sprint/sprintSlice'
import ConfirmDialog
  from '../common/ConfirmDialog/ConfirmDialog'

export default function ActiveSprintBanner({
  sprint,
  tasks,
  projectId,
}) {
  const dispatch    = useDispatch()
  const isLoading   = useSelector(selectActionLoading)
  const [expanded,    setExpanded]    = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)

  const daysLeft = sprint.endDate
    ? differenceInDays(
        new Date(sprint.endDate),
        new Date()
      )
    : null

  const completedTasks = tasks.filter(
    t => t.status === 'DONE'
  ).length

  const progress = tasks.length === 0
    ? 0
    : Math.round(completedTasks / tasks.length * 100)

  const totalPoints = tasks.reduce(
    (sum, t) => sum + (t.storyPoints || 0), 0
  )

  const completedPoints = tasks
    .filter(t => t.status === 'DONE')
    .reduce((sum, t) => sum + (t.storyPoints || 0), 0)

  const handleComplete = () => {
    dispatch(completeSprint({
      projectId,
      sprintId: sprint.id,
    }))
    setShowConfirm(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y:   0 }}
        className="bg-gradient-to-r from-indigo-600
                    to-purple-600 rounded-2xl
                    overflow-hidden mb-6 shadow-xl
                    shadow-indigo-200"
      >
        {/* Header */}
        <div
          className="flex items-center
                       justify-between px-6 py-4
                       cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20
                             rounded-xl flex items-center
                             justify-center">
              <RocketLaunchIcon
                className="w-5 h-5 text-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5
                                  bg-green-400 text-white
                                  text-xs font-bold
                                  rounded-full">
                  ACTIVE
                </span>
                <h3 className="text-white font-bold
                                text-lg">
                  {sprint.name}
                </h3>
              </div>
              <p className="text-indigo-200 text-sm">
                {sprint.goal || 'No sprint goal set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Days Left */}
            {daysLeft !== null && (
              <div className="text-center hidden
                               sm:block">
                <p className={`text-2xl font-bold
                                ${daysLeft <= 2
                                  ? 'text-red-300'
                                  : 'text-white'}`}>
                  {daysLeft < 0 ? 0 : daysLeft}
                </p>
                <p className="text-indigo-200
                               text-xs">
                  days left
                </p>
              </div>
            )}

            {/* Complete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowConfirm(true)
              }}
              className="flex items-center gap-2
                          px-4 py-2 bg-white/20
                          hover:bg-white/30
                          text-white rounded-xl
                          text-sm font-semibold
                          transition-colors border
                          border-white/30"
            >
              <FlagIcon className="w-4 h-4" />
              Complete Sprint
            </button>

            {/* Expand Toggle */}
            <motion.div
              animate={{
                rotate: expanded ? 180 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon
                className="w-5 h-5 text-white"
              />
            </motion.div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-5 border-t
                          border-white/20"
            >
              <div className="pt-4 grid grid-cols-2
                               md:grid-cols-4 gap-4
                               mb-4">
                {[
                  {
                    label: 'Total Tasks',
                    value: tasks.length,
                    icon:  '📋',
                  },
                  {
                    label: 'Completed',
                    value: completedTasks,
                    icon:  '✅',
                  },
                  {
                    label: 'Story Points',
                    value: `${completedPoints}/${totalPoints}`,
                    icon:  '⚡',
                  },
                  {
                    label: 'End Date',
                    value: sprint.endDate
                      ? format(
                          new Date(sprint.endDate),
                          'MMM dd'
                        )
                      : '—',
                    icon:  '📅',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 rounded-xl
                                p-3 text-center"
                  >
                    <div className="text-2xl mb-1">
                      {item.icon}
                    </div>
                    <p className="text-white font-bold
                                   text-lg">
                      {item.value}
                    </p>
                    <p className="text-indigo-200
                                   text-xs mt-0.5">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between
                                 text-sm mb-2">
                  <span className="text-indigo-200">
                    Sprint Progress
                  </span>
                  <span className="text-white font-bold">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-white/20
                                 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${progress}%`
                    }}
                    transition={{
                      duration: 1,
                      delay:    0.3,
                    }}
                    className="h-3 rounded-full
                                bg-green-400
                                shadow-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirm Complete */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmDialog
            title="Complete Sprint"
            message={`Are you sure you want to complete "${sprint.name}"? Incomplete tasks will move to backlog.`}
            onConfirm={handleComplete}
            onCancel={() => setShowConfirm(false)}
            confirmLabel="Complete Sprint"
            loading={isLoading}
          />
        )}
      </AnimatePresence>
    </>
  )
}