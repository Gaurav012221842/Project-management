
// src/components/ai/AISubTaskGenerator.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  PuzzlePieceIcon,
  SparklesIcon,
  ClockIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import {
  generateSubTasks,
  selectAILoading,
  selectLastSubTasks,
} from '../../features/ai/aiSlice'

export default function AISubTaskGenerator() {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectAILoading)
  const result    = useSelector(selectLastSubTasks)

  const [title, setTitle]   = useState('')
  const [desc,  setDesc]    = useState('')
  const [max,   setMax]     = useState(5)

  const handleGenerate = () => {
    if (!title.trim()) return
    dispatch(generateSubTasks({
      taskTitle:       title,
      taskDescription: desc,
      maxSubTasks:     max,
    }))
  }

  const totalHours = result?.subTasks?.reduce(
    (sum, s) => sum + (s.estimatedHours || 0), 0
  ) || 0

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100
                       bg-gradient-to-r from-purple-50 to-violet-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br
                           from-purple-500 to-violet-600
                           rounded-xl flex items-center
                           justify-center shadow-md">
            <PuzzlePieceIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Sub-Task Generator
            </h3>
            <p className="text-xs text-gray-500">
              Break complex tasks into sub-tasks
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Main task title..."
          className="w-full px-4 py-3 border border-gray-200
                      rounded-xl text-sm focus:outline-none
                      focus:ring-2 focus:ring-purple-500
                      hover:border-gray-300 transition-all"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe what needs to be done..."
          rows={2}
          className="w-full px-4 py-3 border border-gray-200
                      rounded-xl text-sm resize-none
                      focus:outline-none focus:ring-2
                      focus:ring-purple-500
                      hover:border-gray-300 transition-all"
        />
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold
                              text-gray-700 flex-shrink-0">
            Max Sub-tasks:
          </label>
          <input
            type="range"
            min="3" max="10"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="flex-1 accent-purple-600"
          />
          <span className="text-sm font-bold
                            text-purple-600 w-6">
            {max}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99   }}
          onClick={handleGenerate}
          disabled={!title.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-bold text-sm
                       flex items-center justify-center gap-2
                       transition-all
                       ${!title.trim() || isLoading
                         ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                         : 'bg-gradient-to-r from-purple-600 to-violet-600 ' +
                           'text-white shadow-lg hover:shadow-purple-200'}`}
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-white
                               border-t-transparent rounded-full
                               animate-spin" />Generating...</>
          ) : (
            <><SparklesIcon className="w-4 h-4" />Generate Sub-Tasks</>
          )}
        </motion.button>

        <AnimatePresence>
          {result?.subTasks?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              className="space-y-3"
            >
              <div className="flex items-center
                               justify-between">
                <p className="text-sm font-bold
                               text-gray-700">
                  {result.subTasks.length} Sub-Tasks
                </p>
                <div className="flex items-center gap-1.5
                                 text-xs text-gray-500
                                 bg-gray-100 px-2.5 py-1
                                 rounded-full">
                  <ClockIcon className="w-3.5 h-3.5" />
                  ~{totalHours}h total
                </div>
              </div>

              {result.subTasks.map((st, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x:  0  }}
                  transition={{
                    duration: 0.3,
                    delay:    index * 0.08
                  }}
                  className="flex items-start gap-3
                               p-4 bg-gray-50 rounded-xl
                               border border-gray-100
                               hover:border-purple-200
                               hover:bg-purple-50/30
                               transition-all group"
                >
                  <div className="w-6 h-6 bg-purple-600
                                   rounded-lg flex items-center
                                   justify-center text-white
                                   text-xs font-black
                                   flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold
                                   text-gray-800">
                      {st.title}
                    </p>
                    {st.description && (
                      <p className="text-xs text-gray-500
                                     mt-0.5 leading-relaxed">
                        {st.description}
                      </p>
                    )}
                    <div className="flex items-center
                                     gap-3 mt-2">
                      <span className="text-[10px] text-gray-400
                                        bg-gray-100 px-2 py-0.5
                                        rounded-full">
                        {st.priority}
                      </span>
                      {st.estimatedHours && (
                        <span className="text-[10px]
                                          text-gray-400
                                          flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {st.estimatedHours}h
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ================================
