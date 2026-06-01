// src/components/board/KanbanColumnHeader.jsx
import React from 'react'
import Badge from '../common/Badge/Badge'

const VARIANT_MAP = {
  TODO:        'default',
  IN_PROGRESS: 'info',
  IN_REVIEW:   'warning',
  DONE:        'success',
}

function KanbanColumnHeader({ title, count = 0, statusKey }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <Badge variant={VARIANT_MAP[statusKey] || 'default'}>{count}</Badge>
    </div>
  )
}

export default KanbanColumnHeader
