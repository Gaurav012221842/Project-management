// src/components/ai/AIPriorityAdvisor.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import { BoltIcon, SparklesIcon }   from '@heroicons/react/24/outline'
import {
  suggestPriority,
  selectAILoading,
  selectLastPriority,
} from '../../features/ai/aiSlice'

const PRIORITY_CONFIG = {
  LOW:      { color: 'bg-gray-100   text-gray-700',   emoji: '🟢' },
  MEDIUM:   { color: 'bg-blue-100   text-blue-700',   emoji: '🔵' },
  HIGH:     { color: 'bg-orange-100 text-orange-700', emoji: '🟠' },
  CRITICAL: { color: 'bg-red-100    text-red-700',    emoji: '🔴' },
}

export default function AIPriorityAdvisor() {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectAILoading)
  const result    = useSelector(selectLastPriority)

  const [title, setTitle] = useState('')
  const [desc,  setDesc]  = useState('')
  const [type,  setType]  = useState('FEATURE')

  const handleSuggest = () => {
    if (!title.trim()) return
    dispatch(suggestPriority({
      taskTitle:       title,
      taskDescription: desc,
      taskType:        type,
    }))
  }

  const config = result?.suggestedPriority
    ? PRIORITY_CONFIG[result.suggestedPriority]
    : null

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100
                       bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br
                           from-yellow-500 to-orange-600
                           rounded-xl flex items-center
                           justify-center shadow-md">
            <BoltIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Priority Advisor
            </h3>
            <p className="text-xs text-gray-500">
              AI-powered priority suggestions
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="w-full px-4 py-3 border border-gray-200
                      rounded-xl text-sm focus:outline-none
                      focus:ring-2 focus:ring-yellow-500
                      hover:border-gray-300 transition-all"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe the task for better suggestion..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-200
                      rounded-xl text-sm resize-none
                      focus:outline-none focus:ring-2
                      focus:ring-yellow-500
                      hover:border-gray-300 transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99   }}
          onClick={handleSuggest}
          disabled={!title.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-bold text-sm
                       flex items-center justify-center gap-2
                       transition-all
                       ${!title.trim() || isLoading
                         ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                         : 'bg-gradient-to-r from-yellow-500 to-orange-600 ' +
                           'text-white shadow-lg hover:shadow-yellow-200'}`}
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-white
                               border-t-transparent rounded-full
                               animate-spin" />Suggesting...</>
          ) : (
            <><SparklesIcon className="w-4 h-4" />Suggest Priority</>
          )}
        </motion.button>

        <AnimatePresence>
          {result && config && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              className="bg-gray-50 rounded-2xl p-5
                           border border-gray-100 space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {config.emoji}
                </span>
                <div>
                  <span className={`px-3 py-1.5 rounded-xl
                                     text-sm font-black
                                     ${config.color}`}>
                    {result.suggestedPriority}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {result.confidence}% confidence
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700
                             leading-relaxed">
                {result.reason}
              </p>
              {result.alternativePriority && (
                <p className="text-xs text-gray-400">
                  Alternative:{' '}
                  <span className="font-semibold">
                    {result.alternativePriority}
                  </span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ================================
