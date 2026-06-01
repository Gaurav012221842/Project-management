// src/hooks/useTheme.js
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useCallback }   from 'react'
import { selectTheme, setTheme }    from '../features/ui/uiSlice'

export function useTheme() {
  const dispatch = useDispatch()
  const theme    = useSelector(selectTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  const toggleTheme = useCallback(() => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))
  }, [dispatch, theme])

  const changeTheme = useCallback((t) => dispatch(setTheme(t)), [dispatch])

  return { theme, toggleTheme, changeTheme, isDark: theme === 'dark' }
}

export default useTheme
