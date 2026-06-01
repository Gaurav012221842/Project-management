// src/components/common/Pagination/Pagination.jsx
import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

function Pagination({ page, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)
  const showEllipsis = totalPages > 7

  const visiblePages = showEllipsis
    ? [...new Set([0, 1, page - 1, page, page + 1, totalPages - 2, totalPages - 1])]
        .filter(p => p >= 0 && p < totalPages)
        .sort((a, b) => a - b)
    : pages

  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {visiblePages.map((p, i) => {
        const prev = visiblePages[i - 1]
        return (
          <React.Fragment key={p}>
            {showEllipsis && prev !== undefined && p - prev > 1 && (
              <span className="px-2 text-gray-400 text-sm">&hellip;</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {p + 1}
            </button>
          </React.Fragment>
        )
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </nav>
  )
}

export default Pagination
