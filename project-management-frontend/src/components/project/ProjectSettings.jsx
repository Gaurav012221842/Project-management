// src/components/project/ProjectSettings.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../services/api/axiosInstance'
import Input  from '../common/Input/Input'
import Button from '../common/Button/Button'
import toast  from 'react-hot-toast'

function ProjectSettings({ project, onUpdated }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name:        project?.name        || '',
      description: project?.description || '',
      status:      project?.status      || 'ACTIVE',
    },
  })

  const onSubmit = async (data) => {
    try {
      await axiosInstance.put(`/api/projects/${project.id}`, data)
      toast.success('Project updated')
      onUpdated?.()
    } catch {
      toast.error('Failed to update project')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <Input
        label="Project Name"
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={4}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          {...register('description')}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>Save Changes</Button>
      </div>
    </form>
  )
}

export default ProjectSettings
