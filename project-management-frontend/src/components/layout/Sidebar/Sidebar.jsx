// src/components/layout/Sidebar/Sidebar.jsx
import { useState }               from 'react'
import {
  NavLink,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  RectangleStackIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  SparklesIcon,
  BoltIcon,
  FolderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import {
  SparklesIcon as SparklesSolid,
} from '@heroicons/react/24/solid'
import {
  selectUser,
  logout,
} from '../../../features/auth/authSlice'
import {
  selectProjects,
} from '../../../features/project/projectSlice'
import {
  toggleSidebar,
  selectIsSidebarOpen,
  selectIsMobile,
} from '../../../features/ui/uiSlice'
import { getProjectColorIndex } from '../../../utils/projectUtils'

// ============================
// Nav Config
// ============================
const MAIN_NAV = [
  {
    path:  '/projects',
    icon:  HomeIcon,
    label: 'Projects',
    exact: true,
  },
]

const PROJECT_NAV = [
  {
    path:  'board',
    icon:  RectangleStackIcon,
    label: 'Board',
  },
  {
    path:  'sprints',
    icon:  BoltIcon,
    label: 'Sprints',
  },
  {
    path:  'analytics',
    icon:  ChartBarIcon,
    label: 'Analytics',
  },
  {
    path:  'chat',
    icon:  ChatBubbleLeftRightIcon,
    label: 'Chat',
  },
  {
    path:  'ai-assistant',
    icon:  SparklesIcon,
    label: 'AI Assistant',
  },
  {
    path:  'settings',
    icon:  Cog6ToothIcon,
    label: 'Settings',
  },
]

const PROJECT_COLORS = [
  'bg-indigo-500', 'bg-blue-500',
  'bg-green-500',  'bg-orange-500',
  'bg-pink-500',   'bg-teal-500',
  'bg-purple-500', 'bg-cyan-500',
]

export default function Sidebar() {
  const dispatch     = useDispatch()
  const navigate     = useNavigate()
  const location     = useLocation()
  const { projectId } = useParams()

  const user          = useSelector(selectUser)
  const projects      = useSelector(selectProjects)
  const isSidebarOpen = useSelector(selectIsSidebarOpen)
  const isMobile      = useSelector(selectIsMobile)

  const [showProjects, setShowProjects] =
    useState(true)

  const currentProject = projects.find(
    p => p.id === projectId
  )

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleCollapse = () => {
    dispatch(toggleSidebar())
  }

  return (
    <aside
      className={`
        h-screen bg-gray-900 flex flex-col
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64' : 'w-16'}
        relative border-r border-gray-800
      `}
    >

      {/* ======================== */}
      {/*          Logo            */}
      {/* ======================== */}
      <div className={`
        flex items-center gap-3 px-4 py-5
        border-b border-gray-800 flex-shrink-0
        ${isSidebarOpen ? 'justify-between' : 'justify-center'}
      `}>

        <div className="flex items-center gap-3
                         min-w-0">
          <div className="w-9 h-9 bg-indigo-600
                           rounded-xl flex items-center
                           justify-center flex-shrink-0
                           shadow-lg">
            <SparklesSolid
              className="w-5 h-5 text-white"
            />
          </div>

          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-white font-bold text-lg
                            tracking-wide whitespace-nowrap
                            overflow-hidden"
              >
                ProjAI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Button */}
        {isSidebarOpen && !isMobile && (
          <button
            onClick={handleCollapse}
            className="p-1.5 rounded-lg text-gray-500
                        hover:text-gray-300
                        hover:bg-gray-800
                        transition-colors flex-shrink-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ======================== */}
      {/*      Expand Button       */}
      {/* ======================== */}
      {!isSidebarOpen && !isMobile && (
        <button
          onClick={handleCollapse}
          className="absolute -right-3 top-[72px]
                      w-6 h-6 bg-gray-700 rounded-full
                      flex items-center justify-center
                      text-gray-400 hover:text-white
                      hover:bg-indigo-600
                      transition-colors z-10
                      border border-gray-600
                      shadow-md"
        >
          <ChevronRightIcon className="w-3 h-3" />
        </button>
      )}

      {/* ======================== */}
      {/*       Navigation         */}
      {/* ======================== */}
      <nav className="flex-1 overflow-y-auto
                       overflow-x-hidden px-3
                       py-4 space-y-1 custom-scrollbar">

        {/* Main Nav */}
        <NavItem
          path="/projects"
          icon={HomeIcon}
          label="All Projects"
          isOpen={isSidebarOpen}
          exact
        />
        <NavItem
          path="/workspaces"
          icon={UserGroupIcon}
          label="Workspaces"
          isOpen={isSidebarOpen}
          exact
        />

        {/* ======================== */}
        {/* Project Section          */}
        {/* ======================== */}
        {currentProject && (
          <div className="mt-4">

            {/* Section Header */}
            {isSidebarOpen && (
              <div className="flex items-center
                               justify-between
                               px-3 mb-2">
                <span className="text-[10px] font-bold
                                  text-gray-500
                                  uppercase tracking-widest">
                  Current Project
                </span>
              </div>
            )}

            {/* Current Project Info */}
            {isSidebarOpen && (
              <div className="mx-1 mb-3 p-3
                               bg-gray-800 rounded-xl
                               border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7
                                    ${PROJECT_COLORS[
                                      currentProject.id %
                                      PROJECT_COLORS.length
                                    ]}
                                    rounded-lg flex
                                    items-center
                                    justify-center
                                    text-white text-xs
                                    font-bold
                                    flex-shrink-0`}>
                    {currentProject.name
                      .charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs
                                   font-semibold truncate">
                      {currentProject.name}
                    </p>
                    <p className="text-gray-400
                                   text-[10px]">
                      {currentProject.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Project Nav Items */}
            {PROJECT_NAV.map(item => (
              <NavItem
                key={item.path}
                path={`/projects/${projectId}/${item.path}`}
                icon={item.icon}
                label={item.label}
                isOpen={isSidebarOpen}
              />
            ))}
          </div>
        )}

        {/* ======================== */}
        {/* Projects List            */}
        {/* ======================== */}
        {isSidebarOpen && projects.length > 0 && (
          <div className="mt-4">

            {/* Section Header */}
            <button
              onClick={() =>
                setShowProjects(!showProjects)
              }
              className="flex items-center justify-between
                          w-full px-3 py-2 text-[10px]
                          font-bold text-gray-500
                          uppercase tracking-widest
                          hover:text-gray-400
                          transition-colors rounded-lg"
            >
              <span>Recent Projects</span>
              <motion.div
                animate={{
                  rotate: showProjects ? 180 : 0
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="w-3 h-3" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showProjects && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-1
                              mt-1"
                >
                  {projects.slice(0, 5).map(project => (
                    <motion.button
                      key={project.id}
                      onClick={() =>
                        navigate(
                          `/projects/${project.id}/board`
                        )
                      }
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                      className={`
                        flex items-center gap-2.5
                        w-full px-3 py-2 rounded-lg
                        text-left transition-colors
                        ${projectId === project.id
                          ? 'bg-indigo-600/20 ' +
                            'text-indigo-300'
                          : 'text-gray-400 ' +
                            'hover:bg-gray-800 ' +
                            'hover:text-gray-200'
                        }
                      `}
                    >
                      <div className={`w-5 h-5
                                        ${PROJECT_COLORS[
                                          getProjectColorIndex(
                                            project.id,
                                            PROJECT_COLORS.length
                                          )
                                        ]}
                                        rounded-md flex
                                        items-center
                                        justify-center
                                        text-white text-[9px]
                                        font-bold
                                        flex-shrink-0`}>
                        {project.name
                          .charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs truncate
                                        font-medium">
                        {project.name}
                      </span>
                    </motion.button>
                  ))}

                  {/* New Project */}
                  <button
                    onClick={() =>
                      navigate('/projects')
                    }
                    className="flex items-center gap-2.5
                                w-full px-3 py-2 rounded-lg
                                text-gray-500
                                hover:text-gray-300
                                hover:bg-gray-800
                                transition-colors"
                  >
                    <div className="w-5 h-5 rounded-md
                                     border border-dashed
                                     border-gray-600 flex
                                     items-center
                                     justify-center
                                     flex-shrink-0">
                      <PlusIcon className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-medium">
                      All Projects
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      {/* ======================== */}
      {/*      User Profile        */}
      {/* ======================== */}
      <div className="flex-shrink-0 px-3 py-4
                       border-t border-gray-800">

        {isSidebarOpen ? (
          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={
                  user?.avatarUrl
                }
                alt={user?.name}
                className="w-9 h-9 rounded-xl
                            object-cover border-2
                            border-gray-700"
              />
              <div className="absolute -bottom-0.5
                               -right-0.5 w-3 h-3
                               bg-green-500 rounded-full
                               border-2 border-gray-900" />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm
                             font-semibold truncate">
                {user?.name}
              </p>
              <p className="text-gray-400 text-xs
                             capitalize truncate">
                {user?.role?.toLowerCase()}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg
                          text-gray-500
                          hover:text-red-400
                          hover:bg-red-400/10
                          transition-colors
                          flex-shrink-0"
              title="Sign out"
            >
              <ArrowRightOnRectangleIcon
                className="w-4 h-4"
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center
                           gap-2">
            <div className="relative">
              <img
                src={
                  user?.avatarUrl || '/project-management-frontend/public/logo192.png'
                }
                alt={user?.name}
                className="w-9 h-9 rounded-xl
                            object-cover border-2
                            border-gray-700
                            cursor-pointer
                            hover:border-indigo-400
                            transition-colors"
                title={user?.name}
                onClick={() => navigate('/profile')}
              />
              <div className="absolute -bottom-0.5
                               -right-0.5 w-3 h-3
                               bg-green-500 rounded-full
                               border-2 border-gray-900" />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ============================
// NavItem Component
// ============================
function NavItem({
  path,
  icon: Icon,
  label,
  isOpen,
  exact = false,
}) {
  return (
    <NavLink
      to={path}
      end={exact}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5
        rounded-xl transition-all duration-200
        group relative
        ${isActive
          ? 'bg-indigo-600 text-white shadow-lg ' +
            'shadow-indigo-900/50'
          : 'text-gray-400 hover:bg-gray-800 ' +
            'hover:text-white'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <Icon className={`
            w-5 h-5 flex-shrink-0 transition-transform
            ${isActive
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white ' +
                'group-hover:scale-110'
            }
          `} />

          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className={`
                  text-sm font-medium whitespace-nowrap
                  overflow-hidden
                  ${isActive
                    ? 'text-white'
                    : 'text-gray-400 ' +
                      'group-hover:text-white'
                  }
                `}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip when collapsed */}
          {!isOpen && (
            <div className="absolute left-full ml-3
                             px-2.5 py-1.5 bg-gray-800
                             text-white text-xs
                             font-medium rounded-lg
                             whitespace-nowrap
                             opacity-0 pointer-events-none
                             group-hover:opacity-100
                             transition-opacity z-50
                             border border-gray-700
                             shadow-xl">
              {label}
              <div className="absolute top-1/2
                               -translate-y-1/2
                               -left-1.5 w-1.5 h-1.5
                               bg-gray-800 rotate-45
                               border-l border-t
                               border-gray-700" />
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}
