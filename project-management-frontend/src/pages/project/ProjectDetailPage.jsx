// src/pages/project/ProjectDetailPage.jsx
import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById, selectSelectedProject, selectProjectLoading } from '../../features/project/projectSlice'
import PageLoader   from '../../components/common/Loader/PageLoader'
import ProjectProgress from '../../components/project/ProjectProgress'
import ProjectMembers  from '../../components/project/ProjectMembers'
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { formatDate } from '../../utils/dateUtils'

function ProjectDetailPage() {
  const { projectId } = useParams()
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const project    = useSelector(selectSelectedProject)
  const loading    = useSelector(selectProjectLoading)

  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId))
  }, [dispatch, projectId])

  if (loading) return <PageLoader />

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <p className="text-gray-500">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        {project.description && <p className="mt-1 text-gray-500">{project.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Progress</h2>
          <ProjectProgress
            done={project.completedTaskCount || 0}
            total={project.totalTaskCount    || 0}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Details</h2>
          {project.startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              {formatDate(project.startDate)} &ndash; {formatDate(project.endDate)}
            </div>
          )}
          {project.memberCount != null && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserGroupIcon className="w-4 h-4 text-gray-400" />
              {project.memberCount} members
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Members</h2>
        <ProjectMembers projectId={projectId} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/projects/${projectId}/board`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Open Board
        </button>
      </div>
    </div>
  )
}

export default ProjectDetailPage
