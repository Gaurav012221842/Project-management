// src/components/sprint/SprintCard.jsx
import { useState }               from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  differenceInDays,
  format,
  isPast,
} from 'date-fns'
import {
  PlayIcon,
  TrashIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import EditSprintModal
  from './EditSprintModal'
import ConfirmDialog
  from '../common/ConfirmDialog/ConfirmDialog'
import {
  startSprint,
  deleteSprint,
  selectActionLoading,
} from '../../features/sprint/sprintSlice'

// ============================
// Status Config
// ============================
const STATUS_CONFIG = {
  PLANNED: {
    label:   'Planned',
    class:   'bg-blue-100 text-blue-700',
    dot:     'bg-blue-500',
    border:  'border-l-blue-500',
  },
  ACTIVE: {
    label:   'Active',
    class:   'bg-green-100 text-green-700',
    dot:     'bg-green-500',
    border:  'border-l-green-500',
  },
  COMPLETED: {
    label:   'Completed',
    class:   'bg-purple-100 text-purple-700',
    dot:     'bg-purple-500',
    border:  'border-l-purple-500',
  },
}

const TASK_STATUS_COLORS = {
  TODO:        'bg-gray-400',
  IN_PROGRESS: 'bg-indigo-500',
  IN_REVIEW:   'bg-yellow-500',
  DONE:        'bg-green-500',
}

export default function SprintCard({
  sprint,
  tasks,
  projectId,
  index,
}) {
  const dispatch    = useDispatch()
  const isLoading   = useSelector(selectActionLoading)

  const [expanded,    setExpanded]    = useState(
    sprint.status === 'ACTIVE'
  )
  const [showMenu,    setShowMenu]    = useState(false)
  const [showEdit,    setShowEdit]    = useState(false)
  const [showDelete,  setShowDelete]  = useState(false)
  const [showStart,   setShowStart]   = useState(false)

  const status = STATUS_CONFIG[sprint.status]

  const completedTasks = tasks.filter(
    t => t.status === 'DONE'
  ).length

  const progress = tasks.length === 0
    ? 0
    : Math.round(completedTasks / tasks.length * 100)

  const totalPoints = tasks.reduce(
    (sum, t) => sum + (t.storyPoints || 0), 0
  )

  const daysLeft = sprint.endDate
    ? differenceInDays(
        new Date(sprint.endDate),
        new Date()
      )
    : null

  const isOverdue =
    sprint.status !== 'COMPLETED' &&
    sprint.endDate &&
    isPast(new Date(sprint.endDate))

  // Task Distribution
  const taskCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {})

  const handleStart = () => {
    dispatch(startSprint({
      projectId,
      sprintId: sprint.id,
    }))
    setShowStart(false)
  }

  const handleDelete = () => {
    dispatch(deleteSprint({
      projectId,
      sprintId: sprint.id,
    }))
    setShowDelete(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20  }}
        animate={{ opacity: 1, y: 0   }}
        transition={{
          duration: 0.4,
          delay:    index * 0.06,
        }}
        className={`bg-white rounded-2xl border
                     border-gray-100 shadow-sm
                     overflow-hidden border-l-4
                     ${status.border}
                     hover:shadow-md
                     transition-shadow`}
      >
        {/* Sprint Header */}
        <div className="p-5">
          <div className="flex items-start
                           justify-between mb-3">

            {/* Left Info */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center
                               gap-2 mb-1">
                {/* Status Badge */}
                <span className={`flex items-center
                                   gap-1.5 px-2.5 py-1
                                   rounded-full text-xs
                                   font-semibold
                                   ${status.class}`}>
                  <div className={`w-1.5 h-1.5
                                    rounded-full
                                    ${status.dot}`} />
                  {status.label}
                </span>

                {/* Overdue Warning */}
                {isOverdue && (
                  <span className="px-2 py-0.5
                                    bg-red-100
                                    text-red-600
                                    text-xs font-semibold
                                    rounded-full">
                    ⚠️ Overdue
                  </span>
                )}
              </div>

              <h3 className="font-bold text-gray-900
                              text-lg truncate">
                {sprint.name}
              </h3>

              {sprint.goal && (
                <p className="text-sm text-gray-500
                               mt-1 line-clamp-2">
                  🎯 {sprint.goal}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2
                             flex-shrink-0">
              {/* Start Button */}
              {sprint.status === 'PLANNED' && (
                <button
                  onClick={() => setShowStart(true)}
                  className="flex items-center gap-1.5
                              px-3 py-1.5 bg-green-50
                              hover:bg-green-100
                              text-green-700 rounded-xl
                              text-xs font-semibold
                              transition-colors"
                >
                  <PlayIcon className="w-3.5 h-3.5" />
                  Start
                </button>
              )}

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setShowMenu(!showMenu)
                  }
                  className="p-2 rounded-xl
                              text-gray-400
                              hover:text-gray-600
                              hover:bg-gray-100
                              transition-colors"
                >
                  <EllipsisHorizontalIcon
                    className="w-5 h-5"
                  />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale:   0.95,
                        y:       -8,
                      }}
                      animate={{
                        opacity: 1,
                        scale:   1,
                        y:       0,
                      }}
                      exit={{
                        opacity: 0,
                        scale:   0.95,
                      }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0
                                  top-10 bg-white
                                  rounded-xl shadow-xl
                                  border border-gray-100
                                  py-1.5 z-20
                                  min-w-[140px]"
                    >
                      {sprint.status !== 'COMPLETED' && (
                        <button
                          onClick={() => {
                            setShowEdit(true)
                            setShowMenu(false)
                          }}
                          className="flex items-center
                                      gap-2.5 w-full
                                      px-4 py-2.5 text-sm
                                      text-gray-700
                                      hover:bg-gray-50
                                      transition-colors"
                        >
                          <PencilSquareIcon
                            className="w-4 h-4"
                          />
                          Edit Sprint
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowDelete(true)
                          setShowMenu(false)
                        }}
                        className="flex items-center
                                    gap-2.5 w-full
                                    px-4 py-2.5 text-sm
                                    text-red-500
                                    hover:bg-red-50
                                    transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Expand Toggle */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-2 rounded-xl text-gray-400
                            hover:text-gray-600
                            hover:bg-gray-100
                            transition-colors"
              >
                {expanded
                  ? <ChevronUpIcon
                      className="w-4 h-4"
                    />
                  : <ChevronDownIcon
                      className="w-4 h-4"
                    />
                }
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-4
                           text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              {sprint.startDate
                ? format(
                    new Date(sprint.startDate),
                    'MMM dd'
                  )
                : '—'
              }
              {' → '}
              {sprint.endDate
                ? format(
                    new Date(sprint.endDate),
                    'MMM dd, yyyy'
                  )
                : '—'
              }
            </div>
            {daysLeft !== null &&
             sprint.status !== 'COMPLETED' && (
              <div className={`flex items-center
                                gap-1
                                ${isOverdue
                                  ? 'text-red-500'
                                  : daysLeft <= 3
                                    ? 'text-orange-500'
                                    : 'text-gray-400'
                                }`}>
                <span className="font-medium">
                  {isOverdue
                    ? `${Math.abs(daysLeft)}d overdue`
                    : `${daysLeft}d left`
                  }
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between
                             text-xs mb-1.5">
              <span className="text-gray-500
                                font-medium">
                {completedTasks}/{tasks.length} tasks
              </span>
              <span className="font-bold
                                text-gray-700">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-100
                             rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-2.5 rounded-full
                              ${sprint.status === 'COMPLETED'
                                ? 'bg-purple-500'
                                : sprint.status === 'ACTIVE'
                                  ? 'bg-green-500'
                                  : 'bg-blue-500'
                              }`}
              />
            </div>
          </div>

          {/* Task Distribution Bar */}
          {tasks.length > 0 && (
            <div className="flex h-2 rounded-full
                             overflow-hidden gap-0.5
                             mb-4">
              {Object.entries(TASK_STATUS_COLORS)
                .map(([status, color]) => {
                  const count = taskCounts[status] || 0
                  const pct = count / tasks.length * 100
                  if (pct === 0) return null
                  return (
                    <div
                      key={status}
                      className={`${color}
                                   transition-all`}
                      style={{ width: `${pct}%` }}
                      title={`${status}: ${count}`}
                    />
                  )
                })
              }
            </div>
          )}

          {/* Mini Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon:  '📋',
                value: tasks.length,
                label: 'Tasks',
              },
              {
                icon:  '✅',
                value: completedTasks,
                label: 'Done',
              },
              {
                icon:  '⚡',
                value: totalPoints,
                label: 'Points',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-xl
                            p-2.5 text-center"
              >
                <div className="text-lg mb-0.5">
                  {item.icon}
                </div>
                <p className="text-base font-bold
                               text-gray-800">
                  {item.value}
                </p>
                <p className="text-xs text-gray-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expanded Task List */}
        <AnimatePresence>
          {expanded && tasks.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-100"
            >
              <div className="px-5 py-3 bg-gray-50/50">
                <p className="text-xs font-semibold
                               text-gray-500 uppercase
                               tracking-wider mb-3">
                  Tasks ({tasks.length})
                </p>
                <div className="space-y-2">
                  {tasks.slice(0, 5).map(task => (
                    <SprintTaskItem
                      key={task.id}
                      task={task}
                    />
                  ))}
                  {tasks.length > 5 && (
                    <p className="text-xs text-center
                                   text-indigo-500
                                   font-medium pt-1">
                      +{tasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showEdit && (
          <EditSprintModal
            sprint={sprint}
            projectId={projectId}
            onClose={() => setShowEdit(false)}
          />
        )}
        {showDelete && (
          <ConfirmDialog
            title="Delete Sprint"
            message={`Delete "${sprint.name}"? Tasks will move to backlog.`}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
            confirmLabel="Delete Sprint"
            loading={isLoading}
            isDanger
          />
        )}
        {showStart && (
          <ConfirmDialog
            title="Start Sprint"
            message={`Start "${sprint.name}"? Only one sprint can be active at a time.`}
            onConfirm={handleStart}
            onCancel={() => setShowStart(false)}
            confirmLabel="Start Sprint"
            loading={isLoading}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ============================
// Sprint Task Item
// ============================
const STATUS_PILL = {
  TODO:        'bg-gray-100  text-gray-600',
  IN_PROGRESS: 'bg-blue-100  text-blue-600',
  IN_REVIEW:   'bg-yellow-100 text-yellow-600',
  DONE:        'bg-green-100 text-green-600',
}

const PRIORITY_DOT = {
  LOW:      'bg-gray-400',
  MEDIUM:   'bg-blue-500',
  HIGH:     'bg-orange-500',
  CRITICAL: 'bg-red-500',
}

function SprintTaskItem({ task }) {
  return (
    <div className="flex items-center gap-3
                     bg-white rounded-xl px-3 py-2.5
                     border border-gray-100
                     hover:border-indigo-200
                     transition-colors">
      {/* Priority Dot */}
      <div className={`w-2 h-2 rounded-full
                        flex-shrink-0
                        ${PRIORITY_DOT[task.priority]
                          || 'bg-gray-400'}`} />

      {/* Title */}
      <p className="text-sm text-gray-700 flex-1
                     truncate font-medium">
        {task.title}
      </p>

      <div className="flex items-center gap-2
                       flex-shrink-0">
        {/* Story Points */}
        {task.storyPoints > 0 && (
          <span className="px-1.5 py-0.5
                            bg-indigo-50
                            text-indigo-600 text-xs
                            font-bold rounded">
            {task.storyPoints}p
          </span>
        )}

        {/* Status */}
        <span className={`px-2 py-0.5 rounded-full
                           text-xs font-medium
                           ${STATUS_PILL[task.status]
                             || STATUS_PILL.TODO}`}>
          {task.status.replace('_', ' ')}
        </span>

        {/* Assignee */}
        {task.assignedTo?.profilePic ? (
          <img
            src={task.assignedTo.profilePic}
            alt={task.assignedTo.name}
            className="w-5 h-5 rounded-full
                        object-cover border
                        border-gray-200"
          />
        ) : task.assignedTo ? (
          <div className="w-5 h-5 rounded-full
                           bg-indigo-200 flex
                           items-center justify-center
                           text-indigo-700 text-[9px]
                           font-bold">
            {task.assignedTo.name?.charAt(0)}
          </div>
        ) : null}
      </div>
    </div>
  )
}