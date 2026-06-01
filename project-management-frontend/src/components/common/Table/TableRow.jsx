// src/components/common/Table/TableRow.jsx
import React from 'react'

function TableRow({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-gray-50 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </tr>
  )
}

export default TableRow
