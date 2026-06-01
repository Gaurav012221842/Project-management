// src/components/auth/PublicRoute.jsx
import { useSelector }   from 'react-redux'
import { Navigate }      from 'react-router-dom'
import { selectToken }
  from '../../features/auth/authSlice'

export default function PublicRoute({ children }) {
  const token = useSelector(selectToken)

  if (token) {
    return <Navigate to="/projects" replace />
  }

  return children
}