// src/components/common/Table/Table.jsx
import React from 'react'

function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-gray-100 ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export default Table
