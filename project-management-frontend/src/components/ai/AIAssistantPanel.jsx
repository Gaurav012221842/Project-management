// src/components/ai/AIAssistantPanel.jsx
import React from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { useSelector }  from 'react-redux'
import { selectAILoading } from '../../features/ai/aiSlice'
import AILoadingIndicator from './AILoadingIndicator'

function AIAssistantPanel({ children }) {
  const loading = useSelector(selectAILoading)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <SparklesIcon className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base font-semibold text-gray-800">AI Assistant</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && <AILoadingIndicator />}
        {children}
      </div>
    </div>
  )
}

export default AIAssistantPanel
