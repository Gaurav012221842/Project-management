// src/components/ai/AIEstimator.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  ChartBarIcon,
  SparklesIcon,
  ClockIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import {
  estimateStoryPoints,
  selectAILoading,
  selectLastEstimate,
} from '../../features/ai/aiSlice'

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21]
const COMPLEXITY = ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']

const COMPLEXITY_COLORS = {
  LOW:       'text-green-700  bg-green-100',
  MEDIUM:    'text-blue-700   bg-blue-100',
  HIGH:      'text-orange-700 bg-orange-100',
  VERY_HIGH: 'text-red-700    bg-red-100',
}

export default function AIEstimator() {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectAILoading)
  const result    = useSelector(selectLastEstimate)

  const [title,      setTitle]      = useState('')
  const [desc,       setDesc]       = useState('')
  const [taskType,   setTaskType]   = useState('FEATURE')
  const [complexity, setComplexity] = useState('MEDIUM')

  const handleEstimate = () => {
    if (!title.trim()) return
    dispatch(estimateStoryPoints({
      taskTitle:       title,
      taskDescription: desc,
      taskType,
      complexity,
    }))
  }

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm
                     overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100
                       bg-gradient-to-r from-green-50
                       to-emerald-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br
                           from-green-500 to-emerald-600
                           rounded-xl flex items-center
                           justify-center shadow-md">
            <ChartBarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Story Point Estimator
            </h3>
            <p className="text-xs text-gray-500">
              AI-powered effort estimation
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 border
                        border-gray-200 rounded-xl text-sm
                        focus:outline-none focus:ring-2
                        focus:ring-green-500
                        hover:border-gray-300 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-1.5">
            Description (optional)
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="More details for better estimation..."
            rows={2}
            className="w-full px-4 py-3 border
                        border-gray-200 rounded-xl text-sm
                        resize-none focus:outline-none
                        focus:ring-2 focus:ring-green-500
                        hover:border-gray-300 transition-all"
          />
        </div>

        {/* Complexity */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-2">
            Complexity
          </label>
          <div className="grid grid-cols-4 gap-2">
            {COMPLEXITY.map(c => (
              <button
                key={c}
                onClick={() => setComplexity(c)}
                className={`
                  py-2.5 rounded-xl text-xs font-bold
                  border-2 transition-all
                  ${complexity === c
                    ? COMPLEXITY_COLORS[c] +
                      ' border-current'
                    : 'border-gray-200 text-gray-500 ' +
                      'hover:border-gray-300'
                  }
                `}
              >
                {c.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Estimate Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99   }}
          onClick={handleEstimate}
          disabled={!title.trim() || isLoading}
          className={`
            w-full py-3 rounded-xl font-bold text-sm
            flex items-center justify-center gap-2
            transition-all
            ${!title.trim() || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 ' +
                'to-emerald-600 text-white shadow-lg ' +
                'hover:shadow-green-200'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2
                               border-white
                               border-t-transparent
                               rounded-full animate-spin" />
              Estimating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              Estimate Story Points
            </>
          )}
        </motion.button>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1    }}
              className="space-y-4"
            >
              {/* Main Result */}
              <div className="bg-gradient-to-br
                               from-green-50 to-emerald-50
                               rounded-2xl p-6 text-center
                               border border-green-100">
                <p className="text-sm text-green-600
                               font-medium mb-2">
                  Estimated Story Points
                </p>
                <div className="flex items-center
                                 justify-center gap-3 mb-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type:   'spring',
                      bounce: 0.4,
                    }}
                    className="w-20 h-20 bg-green-600
                                rounded-2xl flex items-center
                                justify-center shadow-xl
                                shadow-green-200"
                  >
                    <span className="text-4xl font-black
                                      text-white">
                      {result.storyPoints}
                    </span>
                  </motion.div>
                </div>

                <div className="flex items-center
                                 justify-center gap-3">
                  <span className={`
                    px-3 py-1 rounded-full text-xs
                    font-bold
                    ${COMPLEXITY_COLORS[
                      result.complexityLevel
                    ] || COMPLEXITY_COLORS.MEDIUM}
                  `}>
                    {result.complexityLevel}
                  </span>
                  <div className="flex items-center
                                   gap-1 text-xs
                                   text-gray-500">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {result.timeEstimate}
                  </div>
                  <div className="flex items-center
                                   gap-1 text-xs
                                   text-gray-500">
                    <BoltIcon className="w-3.5 h-3.5" />
                    {result.confidence}% confident
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold
                               text-gray-500 uppercase
                               tracking-wider mb-2">
                  AI Reasoning
                </p>
                <p className="text-sm text-gray-700
                               leading-relaxed">
                  {result.reason}
                </p>
              </div>

              {/* Fibonacci Scale */}
              <div>
                <p className="text-xs font-semibold
                               text-gray-500 mb-3">
                  Fibonacci Scale
                </p>
                <div className="flex gap-2">
                  {FIBONACCI.map(pt => (
                    <div
                      key={pt}
                      className={`
                        flex-1 py-2 rounded-xl
                        text-center text-sm font-bold
                        transition-all
                        ${result.storyPoints === pt
                          ? 'bg-green-600 text-white ' +
                            'shadow-md scale-110'
                          : 'bg-gray-100 text-gray-500'
                        }
                      `}
                    >
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}