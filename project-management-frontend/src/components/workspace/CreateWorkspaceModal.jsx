// src/components/workspace/CreateWorkspaceModal.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { createWorkspace } from '../../features/workspace/workspaceSlice'
import Modal      from '../common/Modal/Modal'
import ModalHeader from '../common/Modal/ModalHeader'
import ModalBody   from '../common/Modal/ModalBody'
import ModalFooter from '../common/Modal/ModalFooter'
import Input  from '../common/Input/Input'
import Button from '../common/Button/Button'

function CreateWorkspaceModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    await dispatch(createWorkspace(data))
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>New Workspace</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. My Team"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="What is this workspace for?"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              {...register('description')}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Create</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default CreateWorkspaceModal
