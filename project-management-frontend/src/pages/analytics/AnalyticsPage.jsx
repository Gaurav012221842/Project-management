// src/pages/analytics/AnalyticsPage.jsx
import { useEffect }              from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams }              from 'react-router-dom'
import AnalyticsDashboard         from '../../components/analytics/AnalyticsDashboard'
import {
  fetchSprints
} from '../../features/sprint/sprintSlice'

export default function AnalyticsPage() {
  const dispatch      = useDispatch()
  const { projectId } = useParams()

  useEffect(() => {
    if (projectId) {
      dispatch(fetchSprints(Number(projectId)))
    }
  }, [projectId, dispatch])

  return <AnalyticsDashboard />
}