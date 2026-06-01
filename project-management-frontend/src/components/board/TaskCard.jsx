
// ================================

// src/components/board/TaskCard.jsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS }         from '@dnd-kit/utilities'
import { format }      from 'date-fns'
import {
  ChatBubbleLeftIcon,
  PaperClipIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    class: 'bg-gray-100 text-gray-600'
  },
  MEDIUM: {
    label: 'Medium',
    class: 'bg-blue-100 text-blue-600'
  },
  HIGH: {
    label: 'High',
    class: 'bg-orange-100 text-orange-600'
  },
  CRITICAL: {
    label: 'Critical',
    class: 'bg-red-100 text-red-600'
  }
}

export default function TaskCard({ 
  task, 
  isDragging,
  onClick 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({ id: task.id })

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
  }

  const priority = PRIORITY_CONFIG[task.priority]
  const isOverdue = task.dueDate && 
    new Date(task.dueDate) < new Date() &&
    task.status !== 'DONE'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white rounded-lg p-3 
                   border border-gray-200
                   cursor-pointer select-none
                   hover:shadow-md hover:border-indigo-200
                   transition-all duration-200
                   ${isDragging || isSortableDragging 
                     ? 'opacity-50 shadow-lg rotate-2' 
                     : ''}
                  `}
    >
      {/* Labels */}
      {task.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="px-2 py-0.5 rounded-full 
                          text-xs font-medium text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="text-sm font-medium 
                      text-gray-900 mb-2 
                      line-clamp-2">
        {task.title}
      </h4>

      {/* Priority & Type */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded text-xs 
                          font-medium 
                          ${priority.class}`}>
          {priority.label}
        </span>
        <span className="text-xs text-gray-400">
          {task.taskType}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Comments Count */}
          <div className="flex items-center gap-1 
                           text-gray-400">
            <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
            <span className="text-xs">
              {task.commentsCount || 0}
            </span>
          </div>

          {/* Attachments Count */}
          {task.attachmentsCount > 0 && (
            <div className="flex items-center gap-1 
                             text-gray-400">
              <PaperClipIcon className="w-3.5 h-3.5" />
              <span className="text-xs">
                {task.attachmentsCount}
              </span>
            </div>
          )}

          {/* Story Points */}
          <span className="px-1.5 py-0.5 
                            bg-indigo-50 text-indigo-600
                            rounded text-xs font-medium">
            {task.storyPoints}p
          </span>
        </div>

        {/* Assignee Avatar */}
        {task.assignedTo && (
          <img
            src={task.assignedTo.profilePic || 
                 '/default-avatar.png'}
            alt={task.assignedTo.name}
            className="w-6 h-6 rounded-full 
                        object-cover border-2 
                        border-white shadow-sm"
            title={task.assignedTo.name}
          />
        )}
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`flex items-center gap-1 
                          mt-2 text-xs
                          ${isOverdue 
                            ? 'text-red-500' 
                            : 'text-gray-400'}`}>
          <CalendarIcon className="w-3.5 h-3.5" />
          {format(new Date(task.dueDate), 'MMM dd')}
          {isOverdue && (
            <span className="text-red-500 font-medium">
              Overdue
            </span>
          )}
        </div>
      )}
    </div>
  )
}