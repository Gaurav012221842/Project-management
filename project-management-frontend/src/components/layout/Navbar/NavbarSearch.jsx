// src/components/layout/Navbar/NavbarSearch.jsx
import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useDispatch } from 'react-redux'
import { toggleSearch } from '../../../features/ui/uiSlice'

function NavbarSearch() {
  const dispatch = useDispatch()
  return (
    <button
      onClick={() => dispatch(toggleSearch())}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors"
    >
      <MagnifyingGlassIcon className="w-4 h-4" />
      <span className="hidden md:inline">Search...</span>
      <kbd className="hidden md:inline text-xs bg-white rounded px-1 py-0.5 border border-gray-200">&#x2318;K</kbd>
    </button>
  )
}

export default NavbarSearch
