// src/components/common/Modal/ModalBody.jsx
import React from 'react'

function ModalBody({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 overflow-y-auto flex-1 ${className}`}>
      {children}
    </div>
  )
}

export default ModalBody
