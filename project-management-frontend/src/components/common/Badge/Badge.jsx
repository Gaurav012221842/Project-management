// src/components/common/Badge/Badge.jsx
import React from 'react'

const VARIANTS = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-indigo-100 text-indigo-700',
  success: 'bg-green-100  text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100    text-red-700',
  info:    'bg-blue-100   text-blue-700',
}

function Badge({ children, variant = 'default', className = '', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant] || VARIANTS.default} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export default Badge
