// src/components/ai/AIBugAnalyzer.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  BugAntIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import {
  analyzeBug,
  selectAILoading,
  selectLastBugAnalysis,
} from '../../features/ai/aiSlice'

const SEVERITY_CONFIG = {
  LOW:      { color: 'text-green-600  bg-green-100',  icon: '🟢' },
  MEDIUM:   { color: 'text-yellow-600 bg-yellow-100', icon: '🟡' },
  HIGH:     { color: 'text-orange-600 bg-orange-100', icon: '🟠' },
  CRITICAL: { color: 'text-red-600    bg-red-100',    icon: '🔴' },
}

export default function AIBugAnalyzer() {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectAILoading)
  const result    = useSelector(selectLastBugAnalysis)

  const [description, setDescription] = useState('')
  const [errorLog,    setErrorLog]     = useState('')
  const [component,   setComponent]   = useState('')
  const [steps,       setSteps]       = useState('')

  const handleAnalyze = () => {
    if (!description.trim()) return
    dispatch(analyzeBug({
      bugDescription:     description,
      errorLog:           errorLog,
      affectedComponent:  component,
      stepsToReproduce:   steps,
    }))
  }

  const severity = result?.severity
    ? SEVERITY_CONFIG[result.severity] ||
      SEVERITY_CONFIG.MEDIUM
    : null

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm
                     overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100
                       bg-gradient-to-r from-red-50
                       to-pink-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br
                           from-red-500 to-pink-600
                           rounded-xl flex items-center
                           justify-center shadow-md">
            <BugAntIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Bug Analyzer
            </h3>
            <p className="text-xs text-gray-500">
              AI-powered root cause analysis
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Bug Description */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-1.5">
            Bug Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what went wrong..."
            rows={3}
            className="w-full px-4 py-3 border
                        border-gray-200 rounded-xl text-sm
                        resize-none focus:outline-none
                        focus:ring-2 focus:ring-red-500
                        hover:border-gray-300
                        transition-all"
          />
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold
                                text-gray-700 mb-1.5">
              Affected Component
            </label>
            <input
              type="text"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              placeholder="e.g. Auth Module"
              className="w-full px-4 py-3 border
                          border-gray-200 rounded-xl
                          text-sm focus:outline-none
                          focus:ring-2 focus:ring-red-500
                          hover:border-gray-300
                          transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold
                                text-gray-700 mb-1.5">
              Steps to Reproduce
            </label>
            <input
              type="text"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1. Open app 2. Click..."
              className="w-full px-4 py-3 border
                          border-gray-200 rounded-xl
                          text-sm focus:outline-none
                          focus:ring-2 focus:ring-red-500
                          hover:border-gray-300
                          transition-all"
            />
          </div>
        </div>

        {/* Error Log */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-1.5">
            Error Log (optional)
          </label>
          <textarea
            value={errorLog}
            onChange={(e) => setErrorLog(e.target.value)}
            placeholder="Paste error message or stack trace..."
            rows={3}
            className="w-full px-4 py-3 border
                        border-gray-200 rounded-xl text-sm
                        font-mono resize-none
                        focus:outline-none focus:ring-2
                        focus:ring-red-500 bg-gray-50
                        hover:border-gray-300
                        transition-all"
          />
        </div>

        {/* Analyze Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99   }}
          onClick={handleAnalyze}
          disabled={!description.trim() || isLoading}
          className={`
            w-full py-3 rounded-xl font-bold text-sm
            flex items-center justify-center gap-2
            transition-all
            ${!description.trim() || isLoading
              ? 'bg-gray-200 text-gray-400 ' +
                'cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 ' +
                'to-pink-600 text-white shadow-lg ' +
                'hover:shadow-red-200'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2
                               border-white
                               border-t-transparent
                               rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              Analyze Bug
            </>
          )}
        </motion.button>

        {/* Bug Analysis Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              className="space-y-4"
            >
              {/* Severity + Area */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl
                                 p-4 text-center">
                  <p className="text-xs text-gray-400
                                 font-medium mb-2">
                    Severity
                  </p>
                  <div className="flex items-center
                                   justify-center gap-2">
                    <span className="text-xl">
                      {severity?.icon}
                    </span>
                    <span className={`
                      text-sm font-black px-2.5 py-1
                      rounded-full ${severity?.color}
                    `}>
                      {result.severity}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl
                                 p-4 text-center">
                  <p className="text-xs text-gray-400
                                 font-medium mb-2">
                    Est. Fix Time
                  </p>
                  <div className="flex items-center
                                   justify-center gap-1.5">
                    <ClockIcon
                      className="w-4 h-4 text-gray-500"
                    />
                    <span className="text-sm font-bold
                                      text-gray-800">
                      {result.estimatedFixTime || '?'}h
                    </span>
                  </div>
                </div>
              </div>

              {/* Root Cause */}
              <div className="bg-red-50 border
                               border-red-100 rounded-xl
                               p-4">
                <div className="flex items-center gap-2
                                 mb-2">
                  <ExclamationTriangleIcon
                    className="w-4 h-4 text-red-500"
                  />
                  <p className="text-sm font-bold
                                 text-red-700">
                    Root Cause
                  </p>
                </div>
                <p className="text-sm text-red-600
                               leading-relaxed">
                  {result.rootCause}
                </p>
              </div>

              {/* Possible Fixes */}
              {result.possibleFixes?.length > 0 && (
                <div className="bg-green-50 border
                                 border-green-100
                                 rounded-xl p-4">
                  <div className="flex items-center
                                   gap-2 mb-3">
                    <LightBulbIcon
                      className="w-4 h-4 text-green-600"
                    />
                    <p className="text-sm font-bold
                                   text-green-700">
                      Possible Fixes
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {result.possibleFixes.map(
                      (fix, i) => (
                      <li
                        key={i}
                        className="flex items-start
                                    gap-2 text-sm
                                    text-green-700"
                      >
                        <span className="w-5 h-5
                                          bg-green-200
                                          text-green-700
                                          rounded-full
                                          flex items-center
                                          justify-center
                                          text-xs font-bold
                                          flex-shrink-0
                                          mt-0.5">
                          {i + 1}
                        </span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention Tips */}
              {result.preventionTips?.length > 0 && (
                <div className="bg-blue-50 border
                                 border-blue-100
                                 rounded-xl p-4">
                  <div className="flex items-center
                                   gap-2 mb-3">
                    <ShieldCheckIcon
                      className="w-4 h-4 text-blue-600"
                    />
                    <p className="text-sm font-bold
                                   text-blue-700">
                      Prevention Tips
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {result.preventionTips.map(
                      (tip, i) => (
                      <li
                        key={i}
                        className="flex items-start
                                    gap-2 text-sm
                                    text-blue-700"
                      >
                        <span className="text-blue-400
                                          mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}