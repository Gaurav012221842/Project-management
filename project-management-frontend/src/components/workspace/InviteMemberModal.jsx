// src/components/workspace/InviteMemberModal.jsx
import React, { useState } from 'react'
import axiosInstance from '../../services/api/axiosInstance'
import Modal       from '../common/Modal/Modal'
import ModalHeader from '../common/Modal/ModalHeader'
import ModalBody   from '../common/Modal/ModalBody'
import ModalFooter from '../common/Modal/ModalFooter'
import Input  from '../common/Input/Input'
import Button from '../common/Button/Button'
import toast  from 'react-hot-toast'

function InviteMemberModal({ isOpen, onClose, workspaceId }) {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      await axiosInstance.post(`/api/workspaces/${workspaceId}/invite`, { email })
      toast.success(`Invitation sent to ${email}`)
      setEmail('')
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>Invite Member</ModalHeader>
      <form onSubmit={handleInvite}>
        <ModalBody className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Send Invite</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default InviteMemberModal
