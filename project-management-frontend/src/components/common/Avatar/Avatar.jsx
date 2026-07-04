// src/components/common/Avatar/Avatar.jsx
import React, { useMemo, useState } from 'react'
import { getAvatarColor } from '../../../utils/colorUtils'
import { formatInitials } from '../../../utils/formatUtils'
import appConfig from '../../../config/appConfig'

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
  const [hasImageError, setHasImageError] = useState(false)
  const imageSrc = useMemo(() => {
    if (!src || typeof src !== 'string') return ''
    const value = src.trim()
    if (!value) return ''
    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:') ||
      value.startsWith('blob:') ||
      value.startsWith('/')
    ) {
      return value
    }

    const baseUrl = appConfig.apiUrl.replace(/\/$/, '')
    const path = value.replace(/^\//, '')
    return `${baseUrl}/${path}`
  }, [src])
  const showImage = imageSrc && !hasImageError

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {showImage ? (
        <img
          src={imageSrc}
          alt={name}
          className={`${sizeClass} rounded-full object-cover`}
          onError={() => setHasImageError(true)}
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
