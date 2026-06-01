// src/components/common/Tooltip/Tooltip.jsx
import React, { useState } from 'react'

function Tooltip({ children, content, position = 'top', className = '' }) {
  const [visible, setVisible] = useState(false)

  const posClass = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full  left-1/2 -translate-x-1/2 mt-1.5',
    left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right:  'left-full  top-1/2 -translate-y-1/2 ml-1.5',
  }[position] || 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'

  if (!content) return children

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap pointer-events-none ${posClass}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
