// src/utils/formatUtils.js
export function truncate(str, maxLen = 80) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const exp   = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** exp).toFixed(1)} ${units[exp]}`
}

export function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export function slugify(str = '') {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
