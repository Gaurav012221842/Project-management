// src/components/common/Loader/Skeleton.jsx
import React from 'react'

function Skeleton({ className = '', lines = 1, circle = false }) {
  if (circle) {
    return <div className={`animate-pulse rounded-full bg-gray-200 ${className}`} />
  }
  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`animate-pulse rounded bg-gray-200 h-4 ${
              i === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
    )
  }
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
}

export default Skeleton
