// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectAuth, selectUser, selectToken,
  logout, login, register, clearError,
} from '../features/auth/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth     = useSelector(selectAuth)
  const user     = useSelector(selectUser)
  const token    = useSelector(selectToken)

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials))
    if (login.fulfilled.match(result)) navigate('/projects')
    return result
  }

  const handleRegister = async (data) => {
    const result = await dispatch(register(data))
    if (register.fulfilled.match(result)) navigate('/projects')
    return result
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading:  auth.loading,
    error:    auth.error,
    login:    handleLogin,
    register: handleRegister,
    logout:   handleLogout,
    clearError: () => dispatch(clearError()),
  }
}

export default useAuth
