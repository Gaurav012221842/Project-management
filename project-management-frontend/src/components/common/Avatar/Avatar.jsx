// src/components/common/Avatar/Avatar.jsx
import React from 'react'
import { getAvatarColor, formatInitials } from '../../../utils/colorUtils'

const SIZES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
}

function Avatar({ name = '', src, size = 'md', className = '', online }) {
  const initials  = formatInitials(name)
  const colorClass = getAvatarColor(name)
  const sizeClass  = SIZES[size] || SIZES.md

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClass} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold text-white select-none`}
          title={name}
        >
          {initials || '?'}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white ${
            online ? 'bg-green-400' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  )
}

export default Avatar
