// src/components/task/TaskSubTasks.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import {
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from '../../features/task/taskSlice'

export default function TaskSubTasks({ task }) {
  const dispatch  = useDispatch()
  const [newTitle, setNewTitle] = useState('')
  const [adding,   setAdding]   = useState(false)

  const subTasks = task.subTasks || []

  const completed = subTasks.filter(
    s => s.isCompleted
  ).length

  const progress = subTasks.length === 0
    ? 0
    : Math.round(completed / subTasks.length * 100)

  const handleAdd = () => {
    if (!newTitle.trim()) return
    dispatch(createSubTask({
      taskId: task.id,
      title:  newTitle.trim(),
    }))
    setNewTitle('')
    setAdding(false)
  }

  const handleToggle = (subTask) => {
    dispatch(updateSubTask({
      taskId:    task.id,
      subTaskId: subTask.id,
      data:      { isCompleted: !subTask.isCompleted },
    }))
  }

  const handleDelete = (subTaskId) => {
    dispatch(deleteSubTask({
      taskId: task.id,
      subTaskId,
    }))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center
                       justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold
                          text-gray-700">
            Sub-Tasks
          </h3>
          {subTasks.length > 0 && (
            <span className="text-xs text-gray-400
                              bg-gray-100 px-2 py-0.5
                              rounded-full font-medium">
              {completed}/{subTasks.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-xs
                      text-indigo-600 font-semibold
                      hover:text-indigo-700
                      transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Progress */}
      {subTasks.length > 0 && (
        <div className="mb-3">
          <div className="w-full bg-gray-100
                           rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-1.5 rounded-full bg-indigo-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {progress}% complete
          </p>
        </div>
      )}

      {/* SubTask List */}
      <div className="space-y-2">
        <AnimatePresence>
          {subTasks.map((subTask) => (
            <motion.div
              key={subTask.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x:  0  }}
              exit={{ opacity: 0, x: 10,
                      height: 0              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3
                           group bg-gray-50
                           rounded-xl px-3 py-2.5
                           hover:bg-gray-100
                           transition-colors"
            >
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(subTask)}
                className={`
                  w-5 h-5 rounded-md border-2
                  flex items-center justify-center
                  flex-shrink-0 transition-all
                  ${subTask.isCompleted
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'border-gray-300 ' +
                      'hover:border-indigo-400'
                  }
                `}
              >
                {subTask.isCompleted && (
                  <CheckIcon
                    className="w-3 h-3 text-white"
                  />
                )}
              </button>

              {/* Title */}
              <span className={`
                flex-1 text-sm transition-all
                ${subTask.isCompleted
                  ? 'line-through text-gray-400'
                  : 'text-gray-700 font-medium'
                }
              `}>
                {subTask.title}
              </span>

              {/* Delete */}
              <button
                onClick={() =>
                  handleDelete(subTask.id)
                }
                className="opacity-0 group-hover:opacity-100
                            p-1 rounded-lg text-gray-400
                            hover:text-red-500
                            hover:bg-red-50
                            transition-all"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New SubTask */}
        <AnimatePresence>
          {adding && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y:  0 }}
              exit={{ opacity: 0, y: -8   }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) =>
                  setNewTitle(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd()
                  if (e.key === 'Escape') {
                    setAdding(false)
                    setNewTitle('')
                  }
                }}
                placeholder="Add sub-task..."
                autoFocus
                className="flex-1 px-3 py-2.5
                            bg-gray-50 border
                            border-indigo-300
                            rounded-xl text-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500"
              />
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="px-3 py-2.5 bg-indigo-600
                            text-white rounded-xl
                            text-sm font-semibold
                            hover:bg-indigo-700
                            disabled:opacity-50
                            transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAdding(false)
                  setNewTitle('')
                }}
                className="px-3 py-2.5 bg-gray-100
                            text-gray-600 rounded-xl
                            text-sm font-medium
                            hover:bg-gray-200
                            transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {subTasks.length === 0 && !adding && (
          <div className="flex items-center
                           justify-center h-16
                           border-2 border-dashed
                           border-gray-200 rounded-xl
                           cursor-pointer
                           hover:border-indigo-300
                           hover:bg-indigo-50/30
                           transition-all"
            onClick={() => setAdding(true)}
          >
            <p className="text-sm text-gray-400">
              + Add sub-tasks
            </p>
          </div>
        )}
      </div>
    </div>
  )
}