// src/components/sprint/SprintBoard.jsx
import { useState }      from 'react'
import { motion }        from 'framer-motion'
import {
  ArchiveBoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const STATUS_COLUMNS = [
  { id: 'TODO',        label: 'To Do',      color: 'bg-gray-100   text-gray-700'   },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100   text-blue-700'   },
  { id: 'IN_REVIEW',   label: 'In Review',  color: 'bg-yellow-100 text-yellow-700' },
  { id: 'DONE',        label: 'Done',       color: 'bg-green-100  text-green-700'  },
]

const STATUS_COLORS = {
  PLANNED:   'border-t-blue-500',
  ACTIVE:    'border-t-green-500',
  COMPLETED: 'border-t-purple-500',
}

export default function SprintBoard({
  sprints,
  getSprintTasks,
  backlogTasks,
  projectId,
}) {
  const [showBacklog, setShowBacklog] = useState(false)

  return (
    <div className="space-y-6">
      {sprints.map((sprint) => {
        const tasks        = getSprintTasks(sprint.id)
        const borderColor  =
          STATUS_COLORS[sprint.status] ||
          'border-t-gray-300'

        return (
          <SprintBoardSection
            key={sprint.id}
            sprint={sprint}
            tasks={tasks}
            borderColor={borderColor}
          />
        )
      })}

      {/* Backlog Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y:  0 }}
        className="bg-white rounded-2xl border
                    border-gray-100 shadow-sm
                    overflow-hidden"
      >
        <div
          className="flex items-center gap-3
                       px-6 py-4 cursor-pointer
                       hover:bg-gray-50
                       transition-colors"
          onClick={() => setShowBacklog(!showBacklog)}
        >
          <div className="w-9 h-9 bg-gray-100
                           rounded-xl flex items-center
                           justify-center">
            <ArchiveBoxIcon
              className="w-5 h-5 text-gray-500"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">
              Backlog
            </h3>
            <p className="text-xs text-gray-400">
              {backlogTasks.length} unassigned task
              {backlogTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          {showBacklog
            ? <ChevronDownIcon
                className="w-5 h-5 text-gray-400"
              />
            : <ChevronRightIcon
                className="w-5 h-5 text-gray-400"
              />
          }
        </div>

        {showBacklog && (
          <div className="px-6 pb-5">
            <div className="grid grid-cols-4 gap-4">
              {STATUS_COLUMNS.map(col => {
                const colTasks = backlogTasks.filter(
                  t => t.status === col.id
                )
                return (
                  <BoardColumn
                    key={col.id}
                    column={col}
                    tasks={colTasks}
                  />
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ============================
// Sprint Board Section
// ============================
function SprintBoardSection({
  sprint,
  tasks,
  borderColor,
}) {
  const [collapsed, setCollapsed] = useState(false)

  const completedCount = tasks.filter(
    t => t.status === 'DONE'
  ).length

  const progress = tasks.length === 0
    ? 0
    : Math.round(completedCount / tasks.length * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y:  0 }}
      className={`bg-white rounded-2xl border
                   border-gray-100 shadow-sm
                   overflow-hidden border-t-4
                   ${borderColor}`}
    >
      {/* Section Header */}
      <div
        className="flex items-center gap-4
                     px-6 py-4 cursor-pointer
                     hover:bg-gray-50
                     transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-900">
              {sprint.name}
            </h3>
            <span className={`px-2.5 py-0.5
                               rounded-full text-xs
                               font-bold
                               ${sprint.status === 'ACTIVE'
                                 ? 'bg-green-100 ' +
                                   'text-green-700'
                                 : sprint.status === 'COMPLETED'
                                   ? 'bg-purple-100 ' +
                                     'text-purple-700'
                                   : 'bg-blue-100 ' +
                                     'text-blue-700'
                               }`}>
              {sprint.status}
            </span>
          </div>
          <div className="flex items-center gap-4
                           mt-1">
            <span className="text-xs text-gray-400">
              {tasks.length} tasks •{' '}
              {completedCount} done
            </span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-100
                               rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full
                              bg-indigo-500
                              transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-medium
                                text-gray-500">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        {collapsed
          ? <ChevronRightIcon
              className="w-5 h-5 text-gray-400"
            />
          : <ChevronDownIcon
              className="w-5 h-5 text-gray-400"
            />
        }
      </div>

      {/* Board Columns */}
      {!collapsed && (
        <div className="px-6 pb-5">
          <div className="grid grid-cols-4 gap-4">
            {STATUS_COLUMNS.map(col => {
              const colTasks = tasks.filter(
                t => t.status === col.id
              )
              return (
                <BoardColumn
                  key={col.id}
                  column={col}
                  tasks={colTasks}
                />
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============================
// Board Column
// ============================
function BoardColumn({ column, tasks }) {
  const PRIORITY_DOT = {
    LOW:      'bg-gray-400',
    MEDIUM:   'bg-blue-500',
    HIGH:     'bg-orange-500',
    CRITICAL: 'bg-red-500',
  }

  return (
    <div className="min-h-[200px]">
      {/* Column Header */}
      <div className={`flex items-center gap-2
                        px-3 py-2 rounded-xl mb-3
                        ${column.color}`}>
        <span className="text-xs font-bold">
          {column.label}
        </span>
        <span className="ml-auto text-xs font-bold
                          opacity-70">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.map(task => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 5  }}
            animate={{ opacity: 1, y: 0  }}
            className="bg-white border border-gray-100
                        rounded-xl p-3
                        hover:border-indigo-200
                        hover:shadow-sm
                        transition-all cursor-pointer"
          >
            {/* Priority + Points */}
            <div className="flex items-center
                             justify-between mb-2">
              <div className={`w-2 h-2 rounded-full
                                flex-shrink-0
                                ${PRIORITY_DOT[
                                  task.priority
                                ]}`} />
              {task.storyPoints > 0 && (
                <span className="text-xs font-bold
                                  text-indigo-600
                                  bg-indigo-50 px-1.5
                                  py-0.5 rounded">
                  {task.storyPoints}p
                </span>
              )}
            </div>

            {/* Title */}
            <p className="text-xs font-semibold
                           text-gray-800 line-clamp-2
                           mb-2 leading-relaxed">
              {task.title}
            </p>

            {/* Assignee */}
            {task.assignedTo && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full
                                 bg-indigo-200 flex
                                 items-center
                                 justify-center
                                 text-[8px] font-bold
                                 text-indigo-700">
                  {task.assignedTo.name
                    ?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px]
                                  text-gray-400 truncate">
                  {task.assignedTo.name}
                </span>
              </div>
            )}
          </motion.div>
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center
                           justify-center h-20
                           border-2 border-dashed
                           border-gray-200 rounded-xl">
            <p className="text-xs text-gray-300">
              No tasks
            </p>
          </div>
        )}
      </div>
    </div>
  )
}