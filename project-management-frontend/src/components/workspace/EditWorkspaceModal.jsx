// src/components/workspace/EditWorkspaceModal.jsx
import React, { useEffect } from 'react'
import { useForm }    from 'react-hook-form'
import { useDispatch } from 'react-redux'
import axiosInstance  from '../../services/api/axiosInstance'
import Modal       from '../common/Modal/Modal'
import ModalHeader from '../common/Modal/ModalHeader'
import ModalBody   from '../common/Modal/ModalBody'
import ModalFooter from '../common/Modal/ModalFooter'
import Input  from '../common/Input/Input'
import Button from '../common/Button/Button'
import toast  from 'react-hot-toast'

function EditWorkspaceModal({ isOpen, onClose, workspace }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  useEffect(() => {
    if (workspace) reset({ name: workspace.name, description: workspace.description })
  }, [workspace, reset])

  const onSubmit = async (data) => {
    try {
      await axiosInstance.put(`/api/v1/workspaces/${workspace.id}`, data)
      toast.success('Workspace updated')
      onClose()
    } catch {
      toast.error('Failed to update workspace')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>Edit Workspace</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <Input
            label="Name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              {...register('description')}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Save Changes</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default EditWorkspaceModal
