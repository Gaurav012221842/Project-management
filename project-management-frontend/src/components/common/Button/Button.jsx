// src/components/common/Button/Button.jsx
import React from 'react'
import Spinner from '../Loader/Spinner'

const VARIANTS = {
  primary:   'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
  secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  ghost:     'hover:bg-gray-100 text-gray-600',
  link:      'text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline',
}

const SIZES = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false,
  leftIcon, rightIcon, className = '',
  ...props
}) {
  const isDisabled = disabled || loading
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}

export default Button
