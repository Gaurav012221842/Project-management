// src/components/sprint/SprintList.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { selectSprints, selectSprintLoading } from '../../features/sprint/sprintSlice'
import Skeleton    from '../common/Loader/Skeleton'
import EmptyState  from '../common/EmptyState/EmptyState'
import { formatDate }from '../../utils/dateUtils'
import Badge        from '../common/Badge/Badge'

const STATUS_VARIANT = {
  PLANNING: 'default',
  ACTIVE:   'success',
  COMPLETED:'primary',
}

function SprintList({ onSprintClick, projectId }) {
  const sprints  = useSelector(selectSprints)
  const loading  = useSelector(selectSprintLoading)

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!sprints.length) {
    return <EmptyState title="No sprints yet" description="Create your first sprint to start planning." />
  }

  return (
    <div className="space-y-2">
      {sprints.map(sprint => (
        <button
          key={sprint.id}
          onClick={() => onSprintClick?.(sprint)}
          className="w-full p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all text-left"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-800">{sprint.name}</h3>
            <Badge variant={STATUS_VARIANT[sprint.status] || 'default'}>{sprint.status}</Badge>
          </div>
          <p className="text-xs text-gray-400">
            {formatDate(sprint.startDate)} &ndash; {formatDate(sprint.endDate)}
          </p>
        </button>
      ))}
    </div>
  )
}

export default SprintList
