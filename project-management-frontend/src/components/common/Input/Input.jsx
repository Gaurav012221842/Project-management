// src/components/common/Input/Input.jsx
import React, { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, hint, leftIcon, rightIcon, className = '', containerClassName = '', ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error
              ? 'border-red-300 focus:ring-red-400 pr-3'
              : 'border-gray-300'
          } ${
            leftIcon  ? 'pl-9' : 'pl-3'
          } ${
            rightIcon ? 'pr-9' : 'pr-3'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
})

export default Input
