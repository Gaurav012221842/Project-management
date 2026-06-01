// src/components/ai/AILoadingIndicator.jsx
import React from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'

function AILoadingIndicator({ message = 'AI is thinking...' }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
      <SparklesIcon className="w-5 h-5 text-indigo-500 animate-pulse flex-shrink-0" />
      <div className="space-y-1.5 flex-1">
        <p className="text-sm text-indigo-700 font-medium">{message}</p>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AILoadingIndicator
