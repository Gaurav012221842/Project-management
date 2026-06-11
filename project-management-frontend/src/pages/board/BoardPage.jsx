// src/pages/board/BoardPage.jsx
import { useEffect }               from 'react'
import { useParams }               from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion }                  from 'framer-motion'
import { RectangleStackIcon }      from '@heroicons/react/24/outline'
import {
  fetchProjectById,
  selectSelectedProject,
  selectProjectLoading,
} from '../../features/project/projectSlice'
import {
  fetchProjectTasks,
  selectTasks,
  selectTaskLoading,
} from '../../features/task/taskSlice'

const COLUMNS = [
  { key: 'TODO',        label: 'To Do',       color: 'bg-gray-100  text-gray-600'   },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100  text-blue-600'   },
  { key: 'IN_REVIEW',   label: 'In Review',   color: 'bg-yellow-100 text-yellow-600' },
  { key: 'DONE',        label: 'Done',        color: 'bg-green-100 text-green-600'  },
]

export default function BoardPage() {
  const dispatch  = useDispatch()
  const { projectId } = useParams()

  const project = useSelector(selectSelectedProject)
  const tasks   = useSelector(selectTasks)
  const loading = useSelector(selectTaskLoading)

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId))
      dispatch(fetchProjectTasks(projectId))
    }
  }, [projectId, dispatch])

  const taskList = Array.isArray(tasks)
  ? tasks
  : tasks?.content || [];

  const getTasksByStatus = (status) =>
    taskList.filter(t => t.status === status)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100
                         rounded-xl flex items-center
                         justify-center">
          <RectangleStackIcon
            className="w-5 h-5 text-indigo-600"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {project?.name || 'Board'}
          </h1>
          <p className="text-sm text-gray-500">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2
                       lg:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colTasks = getTasksByStatus(col.key)
          return (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              className="bg-white rounded-2xl
                          border border-gray-100
                          shadow-sm p-4"
            >
              {/* Column Header */}
              <div className="flex items-center
                               justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-lg
                                   text-xs font-semibold
                                   ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs text-gray-400
                                  font-medium">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-2">
                {loading
                  ? [...Array(2)].map((_, i) => (
                      <div key={i}
                           className="h-16 bg-gray-100
                                       rounded-xl
                                       animate-pulse" />
                    ))
                  : colTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-3 bg-gray-50
                                    rounded-xl border
                                    border-gray-100
                                    hover:border-indigo-200
                                    hover:bg-indigo-50/30
                                    transition-all
                                    cursor-pointer"
                      >
                        <p className="text-sm font-medium
                                       text-gray-800
                                       line-clamp-2">
                          {task.title}
                        </p>
                        {task.storyPoints != null && (
                          <span className="mt-1.5 inline-block
                                            text-xs text-gray-400">
                            {task.storyPoints} pts
                          </span>
                        )}
                      </div>
                    ))
                }
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
