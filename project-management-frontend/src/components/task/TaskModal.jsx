// src/components/task/TaskModal.jsx
import { useEffect, useState }      from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  XMarkIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import TaskDetail      from './TaskDetail'
import TaskEditForm    from './TaskEditForm'
import TaskComments    from './TaskComments'
import TaskAttachments from './TaskAttachments'
import TaskActivity    from './TaskActivity'
import TaskSubTasks    from './TaskSubTasks'
import ConfirmDialog   from '../common/ConfirmDialog/ConfirmDialog'
import {
  fetchTaskById,
  fetchComments,
  deleteTask,
  selectSelectedTask,
  clearSelectedTask,
} from '../../features/task/taskSlice'

const TABS = [
  { key: 'detail',      label: 'Details'     },
  { key: 'comments',    label: 'Comments'    },
  { key: 'attachments', label: 'Attachments' },
  { key: 'activity',    label: 'Activity'    },
]

export default function TaskModal({
  taskId,
  onClose,
  tasks,
  currentIndex,
  onNavigate,
}) {
  const dispatch    = useDispatch()
  const task        = useSelector(selectSelectedTask)

  const [activeTab,   setActiveTab]   = useState('detail')
  const [isEditing,   setIsEditing]   = useState(false)
  const [showDelete,  setShowDelete]  = useState(false)

  // ============================
  // Fetch Task Data
  // ============================
  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId))
      dispatch(fetchComments(taskId))
    }
    return () => dispatch(clearSelectedTask())
  }, [taskId, dispatch])

  // ============================
  // Keyboard Navigation
  // ============================
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onNavigate) {
        onNavigate('prev')
      }
      if (e.key === 'ArrowRight' && onNavigate) {
        onNavigate('next')
      }
    }
    document.addEventListener('keydown', handleKey)
    return () =>
      document.removeEventListener('keydown', handleKey)
  }, [onClose, onNavigate])

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
    setShowDelete(false)
    onClose()
  }

  const hasPrev = currentIndex > 0
  const hasNext = tasks &&
    currentIndex < tasks.length - 1

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0   }}
        className="fixed inset-0 bg-black/60
                    backdrop-blur-sm z-50 flex
                    items-center justify-center
                    p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        {/* Navigation Arrows */}
        {onNavigate && (
          <>
            {hasPrev && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95   }}
                onClick={() => onNavigate('prev')}
                className="fixed left-4 top-1/2
                            -translate-y-1/2 w-10 h-10
                            bg-white/20 backdrop-blur-sm
                            rounded-full flex items-center
                            justify-center text-white
                            hover:bg-white/30
                            transition-colors z-10"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </motion.button>
            )}
            {hasNext && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95   }}
                onClick={() => onNavigate('next')}
                className="fixed right-4 top-1/2
                            -translate-y-1/2 w-10 h-10
                            bg-white/20 backdrop-blur-sm
                            rounded-full flex items-center
                            justify-center text-white
                            hover:bg-white/30
                            transition-colors z-10"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </motion.button>
            )}
          </>
        )}

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{ opacity: 0, scale: 0.95, y: 20    }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl
                      w-full max-w-4xl max-h-[90vh]
                      overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ======================== */}
          {/*         Header           */}
          {/* ======================== */}
          {task && (
            <TaskModalHeader
              task={task}
              isEditing={isEditing}
              onEdit={() => setIsEditing(!isEditing)}
              onDelete={() => setShowDelete(true)}
              onClose={onClose}
            />
          )}

          {/* ======================== */}
          {/*          Tabs            */}
          {/* ======================== */}
          <div className="flex items-center gap-1
                           px-6 py-2 border-b
                           border-gray-100 bg-gray-50/50
                           overflow-x-auto
                           scrollbar-hide flex-shrink-0">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  setIsEditing(false)
                }}
                className={`
                  px-4 py-2 rounded-xl text-sm
                  font-medium transition-all
                  whitespace-nowrap flex-shrink-0
                  ${activeTab === tab.key
                    ? 'bg-white text-indigo-700 ' +
                      'shadow-sm font-semibold'
                    : 'text-gray-500 ' +
                      'hover:text-gray-700 ' +
                      'hover:bg-white/60'
                  }
                `}
              >
                {tab.label}
                {tab.key === 'comments' &&
                 task?.commentsCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5
                                    bg-indigo-100
                                    text-indigo-600
                                    text-xs font-bold
                                    rounded-full">
                    {task.commentsCount}
                  </span>
                )}
                {tab.key === 'attachments' &&
                 task?.attachmentsCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5
                                    bg-gray-100
                                    text-gray-600
                                    text-xs font-bold
                                    rounded-full">
                    {task.attachmentsCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ======================== */}
          {/*         Content          */}
          {/* ======================== */}
          <div className="flex-1 overflow-y-auto">
            {!task ? (
              <TaskModalSkeleton />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={isEditing
                    ? 'editing'
                    : activeTab
                  }
                  initial={{ opacity: 0, y: 8  }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{ opacity: 0, y: -8    }}
                  transition={{ duration: 0.2  }}
                >
                  {isEditing ? (
                    <TaskEditForm
                      task={task}
                      onCancel={() =>
                        setIsEditing(false)
                      }
                      onSaved={() =>
                        setIsEditing(false)
                      }
                    />
                  ) : (
                    <>
                      {activeTab === 'detail' && (
                        <div className="grid grid-cols-1
                                         lg:grid-cols-3
                                         divide-y lg:divide-y-0
                                         lg:divide-x
                                         divide-gray-100">
                          <div className="lg:col-span-2
                                           p-6">
                            <TaskDetail task={task} />
                            <div className="mt-6">
                              <TaskSubTasks task={task} />
                            </div>
                          </div>
                          <div className="p-6">
                            <TaskSidebar task={task} />
                          </div>
                        </div>
                      )}
                      {activeTab === 'comments' && (
                        <div className="p-6">
                          <TaskComments
                            task={task}
                          />
                        </div>
                      )}
                      {activeTab === 'attachments' && (
                        <div className="p-6">
                          <TaskAttachments
                            task={task}
                          />
                        </div>
                      )}
                      {activeTab === 'activity' && (
                        <div className="p-6">
                          <TaskActivity task={task} />
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {showDelete && (
          <ConfirmDialog
            title="Delete Task"
            message={`Delete "${task?.title}"? This cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
            confirmLabel="Delete Task"
            isDanger
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ============================
// Modal Header
// ============================
function TaskModalHeader({
  task,
  isEditing,
  onEdit,
  onDelete,
  onClose,
}) {
  const STATUS_COLORS = {
    TODO:        'bg-gray-100  text-gray-700',
    IN_PROGRESS: 'bg-blue-100  text-blue-700',
    IN_REVIEW:   'bg-yellow-100 text-yellow-700',
    DONE:        'bg-green-100 text-green-700',
  }

  const PRIORITY_COLORS = {
    LOW:      'bg-gray-100  text-gray-600',
    MEDIUM:   'bg-blue-100  text-blue-600',
    HIGH:     'bg-orange-100 text-orange-600',
    CRITICAL: 'bg-red-100   text-red-600',
  }

  const TYPE_ICONS = {
    FEATURE:     '✨',
    BUG:         '🐛',
    IMPROVEMENT: '⚡',
    TASK:        '📋',
  }

  return (
    <div className="flex flex-col px-6 pt-5 pb-3
                     border-b border-gray-100
                     flex-shrink-0">

      {/* Top Row */}
      <div className="flex items-start
                       justify-between gap-4 mb-3">
        <div className="flex items-start gap-3
                         flex-1 min-w-0">

          {/* Type Icon */}
          <div className="text-2xl flex-shrink-0 mt-0.5">
            {TYPE_ICONS[task.taskType] || '📋'}
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold
                            text-gray-900
                            leading-snug">
              {task.title}
            </h2>
            <div className="flex items-center
                             gap-2 mt-1.5 flex-wrap">
              <span className={`px-2.5 py-0.5
                                 rounded-full text-xs
                                 font-semibold
                                 ${STATUS_COLORS[
                                   task.status
                                 ]}`}>
                {task.status.replace('_', ' ')}
              </span>
              <span className={`px-2.5 py-0.5
                                 rounded-full text-xs
                                 font-semibold
                                 ${PRIORITY_COLORS[
                                   task.priority
                                 ]}`}>
                {task.priority}
              </span>
              {task.storyPoints > 0 && (
                <span className="px-2 py-0.5
                                  bg-indigo-50
                                  text-indigo-600
                                  text-xs font-bold
                                  rounded-full">
                  {task.storyPoints} pts
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5
                         flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95   }}
            onClick={onEdit}
            className={`px-3 py-1.5 rounded-xl
                         text-xs font-semibold
                         transition-colors
                         ${isEditing
                           ? 'bg-indigo-100 ' +
                             'text-indigo-700'
                           : 'bg-gray-100 ' +
                             'text-gray-600 ' +
                             'hover:bg-gray-200'
                         }`}
          >
            {isEditing ? 'Cancel Edit' : '✏️ Edit'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95   }}
            onClick={onDelete}
            className="p-2 rounded-xl text-gray-400
                        hover:text-red-500
                        hover:bg-red-50
                        transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95   }}
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400
                        hover:text-gray-600
                        hover:bg-gray-100
                        transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// ============================
// Task Sidebar
// ============================
function TaskSidebar({ task }) {
  const dispatch = useDispatch()

  const STATUS_OPTIONS   = [
    'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'
  ]
  const PRIORITY_OPTIONS = [
    'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  ]

  const handleStatusChange = (status) => {
    dispatch(updateTaskStatus({
      taskId:     task.id,
      statusData: { status },
    }))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-gray-500
                      uppercase tracking-wider">
        Properties
      </h3>

      {/* Status */}
      <SidebarField label="Status">
        <select
          value={task.status}
          onChange={(e) =>
            handleStatusChange(e.target.value)
          }
          className="w-full px-3 py-2 border
                      border-gray-200 rounded-xl
                      text-sm font-medium
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                      bg-white"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </SidebarField>

      {/* Priority */}
      <SidebarField label="Priority">
        <div className="grid grid-cols-2 gap-1.5">
          {PRIORITY_OPTIONS.map(p => {
            const colors = {
              LOW:      'bg-gray-100  text-gray-600',
              MEDIUM:   'bg-blue-100  text-blue-600',
              HIGH:     'bg-orange-100 text-orange-600',
              CRITICAL: 'bg-red-100   text-red-600',
            }
            return (
              <button
                key={p}
                onClick={() =>
                  dispatch(updateTask({
                    taskId: task.id,
                    data:   { priority: p },
                  }))
                }
                className={`
                  px-2 py-1.5 rounded-lg text-xs
                  font-semibold transition-all border-2
                  ${task.priority === p
                    ? `${colors[p]} border-current`
                    : 'bg-white text-gray-500 ' +
                      'border-gray-200 ' +
                      'hover:border-gray-300'
                  }
                `}
              >
                {p}
              </button>
            )
          })}
        </div>
      </SidebarField>

      {/* Assignee */}
      <SidebarField label="Assignee">
        {task.assignedTo ? (
          <div className="flex items-center gap-2
                           p-2 bg-gray-50 rounded-xl">
            <div className="w-7 h-7 rounded-lg
                             bg-indigo-200 flex
                             items-center justify-center
                             text-indigo-700 text-xs
                             font-bold flex-shrink-0">
              {task.assignedTo.name?.charAt(0)}
            </div>
            <span className="text-sm font-medium
                              text-gray-700 truncate">
              {task.assignedTo.name}
            </span>
          </div>
        ) : (
          <div className="p-2 bg-gray-50 rounded-xl
                           text-sm text-gray-400
                           text-center">
            Unassigned
          </div>
        )}
      </SidebarField>

      {/* Story Points */}
      <SidebarField label="Story Points">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 5, 8, 13].map(pt => (
            <button
              key={pt}
              onClick={() =>
                dispatch(updateTask({
                  taskId: task.id,
                  data:   { storyPoints: pt },
                }))
              }
              className={`
                w-9 h-9 rounded-xl text-xs font-bold
                transition-all border-2
                ${task.storyPoints === pt
                  ? 'bg-indigo-600 text-white ' +
                    'border-indigo-600'
                  : 'bg-white text-gray-500 ' +
                    'border-gray-200 ' +
                    'hover:border-indigo-300'
                }
              `}
            >
              {pt}
            </button>
          ))}
        </div>
      </SidebarField>

      {/* Due Date */}
      <SidebarField label="Due Date">
        <input
          type="date"
          defaultValue={task.dueDate || ''}
          onChange={(e) =>
            dispatch(updateTask({
              taskId: task.id,
              data:   { dueDate: e.target.value },
            }))
          }
          className="w-full px-3 py-2 border
                      border-gray-200 rounded-xl
                      text-sm focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500 bg-white"
        />
      </SidebarField>

      {/* Labels */}
      {task.labels?.length > 0 && (
        <SidebarField label="Labels">
          <div className="flex flex-wrap gap-1.5">
            {task.labels.map(label => (
              <span
                key={label.id}
                className="px-2.5 py-1 rounded-full
                            text-xs font-semibold
                            text-white"
                style={{
                  backgroundColor: label.color
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </SidebarField>
      )}

      {/* Created By */}
      {task.createdBy && (
        <SidebarField label="Created By">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg
                             bg-gray-200 flex
                             items-center justify-center
                             text-gray-600 text-xs
                             font-bold">
              {task.createdBy.name?.charAt(0)}
            </div>
            <span className="text-sm text-gray-600">
              {task.createdBy.name}
            </span>
          </div>
        </SidebarField>
      )}

      {/* Dates */}
      {task.createdAt && (
        <SidebarField label="Created">
          <span className="text-sm text-gray-500">
            {new Date(task.createdAt)
              .toLocaleDateString('en-US', {
                month: 'short',
                day:   'numeric',
                year:  'numeric',
              })
            }
          </span>
        </SidebarField>
      )}
    </div>
  )
}

function SidebarField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold
                          text-gray-400 uppercase
                          tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

// ============================
// Skeleton Loader
// ============================
function TaskModalSkeleton() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-7 bg-gray-200 rounded
                       w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="h-32 bg-gray-100 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i}
               className="h-24 bg-gray-50 rounded-xl" />
        ))}
      </div>
    </div>
  )
}