// src/components/common/Modal/ModalFooter.jsx
import React from 'react'

function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  )
}

export default ModalFooter
