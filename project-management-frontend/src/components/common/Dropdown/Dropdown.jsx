// src/components/common/Dropdown/Dropdown.jsx
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClickOutside } from '../../../hooks/useClickOutside'

function Dropdown({ trigger, items = [], align = 'left', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className={`absolute z-50 mt-1 min-w-[10rem] rounded-xl bg-white shadow-lg border border-gray-100 py-1 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {items.map((item, i) =>
              item.divider ? (
                <div key={i} className="my-1 border-t border-gray-100" />
              ) : (
                <button
                  key={i}
                  onClick={() => { item.onClick?.(); setOpen(false) }}
                  className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                    item.danger ? 'text-red-600' : 'text-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={item.disabled}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown
