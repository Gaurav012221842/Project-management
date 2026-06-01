// src/components/layout/Sidebar/SidebarItem.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'

function SidebarItem({ to, icon, label, badge, onClick, end = false }) {
  const base = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group'
  const active   = 'bg-indigo-50 text-indigo-700'
  const inactive = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'

  if (onClick) {
    return (
      <button onClick={onClick} className={`w-full ${base} ${inactive}`}>
        {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
        <span className="flex-1 truncate">{label}</span>
        {badge != null && (
          <span className="ml-auto text-xs font-semibold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    )
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
    >
      {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {badge != null && (
        <span className="ml-auto text-xs font-semibold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export default SidebarItem
