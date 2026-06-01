// src/components/project/ProjectMembers.jsx
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../services/api/axiosInstance'
import Avatar from '../common/Avatar/Avatar'
import Badge  from '../common/Badge/Badge'
import Skeleton from '../common/Loader/Skeleton'

function ProjectMembers({ projectId }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    axiosInstance.get(`/api/projects/${projectId}/members`)
      .then(res => setMembers(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [projectId])

  if (loading) return <Skeleton lines={3} />

  return (
    <div className="space-y-2">
      {members.map(m => (
        <div key={m.id} className="flex items-center gap-3">
          <Avatar name={m.name || m.username} src={m.avatarUrl} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{m.name || m.username}</p>
            <p className="text-xs text-gray-400">{m.email}</p>
          </div>
          <Badge variant="default" className="capitalize">{(m.role || 'member').toLowerCase()}</Badge>
        </div>
      ))}
      {!loading && !members.length && (
        <p className="text-sm text-gray-400">No members yet.</p>
      )}
    </div>
  )
}

export default ProjectMembers
