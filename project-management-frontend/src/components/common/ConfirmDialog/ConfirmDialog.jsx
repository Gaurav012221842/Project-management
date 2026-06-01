// src/components/common/ConfirmDialog/ConfirmDialog.jsx
import { motion } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  isDanger     = false,
  loading      = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0   }}
      className="fixed inset-0 bg-black/50
                  backdrop-blur-sm flex items-center
                  justify-center z-[100] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1,   y: 0  }}
        exit={{ opacity: 0, scale: 0.9, y: 20    }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl
                    w-full max-w-sm overflow-hidden"
      >
        {/* Icon */}
        <div className="flex justify-center pt-8 pb-2">
          <div className={`w-16 h-16 rounded-full
                            flex items-center
                            justify-center
                            ${isDanger
                              ? 'bg-red-100'
                              : 'bg-yellow-100'
                            }`}>
            {isDanger
              ? <TrashIcon
                  className="w-8 h-8 text-red-500"
                />
              : <ExclamationTriangleIcon
                  className="w-8 h-8 text-yellow-500"
                />
            }
          </div>
        </div>

        <div className="px-6 py-4 text-center">
          <h3 className="text-lg font-bold
                          text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500
                         leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl
                        border-2 border-gray-200
                        text-gray-600 font-semibold
                        text-sm hover:bg-gray-50
                        transition-all"
          >
            {cancelLabel}
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98   }}
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl
                         font-semibold text-sm
                         text-white transition-all
                         flex items-center
                         justify-center gap-2
                         ${isDanger
                           ? 'bg-red-500 ' +
                             'hover:bg-red-600'
                           : 'bg-indigo-600 ' +
                             'hover:bg-indigo-700'
                         }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2
                               border-white
                               border-t-transparent
                               rounded-full
                               animate-spin" />
            ) : (
              confirmLabel
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}