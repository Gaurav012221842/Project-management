// src/components/common/Table/TableHeader.jsx
import React from 'react'

function TableHeader({ columns = [] }) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((col, i) => (
          <th
            key={i}
            className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${col.className || ''}`}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
