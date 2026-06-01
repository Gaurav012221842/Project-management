// src/components/sprint/CreateSprintModal.jsx
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                  from 'react-hook-form'
import { motion }                   from 'framer-motion'
import {
  XMarkIcon,
  BoltIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import {
  createSprint,
  selectCreateLoading,
} from '../../features/sprint/sprintSlice'

export default function CreateSprintModal({
  projectId,
  onClose,
}) {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectCreateLoading)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name:      '',
      goal:      '',
      startDate: new Date().toISOString()
        .split('T')[0],
      endDate:   '',
    }
  })

  const onSubmit = (data) => {
    dispatch(createSprint({
      projectId,
      data,
    })).then((result) => {
      if (!result.error) onClose()
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0   }}
      className="fixed inset-0 bg-black/50
                  backdrop-blur-sm flex items-center
                  justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.95, y: 20    }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl
                    w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center
                         justify-between px-6 py-5
                         border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100
                             rounded-xl flex items-center
                             justify-center">
              <BoltIcon
                className="w-5 h-5 text-indigo-600"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold
                              text-gray-900">
                New Sprint
              </h2>
              <p className="text-xs text-gray-400">
                Plan your next iteration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400
                        hover:text-gray-600
                        hover:bg-gray-100
                        transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 space-y-5">

            {/* Sprint Name */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Sprint Name *
              </label>
              <input
                {...register('name', {
                  required:  'Sprint name is required',
                  minLength: {
                    value:   2,
                    message: 'At least 2 characters',
                  }
                })}
                placeholder="e.g. Sprint 1 - Auth Module"
                autoFocus
                className={`w-full px-4 py-3 border
                             rounded-xl text-sm
                             focus:outline-none
                             focus:ring-2
                             transition-all
                             ${errors.name
                               ? 'border-red-300 ' +
                                 'focus:ring-red-500 ' +
                                 'bg-red-50'
                               : 'border-gray-200 ' +
                                 'focus:ring-indigo-500 ' +
                                 'hover:border-gray-300'
                             }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Sprint Goal */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Sprint Goal
              </label>
              <textarea
                {...register('goal')}
                placeholder="What do you want to achieve in this sprint?"
                rows={3}
                className="w-full px-4 py-3 border
                            border-gray-200 rounded-xl
                            text-sm resize-none
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            hover:border-gray-300
                            transition-all"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Duration *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs
                                      text-gray-500 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <CalendarIcon
                      className="absolute left-3
                                  top-1/2 -translate-y-1/2
                                  w-4 h-4 text-gray-400"
                    />
                    <input
                      {...register('startDate', {
                        required: 'Start date required'
                      })}
                      type="date"
                      className={`w-full pl-9 pr-3 py-3
                                   border rounded-xl text-sm
                                   focus:outline-none
                                   focus:ring-2
                                   transition-all
                                   ${errors.startDate
                                     ? 'border-red-300 ' +
                                       'focus:ring-red-500'
                                     : 'border-gray-200 ' +
                                       'focus:ring-indigo-500 ' +
                                       'hover:border-gray-300'
                                   }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs
                                      text-gray-500 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <CalendarIcon
                      className="absolute left-3
                                  top-1/2 -translate-y-1/2
                                  w-4 h-4 text-gray-400"
                    />
                    <input
                      {...register('endDate', {
                        required: 'End date required'
                      })}
                      type="date"
                      className={`w-full pl-9 pr-3 py-3
                                   border rounded-xl text-sm
                                   focus:outline-none
                                   focus:ring-2
                                   transition-all
                                   ${errors.endDate
                                     ? 'border-red-300 ' +
                                       'focus:ring-red-500'
                                     : 'border-gray-200 ' +
                                       'focus:ring-indigo-500 ' +
                                       'hover:border-gray-300'
                                   }`}
                    />
                  </div>
                </div>
              </div>
              {(errors.startDate || errors.endDate) && (
                <p className="mt-1 text-xs text-red-500">
                  Both dates are required
                </p>
              )}
            </div>

            {/* Duration Presets */}
            <div>
              <p className="text-xs text-gray-500
                             font-medium mb-2">
                Quick Duration
              </p>
              <div className="flex gap-2">
                {[
                  { label: '1 Week',  days: 7  },
                  { label: '2 Weeks', days: 14 },
                  { label: '3 Weeks', days: 21 },
                  { label: '4 Weeks', days: 28 },
                ].map((preset) => (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => {
                      const start = new Date()
                      const end   = new Date()
                      end.setDate(
                        end.getDate() + preset.days
                      )
                      document.querySelector(
                        '[name="startDate"]'
                      ).value =
                        start.toISOString().split('T')[0]
                      document.querySelector(
                        '[name="endDate"]'
                      ).value =
                        end.toISOString().split('T')[0]
                    }}
                    className="flex-1 px-2 py-1.5
                                bg-gray-100 hover:bg-indigo-50
                                hover:text-indigo-700
                                text-gray-600 rounded-lg
                                text-xs font-medium
                                transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4
                           border-t border-gray-100
                           bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl
                          border-2 border-gray-200
                          text-gray-600 font-semibold
                          text-sm hover:bg-gray-100
                          transition-all"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading
                ? { scale: 1.01 } : {}}
              whileTap={!isLoading
                ? { scale: 0.99 } : {}}
              className={`flex-1 py-3 rounded-xl
                           font-semibold text-sm
                           text-white flex items-center
                           justify-center gap-2
                           transition-all
                           ${isLoading
                             ? 'bg-indigo-400 ' +
                               'cursor-not-allowed'
                             : 'bg-indigo-600 ' +
                               'hover:bg-indigo-700 ' +
                               'shadow-lg ' +
                               'shadow-indigo-200'
                           }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2
                                   border-white
                                   border-t-transparent
                                   rounded-full
                                   animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <BoltIcon className="w-4 h-4" />
                  Create Sprint
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}