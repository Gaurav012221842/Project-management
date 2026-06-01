// src/components/project/ProjectFilters.jsx
import { useDispatch, useSelector } from 'react-redux'
import { motion }                   from 'framer-motion'
import { XMarkIcon }                from '@heroicons/react/24/outline'
import {
  setFilters,
  clearFilters,
  selectProjectFilters,
} from '../../features/project/projectSlice'

const STATUS_OPTIONS = [
  { value: 'ALL',       label: 'All Statuses'  },
  { value: 'ACTIVE',    label: 'Active'        },
  { value: 'COMPLETED', label: 'Completed'     },
  { value: 'ON_HOLD',   label: 'On Hold'       },
  { value: 'CANCELLED', label: 'Cancelled'     },
]

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created'  },
  { value: 'updatedAt', label: 'Last Updated'  },
  { value: 'name',      label: 'Name'          },
]

const SORT_DIR_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc',  label: 'Ascending'  },
]

export default function ProjectFilters({ onClose }) {
  const dispatch = useDispatch()
  const filters  = useSelector(selectProjectFilters)

  const handleChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handleClear = () => {
    dispatch(clearFilters())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y:  0 }}
      exit={{ opacity: 0, y: -8   }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-gray-200
                  rounded-2xl shadow-xl p-5
                  w-72 absolute right-0 top-full
                  mt-2 z-50"
    >
      {/* Header */}
      <div className="flex items-center
                       justify-between mb-4">
        <h3 className="text-sm font-semibold
                        text-gray-800">
          Filters &amp; Sort
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg
                        hover:bg-gray-100
                        text-gray-400
                        transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block text-xs font-medium
                           text-gray-500 mb-2 uppercase
                           tracking-wide">
          Status
        </label>
        <div className="flex flex-col gap-1">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() =>
                handleChange('status', opt.value)
              }
              className={`text-left px-3 py-2
                           rounded-lg text-sm
                           transition-colors
                           ${filters.status === opt.value
                             ? 'bg-indigo-50 text-indigo-700 font-medium'
                             : 'text-gray-600 hover:bg-gray-50'
                           }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-4">
        <label className="block text-xs font-medium
                           text-gray-500 mb-2 uppercase
                           tracking-wide">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            handleChange('sortBy', e.target.value)
          }
          className="w-full px-3 py-2 text-sm
                      bg-gray-50 border border-gray-200
                      rounded-lg focus:outline-none
                      focus:ring-2 focus:ring-indigo-500
                      text-gray-700"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Direction */}
      <div className="mb-5">
        <label className="block text-xs font-medium
                           text-gray-500 mb-2 uppercase
                           tracking-wide">
          Order
        </label>
        <div className="flex gap-2">
          {SORT_DIR_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() =>
                handleChange('sortDir', opt.value)
              }
              className={`flex-1 py-2 text-xs font-medium
                           rounded-lg border transition-colors
                           ${filters.sortDir === opt.value
                             ? 'bg-indigo-600 text-white border-indigo-600'
                             : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                           }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={handleClear}
        className="w-full py-2 text-sm font-medium
                    text-gray-500 hover:text-gray-700
                    border border-gray-200
                    hover:border-gray-300
                    rounded-lg transition-colors"
      >
        Clear Filters
      </button>
    </motion.div>
  )
}
