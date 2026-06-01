// src/components/project/EditProjectModal.jsx
import { useEffect }              from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                from 'react-hook-form'
import { motion }                 from 'framer-motion'
import {
  XMarkIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import {
  updateProject,
  selectUpdateLoading,
} from '../../features/project/projectSlice'

const STATUS_OPTIONS = [
  { value: 'ACTIVE',    label: '🟢 Active'    },
  { value: 'ON_HOLD',   label: '🟡 On Hold'   },
  { value: 'COMPLETED', label: '🔵 Completed' },
  { value: 'CANCELLED', label: '🔴 Cancelled' },
]

export default function EditProjectModal({
  project,
  onClose,
}) {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectUpdateLoading)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm()

  useEffect(() => {
    if (project) {
      reset({
        name:        project.name,
        description: project.description || '',
        status:      project.status,
        startDate:   project.startDate || '',
        endDate:     project.endDate   || '',
      })
    }
  }, [project, reset])

  const onSubmit = (data) => {
    dispatch(updateProject({
      id: project.id,
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
              <PencilSquareIcon
                className="w-5 h-5 text-indigo-600"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold
                              text-gray-900">
                Edit Project
              </h2>
              <p className="text-xs text-gray-400">
                Update project details
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
          <div className="px-6 py-5 space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Project Name *
              </label>
              <input
                {...register('name', {
                  required: 'Name is required'
                })}
                className={`w-full px-4 py-3 border
                             rounded-xl text-sm
                             focus:outline-none
                             focus:ring-2 transition-all
                             ${errors.name
                               ? 'border-red-300 ' +
                                 'focus:ring-red-500'
                               : 'border-gray-200 ' +
                                 'focus:ring-indigo-500'
                             }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-3 border
                            border-gray-200 rounded-xl
                            text-sm resize-none
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className="cursor-pointer"
                  >
                    <input
                      {...register('status')}
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                    />
                    <div className={`px-3 py-2.5
                                      rounded-xl border-2
                                      text-center text-xs
                                      font-medium
                                      transition-all
                                      ${watch('status') ===
                                        opt.value
                                        ? 'border-indigo-500 ' +
                                          'bg-indigo-50 ' +
                                          'text-indigo-700'
                                        : 'border-gray-200 ' +
                                          'text-gray-600 ' +
                                          'hover:border-gray-300'
                                      }`}>
                      {opt.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm
                                    font-semibold
                                    text-gray-700 mb-1.5">
                  Start Date
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="w-full px-4 py-3 border
                              border-gray-200 rounded-xl
                              text-sm focus:outline-none
                              focus:ring-2
                              focus:ring-indigo-500
                              transition-all"
                />
              </div>
              <div>
                <label className="block text-sm
                                    font-semibold
                                    text-gray-700 mb-1.5">
                  End Date
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  className="w-full px-4 py-3 border
                              border-gray-200 rounded-xl
                              text-sm focus:outline-none
                              focus:ring-2
                              focus:ring-indigo-500
                              transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
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
                          transition-all"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isLoading || !isDirty}
              whileHover={!isLoading && isDirty
                ? { scale: 1.01 } : {}}
              whileTap={!isLoading && isDirty
                ? { scale: 0.99 } : {}}
              className={`flex-1 py-3 rounded-xl
                           font-semibold text-sm
                           text-white flex items-center
                           justify-center gap-2
                           transition-all
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
                  <PencilSquareIcon
                    className="w-4 h-4"
                  />
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