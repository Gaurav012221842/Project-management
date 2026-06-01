// src/components/board/TaskCardSkeleton.jsx
import React from 'react'
import Skeleton from '../common/Loader/Skeleton'

function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-7 w-7 rounded-full" circle />
      </div>
    </div>
  )
}

export default TaskCardSkeleton
