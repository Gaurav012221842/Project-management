// src/components/task/TaskEditForm.jsx
import { useEffect }                from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                  from 'react-hook-form'
import { motion }                   from 'framer-motion'
import {
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  updateTask,
  selectUpdateLoading,
} from '../../features/task/taskSlice'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const TYPES      = ['TASK', 'FEATURE', 'BUG', 'IMPROVEMENT']
const STATUSES   = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']

export default function TaskEditForm({
  task,
  onCancel,
  onSaved,
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
    if (task) {
      reset({
        title:       task.title,
        description: task.description  || '',
        status:      task.status,
        priority:    task.priority,
        taskType:    task.taskType,
        storyPoints: task.storyPoints  || 0,
        dueDate:     task.dueDate      || '',
      })
    }
  }, [task, reset])

  const onSubmit = (data) => {
    dispatch(updateTask({
      taskId: task.id,
      data,
    })).then((result) => {
      if (!result.error) onSaved()
    })
  }

  const PRIORITY_COLORS = {
    LOW:      'border-gray-300  bg-gray-50   ' +
              'text-gray-700',
    MEDIUM:   'border-blue-300  bg-blue-50   ' +
              'text-blue-700',
    HIGH:     'border-orange-300 bg-orange-50 ' +
              'text-orange-700',
    CRITICAL: 'border-red-300   bg-red-50    ' +
              'text-red-700',
  }

  const TYPE_ICONS = {
    TASK:        '📋',
    FEATURE:     '✨',
    BUG:         '🐛',
    IMPROVEMENT: '⚡',
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 space-y-5"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold
                            text-gray-700 mb-1.5">
          Task Title *
        </label>
        <input
          {...register('title', {
            required:  'Title is required',
            minLength: { value: 2, message: 'Too short' },
          })}
          className={`w-full px-4 py-3 border
                       rounded-xl text-sm
                       focus:outline-none focus:ring-2
                       transition-all
                       ${errors.title
                         ? 'border-red-300 ' +
                           'focus:ring-red-500 bg-red-50'
                         : 'border-gray-200 ' +
                           'focus:ring-indigo-500 ' +
                           'hover:border-gray-300'
                       }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold
                            text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Describe the task..."
          className="w-full px-4 py-3 border
                      border-gray-200 rounded-xl
                      text-sm resize-none
                      focus:outline-none focus:ring-2
                      focus:ring-indigo-500
                      hover:border-gray-300
                      transition-all"
        />
      </div>

      {/* Status + Priority Row */}
      <div className="grid grid-cols-2 gap-4">

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-1.5">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-3 border
                        border-gray-200 rounded-xl
                        text-sm focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500 bg-white"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Story Points */}
        <div>
          <label className="block text-sm font-semibold
                              text-gray-700 mb-1.5">
            Story Points
          </label>
          <input
            {...register('storyPoints', {
              min: { value: 0, message: 'Min 0' },
              max: { value: 100, message: 'Max 100' },
            })}
            type="number"
            min="0"
            max="100"
            className="w-full px-4 py-3 border
                        border-gray-200 rounded-xl
                        text-sm focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                        hover:border-gray-300
                        transition-all"
          />
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-semibold
                            text-gray-700 mb-2">
          Priority
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PRIORITIES.map(p => (
            <label key={p} className="cursor-pointer">
              <input
                {...register('priority')}
                type="radio"
                value={p}
                className="sr-only"
              />
              <div className={`
                px-3 py-2.5 rounded-xl border-2
                text-center text-xs font-bold
                transition-all cursor-pointer
                ${watch('priority') === p
                  ? PRIORITY_COLORS[p]
                  : 'border-gray-200 text-gray-500 ' +
                    'bg-white hover:border-gray-300'
                }
              `}>
                {p}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Task Type */}
      <div>
        <label className="block text-sm font-semibold
                            text-gray-700 mb-2">
          Task Type
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TYPES.map(t => (
            <label key={t} className="cursor-pointer">
              <input
                {...register('taskType')}
                type="radio"
                value={t}
                className="sr-only"
              />
              <div className={`
                px-2 py-2.5 rounded-xl border-2
                text-center text-xs font-medium
                transition-all cursor-pointer
                ${watch('taskType') === t
                  ? 'border-indigo-400 bg-indigo-50 ' +
                    'text-indigo-700'
                  : 'border-gray-200 text-gray-500 ' +
                    'hover:border-gray-300'
                }
              `}>
                <div className="text-base mb-0.5">
                  {TYPE_ICONS[t]}
                </div>
                <div>{t}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-semibold
                            text-gray-700 mb-1.5">
          Due Date
        </label>
        <input
          {...register('dueDate')}
          type="date"
          className="w-full px-4 py-3 border
                      border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2
                      focus:ring-indigo-500
                      hover:border-gray-300
                      transition-all"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-4
                       border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border-2
                      border-gray-200 text-gray-600
                      font-semibold text-sm
                      hover:bg-gray-50 transition-all
                      flex items-center justify-center
                      gap-2"
        >
          <XMarkIcon className="w-4 h-4" />
          Cancel
        </button>

        <motion.button
          type="submit"
          disabled={isLoading || !isDirty}
          whileHover={
            !isLoading && isDirty
              ? { scale: 1.01 } : {}
          }
          whileTap={
            !isLoading && isDirty
              ? { scale: 0.99 } : {}
          }
          className={`
            flex-1 py-3 rounded-xl font-semibold
            text-sm text-white transition-all
            flex items-center justify-center gap-2
            ${isLoading || !isDirty
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 ' +
                'shadow-lg shadow-indigo-200'
            }
          `}
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
              <CheckIcon className="w-4 h-4" />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </form>
  )
}