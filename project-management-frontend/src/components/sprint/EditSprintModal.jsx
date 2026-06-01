// src/components/sprint/EditSprintModal.jsx
import { useEffect }                from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                  from 'react-hook-form'
import { motion }                   from 'framer-motion'
import {
  XMarkIcon,
  PencilSquareIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import {
  updateSprint,
  selectUpdateLoading,
} from '../../features/sprint/sprintSlice'

export default function EditSprintModal({
  sprint,
  projectId,
  onClose,
}) {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectUpdateLoading)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm()

  // ============================
  // Populate Form
  // ============================
  useEffect(() => {
    if (sprint) {
      reset({
        name:      sprint.name,
        goal:      sprint.goal      || '',
        startDate: sprint.startDate || '',
        endDate:   sprint.endDate   || '',
      })
    }
  }, [sprint, reset])

  // ============================
  // Submit
  // ============================
  const onSubmit = (data) => {
    dispatch(updateSprint({
      projectId,
      sprintId: sprint.id,
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
        {/* ======================== */}
        {/*         Header           */}
        {/* ======================== */}
        <div className="flex items-center
                         justify-between px-6 py-5
                         border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100
                             rounded-xl flex items-center
                             justify-center">
              <PencilSquareIcon
                className="w-5 h-5 text-indigo-600"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold
                              text-gray-900">
                Edit Sprint
              </h2>
              <p className="text-xs text-gray-400">
                Update sprint details
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

        {/* ======================== */}
        {/*          Form            */}
        {/* ======================== */}
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
                  },
                })}
                placeholder="e.g. Sprint 2 - Dashboard"
                className={`w-full px-4 py-3 border
                             rounded-xl text-sm
                             focus:outline-none
                             focus:ring-2
                             transition-all duration-200
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
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y:  0 }}
                  className="mt-1.5 text-xs
                              text-red-500"
                >
                  {errors.name.message}
                </motion.p>
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
                placeholder="What's the objective of this sprint?"
                rows={3}
                className="w-full px-4 py-3 border
                            border-gray-200 rounded-xl
                            text-sm resize-none
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            hover:border-gray-300
                            transition-all duration-200"
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

                {/* Start Date */}
                <div>
                  <label className="block text-xs
                                      text-gray-500 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <CalendarIcon
                      className="absolute left-3
                                  top-1/2 -translate-y-1/2
                                  w-4 h-4 text-gray-400
                                  pointer-events-none"
                    />
                    <input
                      {...register('startDate', {
                        required: 'Start date required',
                      })}
                      type="date"
                      className={`w-full pl-9 pr-3 py-3
                                   border rounded-xl
                                   text-sm
                                   focus:outline-none
                                   focus:ring-2
                                   transition-all
                                   ${errors.startDate
                                     ? 'border-red-300 ' +
                                       'focus:ring-red-500 ' +
                                       'bg-red-50'
                                     : 'border-gray-200 ' +
                                       'focus:ring-indigo-500 ' +
                                       'hover:border-gray-300'
                                   }`}
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs
                                      text-gray-500 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <CalendarIcon
                      className="absolute left-3
                                  top-1/2 -translate-y-1/2
                                  w-4 h-4 text-gray-400
                                  pointer-events-none"
                    />
                    <input
                      {...register('endDate', {
                        required: 'End date required',
                        validate: (val, formValues) =>
                          !formValues.startDate ||
                          new Date(val) >=
                          new Date(formValues.startDate) ||
                          'End must be after start',
                      })}
                      type="date"
                      className={`w-full pl-9 pr-3 py-3
                                   border rounded-xl
                                   text-sm
                                   focus:outline-none
                                   focus:ring-2
                                   transition-all
                                   ${errors.endDate
                                     ? 'border-red-300 ' +
                                       'focus:ring-red-500 ' +
                                       'bg-red-50'
                                     : 'border-gray-200 ' +
                                       'focus:ring-indigo-500 ' +
                                       'hover:border-gray-300'
                                   }`}
                    />
                  </div>
                </div>
              </div>

              {/* Date Errors */}
              {(errors.startDate || errors.endDate) && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y:  0 }}
                  className="mt-1.5 text-xs text-red-500"
                >
                  {errors.startDate?.message ||
                   errors.endDate?.message}
                </motion.p>
              )}
            </div>

            {/* Status Info Banner */}
            {sprint?.status === 'ACTIVE' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y:  0 }}
                className="flex items-start gap-3
                            bg-green-50 border
                            border-green-200
                            rounded-xl p-4"
              >
                <div className="w-2 h-2 bg-green-500
                                 rounded-full mt-1.5
                                 flex-shrink-0
                                 animate-pulse" />
                <div>
                  <p className="text-sm font-semibold
                                 text-green-800">
                    Sprint is currently Active
                  </p>
                  <p className="text-xs text-green-600
                                 mt-0.5">
                    Dates & goal can still be updated
                  </p>
                </div>
              </motion.div>
            )}

            {sprint?.status === 'COMPLETED' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y:  0 }}
                className="flex items-start gap-3
                            bg-purple-50 border
                            border-purple-200
                            rounded-xl p-4"
              >
                <span className="text-purple-600 text-lg
                                  flex-shrink-0">
                  🎉
                </span>
                <div>
                  <p className="text-sm font-semibold
                                 text-purple-800">
                    Sprint Completed
                  </p>
                  <p className="text-xs text-purple-600
                                 mt-0.5">
                    This sprint has been completed.
                    Only name & goal are editable.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* ======================== */}
          {/*         Footer           */}
          {/* ======================== */}
          <div className="flex items-center gap-3
                           px-6 py-4 border-t
                           border-gray-100 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl
                          border-2 border-gray-200
                          text-gray-600 font-semibold
                          text-sm hover:bg-gray-100
                          transition-all duration-200"
            >
              Cancel
            </button>

            <motion.button
              type="submit"
              disabled={isLoading || !isDirty}
              whileHover={
                !isLoading && isDirty
                  ? { scale: 1.01 }
                  : {}
              }
              whileTap={
                !isLoading && isDirty
                  ? { scale: 0.99 }
                  : {}
              }
              className={`flex-1 py-3 rounded-xl
                           font-semibold text-sm
                           text-white flex items-center
                           justify-center gap-2
                           transition-all duration-200
                           ${isLoading || !isDirty
                             ? 'bg-gray-300 ' +
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
                  Saving...
                </>
              ) : (
                <>
                  <PencilSquareIcon className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}