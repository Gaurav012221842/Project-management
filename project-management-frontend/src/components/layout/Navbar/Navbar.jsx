// src/components/layout/Navbar/Navbar.jsx
import { useState, useRef, useEffect, useCallback }
  from 'react'
import {
  useNavigate,
  useLocation,
  Link,
} from 'react-router-dom'
import { useDispatch, useSelector }
  from 'react-redux'
import { motion, AnimatePresence }
  from 'framer-motion'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import {
  ChatBubbleLeftRightIcon as ChatSolid,
} from '@heroicons/react/24/solid'
import NotificationBell
  from '../../notification/NotificationBell'
import {
  logout,
  selectUser,
} from '../../../features/auth/authSlice'
import {
  selectTheme,
  setTheme,
} from '../../../features/ui/uiSlice'
import {
  selectProjects,
} from '../../../features/project/projectSlice'

export default function Navbar({
  project,
  onToggleSidebar,
  onToggleChat,
  isChatOpen,
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const user     = useSelector(selectUser)
  const theme    = useSelector(selectTheme)
  const projects = useSelector(selectProjects)

  const [showSearch,  setShowSearch]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showProfile, setShowProfile] = useState(false)

  const searchRef  = useRef(null)
  const profileRef = useRef(null)

  // ============================
  // Search Logic
  // ============================
  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    const results = projects
      .filter(p =>
        p.name.toLowerCase().includes(
          query.toLowerCase()
        ) ||
        p.description?.toLowerCase().includes(
          query.toLowerCase()
        )
      )
      .slice(0, 5)
      .map(p => ({
        id:       p.id,
        type:     'project',
        title:    p.name,
        subtitle: p.description || p.status,
        path:     `/projects/${p.id}/board`,
      }))
    setSearchResults(results)
  }, [projects])

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowSearch(false)
        setSearchQuery('')
        setSearchResults([])
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () =>
      document.removeEventListener(
        'mousedown', handleClick
      )
  }, [])

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
        setTimeout(() => {
          searchRef.current
            ?.querySelector('input')
            ?.focus()
        }, 100)
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
        setSearchQuery('')
        setSearchResults([])
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () =>
      document.removeEventListener(
        'keydown', handleKeyDown
      )
  }, [])

  // ============================
  // Breadcrumbs
  // ============================
  const getBreadcrumbs = () => {
    const parts = location.pathname
      .split('/')
      .filter(Boolean)

    const crumbs = [
      { label: 'Home', path: '/projects' }
    ]

    if (parts[0] === 'projects') {
      if (parts[1] && project) {
        crumbs.push({
          label: project.name,
          path:  `/projects/${parts[1]}/board`,
        })
        if (parts[2]) {
          crumbs.push({
            label: parts[2].charAt(0).toUpperCase() +
                   parts[2].slice(1),
            path:  location.pathname,
          })
        }
      } else if (!parts[1]) {
        crumbs.push({
          label: 'All Projects',
          path:  '/projects',
        })
      }
    }
    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="h-14 bg-white border-b
                         border-gray-100 flex items-center
                         justify-between px-4 sticky
                         top-0 z-40 shadow-sm
                         flex-shrink-0">

      {/* ======================== */}
      {/*         Left             */}
      {/* ======================== */}
      <div className="flex items-center gap-3
                       min-w-0">

        {/* Hamburger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95   }}
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-500
                      hover:bg-gray-100
                      hover:text-gray-700
                      transition-colors flex-shrink-0"
        >
          <Bars3Icon className="w-5 h-5" />
        </motion.button>

        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center
                         gap-1.5 min-w-0">
          {breadcrumbs.map((crumb, index) => (
            <div
              key={crumb.path}
              className="flex items-center gap-1.5"
            >
              {index > 0 && (
                <span className="text-gray-300
                                  text-sm">
                  /
                </span>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-sm font-semibold
                                  text-gray-800 truncate
                                  max-w-[150px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-sm text-gray-400
                              hover:text-gray-600
                              transition-colors
                              truncate max-w-[100px]"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ======================== */}
      {/*         Center           */}
      {/* ======================== */}
      <div
        ref={searchRef}
        className="flex-1 max-w-sm mx-4 relative"
      >
        {showSearch ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1     }}
            className="relative"
          >
            <MagnifyingGlassIcon
              className="absolute left-3.5
                          top-1/2 -translate-y-1/2
                          w-4 h-4 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              value={searchQuery}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              autoFocus
              className="w-full pl-10 pr-10 py-2.5
                          bg-white border border-indigo-300
                          rounded-xl text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                          shadow-sm"
            />
            <button
              onClick={() => {
                setShowSearch(false)
                setSearchQuery('')
                setSearchResults([])
              }}
              className="absolute right-3 top-1/2
                          -translate-y-1/2 text-gray-400
                          hover:text-gray-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>

            {/* Search Results */}
            <AnimatePresence>
              {(searchResults.length > 0 ||
                searchQuery) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8   }}
                  className="absolute top-full left-0
                              right-0 mt-2 bg-white
                              rounded-2xl shadow-2xl
                              border border-gray-100
                              overflow-hidden z-50"
                >
                  {searchResults.length === 0 &&
                   searchQuery && (
                    <div className="px-4 py-6
                                     text-center">
                      <p className="text-gray-400
                                     text-sm">
                        No results for "{searchQuery}"
                      </p>
                    </div>
                  )}
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        navigate(result.path)
                        setShowSearch(false)
                        setSearchQuery('')
                        setSearchResults([])
                      }}
                      className="flex items-center
                                  gap-3 w-full px-4
                                  py-3 hover:bg-gray-50
                                  transition-colors
                                  border-b border-gray-50
                                  last:border-0"
                    >
                      <div className="w-8 h-8
                                       bg-indigo-100
                                       rounded-lg flex
                                       items-center
                                       justify-center
                                       flex-shrink-0">
                        <SparklesIcon
                          className="w-4 h-4
                                      text-indigo-600"
                        />
                      </div>
                      <div className="text-left
                                       min-w-0">
                        <p className="text-sm
                                       font-medium
                                       text-gray-900
                                       truncate">
                          {result.title}
                        </p>
                        <p className="text-xs
                                       text-gray-400
                                       truncate">
                          {result.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center gap-3
                        px-4 py-2.5 bg-gray-50
                        border border-gray-200
                        rounded-xl text-sm
                        text-gray-400 hover:border-gray-300
                        hover:bg-gray-100
                        transition-all group"
          >
            <MagnifyingGlassIcon
              className="w-4 h-4 flex-shrink-0"
            />
            <span className="flex-1 text-left hidden
                              sm:block">
              Search...
            </span>
            <kbd className="hidden lg:flex items-center
                             gap-1 text-[10px]
                             text-gray-400 bg-gray-200
                             px-1.5 py-0.5 rounded
                             font-medium">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* ======================== */}
      {/*          Right           */}
      {/* ======================== */}
      <div className="flex items-center gap-1.5
                       flex-shrink-0">

        {/* Chat Toggle — only meaningful inside a project */}
        {project && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95   }}
          onClick={onToggleChat}
          className={`w-9 h-9 flex items-center
                       justify-center rounded-xl
                       transition-colors
                       ${isChatOpen
                         ? 'bg-indigo-100 text-indigo-600'
                         : 'text-gray-500 ' +
                           'hover:bg-gray-100 ' +
                           'hover:text-gray-700'
                       }`}
          title="Team Chat"
        >
          {isChatOpen
            ? <ChatSolid className="w-5 h-5" />
            : <ChatBubbleLeftRightIcon
                className="w-5 h-5"
              />
          }
        </motion.button>
        )}

        {/* Notification Bell */}
        <NotificationBell />

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95   }}
          onClick={() =>
            dispatch(
              setTheme(theme === 'light'
                ? 'dark' : 'light'
              )
            )
          }
          className="w-9 h-9 flex items-center
                      justify-center rounded-xl
                      text-gray-500 hover:bg-gray-100
                      hover:text-gray-700
                      transition-colors"
          title="Toggle theme"
        >
          {theme === 'light'
            ? <MoonIcon className="w-5 h-5" />
            : <SunIcon  className="w-5 h-5" />
          }
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() =>
              setShowProfile(!showProfile)
            }
            className="flex items-center gap-2.5 p-1.5
                        rounded-xl hover:bg-gray-100
                        transition-colors group"
          >
            <div className="relative">
              <img
                src={
                  user?.avatarUrl
                }
                alt={user?.name}
                className="w-8 h-8 rounded-xl
                            object-cover border-2
                            border-gray-200
                            group-hover:border-indigo-300
                            transition-colors"
              />
              <div className="absolute -bottom-0.5
                               -right-0.5 w-2.5 h-2.5
                               bg-green-400 rounded-full
                               border-2 border-white" />
            </div>

            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold
                             text-gray-800 leading-tight
                             max-w-[100px] truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-gray-400
                             capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale:   0.95,
                  y:       -8,
                }}
                animate={{
                  opacity: 1,
                  scale:   1,
                  y:       0,
                }}
                exit={{
                  opacity: 0,
                  scale:   0.95,
                }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12
                            bg-white rounded-2xl
                            shadow-2xl border
                            border-gray-100 py-2
                            z-50 min-w-[200px]"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b
                                 border-gray-100">
                  <div className="flex items-center
                                   gap-3">
                    <img
                      src={
                        user?.avatarUrl ||
                        '/project-management-frontend/public/logo192.png'
                      }
                      alt={user?.name}
                      className="w-10 h-10 rounded-xl
                                  object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold
                                     text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400
                                     truncate max-w-[120px]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                {[
                  {
                    icon:    UserCircleIcon,
                    label:   'My Profile',
                    path:    '/profile',
                    color:   'text-gray-700',
                  },
                  {
                    icon:    Cog6ToothIcon,
                    label:   'Settings',
                    path:    '/settings',
                    color:   'text-gray-700',
                  },
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setShowProfile(false)
                    }}
                    className={`flex items-center
                                 gap-3 w-full px-4
                                 py-2.5 text-sm
                                 font-medium
                                 hover:bg-gray-50
                                 transition-colors
                                 ${item.color}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}

                <div className="border-t border-gray-100
                                 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3
                                w-full px-4 py-2.5
                                text-sm font-medium
                                text-red-500
                                hover:bg-red-50
                                transition-colors"
                  >
                    <ArrowRightOnRectangleIcon
                      className="w-4 h-4"
                    />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}