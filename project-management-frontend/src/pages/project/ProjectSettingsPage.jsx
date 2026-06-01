// src/pages/project/ProjectSettingsPage.jsx
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById, selectSelectedProject, selectProjectLoading } from '../../features/project/projectSlice'
import ProjectSettings from '../../components/project/ProjectSettings'
import PageLoader      from '../../components/common/Loader/PageLoader'

function ProjectSettingsPage() {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const project  = useSelector(selectSelectedProject)
  const loading  = useSelector(selectProjectLoading)

  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId))
  }, [dispatch, projectId])

  if (loading) return <PageLoader />

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Project Settings</h1>
      {project
        ? <ProjectSettings project={project} onUpdated={() => dispatch(fetchProjectById(projectId))} />
        : <p className="text-gray-500">Project not found.</p>
      }
    </div>
  )
}

export default ProjectSettingsPage
