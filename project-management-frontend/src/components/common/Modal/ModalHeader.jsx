// src/components/common/Modal/ModalHeader.jsx
import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

function ModalHeader({ children, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800">{children}</h2>
      {onClose && (
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default ModalHeader
