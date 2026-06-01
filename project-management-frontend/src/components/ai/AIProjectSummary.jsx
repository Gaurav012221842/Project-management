
// src/components/ai/AIProjectSummary.jsx
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  SparklesIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import {
  summarizeProject,
  selectAILoading,
  selectLastSummary,
} from '../../features/ai/aiSlice'
import toast from 'react-hot-toast'

export default function AIProjectSummary({ projectId }) {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectAILoading)
  const result    = useSelector(selectLastSummary)

  const handleSummarize = () => {
    if (!projectId) return
    dispatch(summarizeProject({
      projectId,
      focusArea: 'Overall',
    }))
  }

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100
                       bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br
                           from-orange-500 to-red-600
                           rounded-xl flex items-center
                           justify-center shadow-md">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Project Summary
            </h3>
            <p className="text-xs text-gray-500">
              AI-generated project status report
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">

        <div className="bg-orange-50 border border-orange-100
                         rounded-xl p-4">
          <p className="text-sm text-orange-700 font-medium">
            🤖 AI will analyze your project's tasks,
            sprints, and progress to generate
            a comprehensive status summary.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99   }}
          onClick={handleSummarize}
          disabled={isLoading || !projectId}
          className={`w-full py-3 rounded-xl font-bold text-sm
                       flex items-center justify-center gap-2
                       transition-all
                       ${isLoading || !projectId
                         ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                         : 'bg-gradient-to-r from-orange-600 to-red-600 ' +
                           'text-white shadow-lg hover:shadow-orange-200'}`}
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-white
                               border-t-transparent rounded-full
                               animate-spin" />Generating Summary...</>
          ) : (
            <><SparklesIcon className="w-4 h-4" />Generate Project Summary</>
          )}
        </motion.button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              className="bg-gray-50 rounded-2xl p-5
                           border border-gray-100"
            >
              <div className="flex items-center
                               justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SparklesIcon
                    className="w-4 h-4 text-orange-500"
                  />
                  <span className="text-sm font-bold
                                    text-gray-700">
                    Project Summary
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSummarize}
                    className="text-xs text-gray-400
                                hover:text-orange-600
                                flex items-center gap-1"
                  >
                    <ArrowPathIcon className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                  <button
                    onClick={async () => {
                      await navigator.clipboard
                        .writeText(result)
                      toast.success('Copied!')
                    }}
                    className="text-xs text-gray-400
                                hover:text-orange-600
                                flex items-center gap-1"
                  >
                    <ClipboardDocumentIcon
                      className="w-3.5 h-3.5"
                    />
                    Copy
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
        </AnimatePresence>
      </div>
    </div>
  )
}