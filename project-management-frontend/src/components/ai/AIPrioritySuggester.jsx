// src/components/ai/AIPrioritySuggester.jsx
import React, { useState } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Button from '../common/Button/Button'
import AILoadingIndicator from './AILoadingIndicator'
import axiosInstance from '../../services/api/axiosInstance'

function AIPrioritySuggester({ task, onApply }) {
  const [loading,    setLoading]    = useState(false)
  const [suggestion, setSuggestion] = useState(null)
  const [error,      setError]      = useState(null)

  const getSuggestion = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.post('/api/ai/priority', {
        title:       task.title,
        description: task.description,
      })
      setSuggestion(res.data)
    } catch {
      setError('Failed to get AI suggestion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">AI Priority Suggestion</h4>
        <Button size="sm" variant="ghost" onClick={getSuggestion} loading={loading} leftIcon={<SparklesIcon className="w-4 h-4" />}>
          Analyze
        </Button>
      </div>

      {loading && <AILoadingIndicator message="Analyzing task priority..." />}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {suggestion && !loading && (
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-800">
            Suggested: <strong>{suggestion.priority}</strong>
          </p>
          {suggestion.reason && (
            <p className="text-xs text-indigo-600 mt-1">{suggestion.reason}</p>
          )}
          {onApply && (
            <Button size="xs" className="mt-2" onClick={() => onApply(suggestion.priority)}>
              Apply
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default AIPrioritySuggester
