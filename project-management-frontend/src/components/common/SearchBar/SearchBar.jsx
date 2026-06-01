// src/components/common/SearchBar/SearchBar.jsx
import React from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

function SearchBar({ value, onChange, placeholder = 'Search...', onClear, className = '' }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
      />
      {value && (
        <button
          onClick={() => { onChange(''); onClear?.() }}
          className="absolute right-2 p-1 rounded hover:bg-gray-200 text-gray-400"
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
