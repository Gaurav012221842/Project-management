// src/components/ai/AITaskAnalyzer.jsx
import React, { useState } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Button from '../common/Button/Button'
import AILoadingIndicator from './AILoadingIndicator'
import axiosInstance from '../../services/api/axiosInstance'

function AITaskAnalyzer({ task }) {
  const [loading,  setLoading]  = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error,    setError]    = useState(null)

  const analyze = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.post('/api/ai/analyze', {
        title:       task?.title,
        description: task?.description,
        status:      task?.status,
        priority:    task?.priority,
      })
      setAnalysis(res.data)
    } catch {
      setError('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">AI Analysis</h4>
        <Button size="sm" variant="ghost" onClick={analyze} loading={loading} leftIcon={<SparklesIcon className="w-4 h-4" />}>
          Analyze
        </Button>
      </div>

      {loading && <AILoadingIndicator message="Analyzing task..." />}
      {error   && <p className="text-xs text-red-500">{error}</p>}

      {analysis && !loading && (
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 space-y-2">
          {analysis.summary && (
            <p className="text-sm text-gray-700">{analysis.summary}</p>
          )}
          {analysis.suggestions?.length > 0 && (
            <ul className="space-y-1">
              {analysis.suggestions.map((s, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-indigo-500 mt-0.5">&#8226;</span>{s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default AITaskAnalyzer
