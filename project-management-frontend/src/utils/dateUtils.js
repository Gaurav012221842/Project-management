// src/utils/dateUtils.js
import { format, formatDistanceToNow, isValid, parseISO, differenceInDays } from 'date-fns'

export function formatDate(date, fmt = 'MMM d, yyyy') {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, fmt) : '—'
}

export function formatRelative(date) {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '—'
}

export function formatDateTime(date) {
  return formatDate(date, 'MMM d, yyyy · h:mm a')
}

export function daysUntil(date) {
  if (!date) return null
  const d = typeof date === 'string' ? parseISO(date) : date
  return differenceInDays(d, new Date())
}

export function isOverdue(date) {
  if (!date) return false
  return daysUntil(date) < 0
}

export function toISODate(date) {
  if (!date) return null
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, 'yyyy-MM-dd') : null
}
