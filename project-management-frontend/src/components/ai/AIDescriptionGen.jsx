// src/components/ai/AIDescriptionGen.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion }                   from 'framer-motion'
import {
  DocumentTextIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import {
  generateDescription,
  selectAILoading,
  selectLastDescription,
} from '../../features/ai/aiSlice'
import toast from 'react-hot-toast'

const TASK_TYPES = [
  'FEATURE', 'BUG', 'IMPROVEMENT', 'TASK'
]

export default function AIDescriptionGen() {
  const dispatch   = useDispatch()
  const isLoading  = useSelector(selectAILoading)
  const result     = useSelector(selectLastDescription)

  const [title,    setTitle]    = useState('')
  const [context,  setContext]  = useState('')
  const [taskType, setTaskType] = useState('FEATURE')
  const [copied,   setCopied]   = useState(false)

  const handleGenerate = () => {
    if (!title.trim()) return
    dispatch(generateDescription({
      taskTitle:      title,
      projectContext: context,
      taskType,
    }))
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm
                     overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100
                       bg-gradient-to-r from-blue-50
                       to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br
                           from-blue-500 to-cyan-600
                           rounded-xl flex items-center
                           justify-center shadow-md">
            <DocumentTextIcon
              className="w-5 h-5 text-white"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Description Generator
            </h3>
            <p className="text-xs text-gray-500">
              Auto-generate professional task descriptions
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Task Title */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement user authentication"
            className="w-full px-4 py-3 border
                        border-gray-200 rounded-xl text-sm
                        focus:outline-none focus:ring-2
                        focus:ring-blue-500
                        hover:border-gray-300
                        transition-all"
          />
        </div>

        {/* Task Type */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-2">
            Task Type
          </label>
          <div className="flex gap-2">
            {TASK_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTaskType(t)}
                className={`
                  flex-1 py-2 rounded-xl text-xs
                  font-semibold border-2 transition-all
                  ${taskType === t
                    ? 'bg-blue-600 text-white ' +
                      'border-blue-600'
                    : 'bg-white text-gray-500 ' +
                      'border-gray-200 ' +
                      'hover:border-blue-300'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Project Context */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-1.5">
            Project Context (optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Brief description of your project..."
            rows={2}
            className="w-full px-4 py-3 border
                        border-gray-200 rounded-xl text-sm
                        resize-none focus:outline-none
                        focus:ring-2 focus:ring-blue-500
                        hover:border-gray-300
                        transition-all"
          />
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99   }}
          onClick={handleGenerate}
          disabled={!title.trim() || isLoading}
          className={`
            w-full py-3 rounded-xl font-bold text-sm
            flex items-center justify-center gap-2
            transition-all
            ${!title.trim() || isLoading
              ? 'bg-gray-200 text-gray-400 ' +
                'cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 ' +
                'to-cyan-600 text-white shadow-lg ' +
                'hover:shadow-blue-200'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2
                               border-white
                               border-t-transparent
                               rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              Generate Description
            </>
          )}
        </motion.button>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y:  0 }}
            className="bg-gray-50 rounded-2xl p-5
                         border border-gray-200"
          >
            <div className="flex items-center
                             justify-between mb-3">
              <div className="flex items-center gap-2">
                <SparklesIcon
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-sm font-bold
                                  text-gray-700">
                  Generated Description
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1
                              text-xs text-gray-400
                              hover:text-blue-600
                              transition-colors"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1
                               text-xs transition-colors
                               ${copied
                                 ? 'text-green-600'
                                 : 'text-gray-400 ' +
                                   'hover:text-blue-600'
                               }`}
                >
                  <ClipboardDocumentIcon
                    className="w-3.5 h-3.5"
                  />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700
                           leading-relaxed
                           whitespace-pre-wrap">
              {result}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}