// src/utils/colorUtils.js
export const PROJECT_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#ef4444',
  '#f97316','#eab308','#22c55e','#14b8a6',
  '#3b82f6','#06b6d4',
]

export const PRIORITY_COLORS = {
  LOW:    '#22c55e',
  MEDIUM: '#eab308',
  HIGH:   '#f97316',
  URGENT: '#ef4444',
}

export const STATUS_COLORS = {
  TODO:        '#6b7280',
  IN_PROGRESS: '#3b82f6',
  IN_REVIEW:   '#f59e0b',
  DONE:        '#22c55e',
}

export function getAvatarColor(name = '') {
  const palette = [
    'bg-indigo-500','bg-purple-500','bg-pink-500','bg-red-500',
    'bg-orange-500','bg-yellow-500','bg-green-500','bg-teal-500',
    'bg-blue-500','bg-cyan-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

export function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function statusToBadgeClass(status) {
  const map = {
    TODO:        'bg-gray-100  text-gray-700',
    IN_PROGRESS: 'bg-blue-100  text-blue-700',
    IN_REVIEW:   'bg-yellow-100 text-yellow-700',
    DONE:        'bg-green-100 text-green-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

export function priorityToBadgeClass(priority) {
  const map = {
    LOW:    'bg-green-100  text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH:   'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100    text-red-700',
  }
  return map[priority] || 'bg-gray-100 text-gray-700'
}
