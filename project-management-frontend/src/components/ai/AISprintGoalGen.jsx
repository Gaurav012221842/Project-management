
// src/components/ai/AISprintGoalGen.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  RocketLaunchIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  generateSprintGoal,
  selectAILoading,
  selectLastSprintGoal,
} from '../../features/ai/aiSlice'
import toast from 'react-hot-toast'

export default function AISprintGoalGen() {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectAILoading)
  const result    = useSelector(selectLastSprintGoal)

  const [sprintName, setSprintName] = useState('')
  const [tasks,      setTasks]      = useState([''])
  const [context,    setContext]    = useState('')

  const addTask = () =>
    setTasks([...tasks, ''])

  const removeTask = (i) =>
    setTasks(tasks.filter((_, idx) => idx !== i))

  const updateTask = (i, val) => {
    const updated = [...tasks]
    updated[i]    = val
    setTasks(updated)
  }

  const handleGenerate = () => {
    dispatch(generateSprintGoal({
      sprintName:     sprintName,
      plannedTasks:   tasks.filter(t => t.trim()),
      projectContext: context,
    }))
  }

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100
                       bg-gradient-to-r from-teal-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br
                           from-teal-500 to-cyan-600
                           rounded-xl flex items-center
                           justify-center shadow-md">
            <RocketLaunchIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Sprint Goal Generator
            </h3>
            <p className="text-xs text-gray-500">
              Generate compelling sprint goals
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <input
          type="text"
          value={sprintName}
          onChange={(e) => setSprintName(e.target.value)}
          placeholder="Sprint name (e.g. Sprint 3)"
          className="w-full px-4 py-3 border border-gray-200
                      rounded-xl text-sm focus:outline-none
                      focus:ring-2 focus:ring-teal-500
                      hover:border-gray-300 transition-all"
        />

        {/* Planned Tasks */}
        <div>
          <div className="flex items-center
                           justify-between mb-2">
            <label className="text-sm font-semibold
                                text-gray-700">
              Planned Tasks
            </label>
            <button
              onClick={addTask}
              className="text-xs text-teal-600 font-medium
                          flex items-center gap-1
                          hover:text-teal-800"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={task}
                  onChange={(e) =>
                    updateTask(i, e.target.value)
                  }
                  placeholder={`Task ${i + 1}...`}
                  className="flex-1 px-3 py-2.5 border
                              border-gray-200 rounded-xl
                              text-sm focus:outline-none
                              focus:ring-2 focus:ring-teal-500
                              hover:border-gray-300 transition-all"
                />
                {tasks.length > 1 && (
                  <button
                    onClick={() => removeTask(i)}
                    className="p-2.5 text-gray-400
                                hover:text-red-500
                                hover:bg-red-50 rounded-xl
                                transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99   }}
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full py-3 rounded-xl font-bold text-sm
                       flex items-center justify-center gap-2
                       transition-all
                       ${isLoading
                         ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                         : 'bg-gradient-to-r from-teal-600 to-cyan-600 ' +
                           'text-white shadow-lg hover:shadow-teal-200'}`}
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-white
                               border-t-transparent rounded-full
                               animate-spin" />Generating...</>
          ) : (
            <><SparklesIcon className="w-4 h-4" />Generate Sprint Goal</>
          )}
        </motion.button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              className="bg-teal-50 border border-teal-100
                           rounded-2xl p-5"
            >
              <div className="flex items-center
                               justify-between mb-3">
                <div className="flex items-center gap-2">
                  <RocketLaunchIcon
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm font-bold
                                    text-teal-700">
                    Sprint Goal
                  </span>
                </div>
                <button
                  onClick={async () => {
                    await navigator.clipboard
                      .writeText(result)
                    toast.success('Copied!')
                  }}
                  className="text-xs text-teal-500
                              hover:text-teal-700
                              flex items-center gap-1"
                >
                  <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>
              <p className="text-sm text-teal-800
                             leading-relaxed
                             whitespace-pre-wrap
                             font-medium">
                "{result}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ================================
