// src/components/layout/Sidebar/SidebarSection.jsx
import React from 'react'

function SidebarSection({ title, children }) {
  return (
    <div className="mb-1">
      {title && (
        <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

export default SidebarSection
