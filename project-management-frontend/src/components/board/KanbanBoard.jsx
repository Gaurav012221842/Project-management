
// src/components/board/KanbanBoard.jsx
import { useState, useCallback }    from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import KanbanColumn    from './KanbanColumn'
import TaskCard        from './TaskCard'
import TaskModal       from '../task/TaskModal'
import {
  selectTasks,
  updateTaskStatusOptimistic,
  updateTaskStatus,
} from '../../features/task/taskSlice'

const COLUMNS = [
  { 
    id: 'TODO', 
    label: 'To Do', 
    color: 'bg-gray-100' 
  },
  { 
    id: 'IN_PROGRESS', 
    label: 'In Progress', 
    color: 'bg-blue-100' 
  },
  { 
    id: 'IN_REVIEW', 
    label: 'In Review', 
    color: 'bg-yellow-100' 
  },
  { 
    id: 'DONE', 
    label: 'Done', 
    color: 'bg-green-100' 
  },
]

export default function KanbanBoard() {
  const dispatch     = useDispatch()
  const tasks        = useSelector(selectTasks)
  const [activeTask, setActiveTask] = useState(null)
  const [showModal,  setShowModal]  = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  const getTasksByStatus = useCallback(
    (status) => tasks.filter(
      (task) => task.status === status
    ),
    [tasks]
  )

  const handleDragStart = (event) => {
    const task = tasks.find(
      t => t.id === event.active.id
    )
    setActiveTask(task)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || active.id === over.id) return

    const newStatus = over.id
    const validStatuses = [
      'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'
    ]

    if (validStatuses.includes(newStatus)) {
      // Optimistic update
      dispatch(updateTaskStatusOptimistic({
        taskId: active.id,
        status: newStatus
      }))

      // API call
      dispatch(updateTaskStatus({
        taskId:     active.id,
        statusData: { status: newStatus }
      }))
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowModal(true)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 
                         overflow-x-auto p-6 
                         min-h-screen bg-gray-50">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>

      {showModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setShowModal(false)
            setSelectedTask(null)
          }}
        />
      )}
    </>
  )
}

