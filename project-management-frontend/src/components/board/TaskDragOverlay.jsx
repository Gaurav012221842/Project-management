// src/components/board/TaskDragOverlay.jsx
import React from 'react'

// Rendered as a ghost overlay during drag-and-drop.
// Wraps the dragged card with reduced opacity.
function TaskDragOverlay({ children }) {
  return (
    <div className="opacity-80 rotate-1 scale-105 shadow-xl pointer-events-none">
      {children}
    </div>
  )
}

export default TaskDragOverlay
