// ================================

// src/components/board/KanbanColumn.jsx
import { useDroppable }    from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy }
  from '@dnd-kit/sortable'
import TaskCard            from './TaskCard'
import AddTaskButton       from './AddTaskButton'

const COLUMN_STYLES = {
  TODO:        'border-gray-300',
  IN_PROGRESS: 'border-blue-300',
  IN_REVIEW:   'border-yellow-300',
  DONE:        'border-green-300',
}

const HEADER_STYLES = {
  TODO:        'bg-gray-200 text-gray-700',
  IN_PROGRESS: 'bg-blue-200 text-blue-700',
  IN_REVIEW:   'bg-yellow-200 text-yellow-700',
  DONE:        'bg-green-200 text-green-700',
}

export default function KanbanColumn({ 
  column, 
  tasks, 
  onTaskClick 
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id
  })

  return (
    <div className={`flex flex-col w-72 flex-shrink-0 
                     rounded-xl border-2 
                     ${COLUMN_STYLES[column.id]}
                     ${isOver ? 'border-indigo-400 ' +
                       'bg-indigo-50' : 'bg-white'}
                     transition-colors`}>

      {/* Column Header */}
      <div className={`px-4 py-3 rounded-t-xl 
                        flex items-center justify-between
                        ${HEADER_STYLES[column.id]}`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">
            {column.label}
          </h3>
          <span className="px-2 py-0.5 bg-white 
                            bg-opacity-60 rounded-full 
                            text-xs font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 space-y-3 
                    min-h-[200px]"
      >
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center 
                           justify-center h-24 
                           border-2 border-dashed 
                           border-gray-200 rounded-lg">
            <p className="text-gray-400 text-sm">
              Drop tasks here
            </p>
          </div>
        )}
      </div>

      {/* Add Task */}
      <div className="p-3 border-t border-gray-100">
        <AddTaskButton status={column.id} />
      </div>
    </div>
  )
}
