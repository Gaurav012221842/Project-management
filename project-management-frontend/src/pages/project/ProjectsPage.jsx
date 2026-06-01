// src/pages/project/ProjectsPage.jsx
import { useEffect, useState }      from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  PlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  FolderOpenIcon,
} from '@heroicons/react/24/outline'
import ProjectGrid          from '../../components/project/ProjectGrid'
import ProjectList          from '../../components/project/ProjectList'
import CreateProjectModal   from '../../components/project/CreateProjectModal'
import ProjectFilters       from '../../components/project/ProjectFilters'
import ProjectStats         from '../../components/project/ProjectStats'
import {
  fetchProjects,
  selectFilteredProjects,
  selectProjectLoading,
  selectViewMode,
  selectTotalElements,
  setViewMode,
  setFilters,
  selectProjectFilters,
} from '../../features/project/projectSlice'

export default function ProjectsPage() {
  const dispatch = useDispatch()

  const projects      = useSelector(selectFilteredProjects)
  const loading       = useSelector(selectProjectLoading)
  const viewMode      = useSelector(selectViewMode)
  const totalElements = useSelector(selectTotalElements)
  const filters       = useSelector(selectProjectFilters)

  const [showCreate,  setShowCreate]  = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchVal,   setSearchVal]   = useState('')

  // ============================
  // Fetch Projects
  // ============================
  useEffect(() => {
    dispatch(fetchProjects({ page: 0, size: 50 }))
  }, [dispatch])

  // ============================
  // Search Handler
  // ============================
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchVal }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchVal, dispatch])

  const STATUS_OPTIONS = [
    { value: 'ALL',       label: 'All Projects' },
    { value: 'ACTIVE',    label: 'Active'       },
    { value: 'COMPLETED', label: 'Completed'    },
    { value: 'ON_HOLD',   label: 'On Hold'      },
    { value: 'CANCELLED', label: 'Cancelled'    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================== */}
      {/*         Header           */}
      {/* ======================== */}
      <div className="bg-white border-b
                       border-gray-100 px-6 py-5
                       sticky top-16 z-30
                       shadow-sm">
        <div className="max-w-7xl mx-auto">

          {/* Title Row */}
          <div className="flex items-center
                           justify-between mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x:  0  }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl font-bold
                              text-gray-900">
                My Projects
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalElements} project
                {totalElements !== 1 ? 's' : ''}{' '}
                total
              </p>
            </motion.div>

            {/* Create Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x:  0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98   }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2
                          px-5 py-2.5 bg-indigo-600
                          text-white rounded-xl
                          font-semibold text-sm
                          hover:bg-indigo-700
                          shadow-lg shadow-indigo-200
                          transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4" />
              New Project
            </motion.button>
          </div>

          {/* Controls Row */}
          <div className="flex items-center
                           gap-3 flex-wrap">

            {/* Search */}
            <div className="flex-1 min-w-[200px]
                             max-w-sm relative">
              <MagnifyingGlassIcon
                className="absolute left-3.5
                            top-1/2 -translate-y-1/2
                            w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchVal}
                onChange={(e) =>
                  setSearchVal(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2.5
                            bg-gray-50 border
                            border-gray-200
                            rounded-xl text-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            focus:border-transparent
                            hover:border-gray-300
                            transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-1 bg-gray-100
                             rounded-xl p-1">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() =>
                    dispatch(
                      setFilters({
                        status: opt.value
                      })
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg
                               text-xs font-medium
                               transition-all duration-200
                               whitespace-nowrap
                               ${filters.status ===
                                 opt.value
                                 ? 'bg-white text-gray-900 ' +
                                   'shadow-sm'
                                 : 'text-gray-500 ' +
                                   'hover:text-gray-700'
                               }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 bg-gray-100
                             rounded-xl p-1">
              {[
                {
                  mode: 'grid',
                  icon: Squares2X2Icon
                },
                {
                  mode: 'list',
                  icon: ListBulletIcon
                },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() =>
                    dispatch(setViewMode(mode))
                  }
                  className={`p-2 rounded-lg
                               transition-all duration-200
                               ${viewMode === mode
                                 ? 'bg-white text-gray-900 ' +
                                   'shadow-sm'
                                 : 'text-gray-500 ' +
                                   'hover:text-gray-700'
                               }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================== */}
      {/*    Projects Content      */}
      {/* ======================== */}
      <div className="max-w-7xl mx-auto px-6 py-6 mt-12">

        {/* Overview Stats */}
        <ProjectStats />

        {/* Loading Skeleton */}
        {loading && (
          <div className={`mt-6 grid gap-5
                            ${viewMode === 'grid'
                              ? 'grid-cols-1 ' +
                                'sm:grid-cols-2 ' +
                                'lg:grid-cols-3'
                              : 'grid-cols-1'
                            }`}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl
                            p-6 animate-pulse
                            border border-gray-100"
              >
                <div className="flex items-start
                                 justify-between mb-4">
                  <div className="w-12 h-12
                                   bg-gray-200
                                   rounded-xl" />
                  <div className="w-16 h-6 bg-gray-100
                                   rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-gray-200
                                 rounded mb-2" />
                <div className="w-full h-3 bg-gray-100
                                 rounded mb-1" />
                <div className="w-2/3 h-3 bg-gray-100
                                 rounded mb-6" />
                <div className="w-full h-2 bg-gray-100
                                 rounded-full mb-4" />
                <div className="flex justify-between">
                  <div className="w-20 h-3 bg-gray-100
                                   rounded" />
                  <div className="flex -space-x-1">
                    {[...Array(3)].map((_, j) => (
                      <div key={j}
                           className="w-6 h-6
                                       bg-gray-200
                                       rounded-full
                                       border-2
                                       border-white" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center
                         justify-center py-24 px-4
                         text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1   }}
              transition={{ duration: 0.4 }}
              className="w-24 h-24 bg-indigo-50
                           rounded-3xl flex items-center
                           justify-center mb-6"
            >
              <FolderOpenIcon
                className="w-12 h-12 text-indigo-300"
              />
            </motion.div>
            <h3 className="text-xl font-bold
                            text-gray-800 mb-2">
              No projects found
            </h3>
            <p className="text-gray-400 max-w-sm
                           mb-8 text-sm">
              {filters.search || filters.status !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Create your first project to get started'
              }
            </p>
            {filters.status === 'ALL' &&
             !filters.search && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98   }}
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2
                            px-6 py-3 bg-indigo-600
                            text-white rounded-xl
                            font-semibold text-sm
                            hover:bg-indigo-700
                            shadow-lg shadow-indigo-200
                            transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                Create First Project
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Projects View */}
        {!loading && projects.length > 0 && (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0    }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                <ProjectGrid projects={projects} />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0    }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                <ProjectList projects={projects} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateProjectModal
            onClose={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}