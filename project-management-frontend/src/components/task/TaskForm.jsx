// src/components/task/TaskForm.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { createTask } from '../../features/task/taskSlice'
import Button  from '../common/Button/Button'
import Input   from '../common/Input/Input'
import { TASK_STATUS, TASK_PRIORITY } from '../../constants/taskConstants'

function TaskForm({ projectId, sprintId, onSuccess, onCancel }) {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { title: '', description: '', priority: 'MEDIUM', status: 'TODO' },
  })

  const onSubmit = async (data) => {
    await dispatch(createTask({ ...data, projectId, sprintId }))
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Task title..."
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Describe the task..."
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" {...register('priority')}>
            {Object.values(TASK_PRIORITY).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" {...register('status')}>
            {Object.values(TASK_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={isSubmitting}>Create Task</Button>
      </div>
    </form>
  )
}

export default TaskForm
