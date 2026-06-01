// src/pages/sprint/SprintPage.jsx
import { useEffect, useState }      from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams }                from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  PlusIcon,
  BoltIcon,
  Squares2X2Icon,
  TableCellsIcon,
  ClockIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'

// Components
import SprintCard          from '../../components/sprint/SprintCard'
import SprintBoard         from '../../components/sprint/SprintBoard'
import SprintTimeline      from '../../components/sprint/SprintTimeline'
import SprintStatsBar      from '../../components/sprint/SprintStatsBar'
import CreateSprintModal   from '../../components/sprint/CreateSprintModal'
import ActiveSprintBanner  from '../../components/sprint/ActiveSprintBanner'

// Redux
import {
  fetchSprints,
  selectSprints,
  selectSprintLoading,
  selectActiveSprint,
  selectSprintStats,
  selectActiveView,
  setActiveView,
  clearSprints,
} from '../../features/sprint/sprintSlice'

import {
  fetchProjectTasks,
  selectTasks,
} from '../../features/task/taskSlice'

const VIEW_TABS = [
  {
    key:   'board',
    label: 'Board View',
    icon:  Squares2X2Icon,
  },
  {
    key:   'list',
    label: 'Sprint List',
    icon:  TableCellsIcon,
  },
  {
    key:   'timeline',
    label: 'Timeline',
    icon:  CalendarDaysIcon,
  },
]

export default function SprintPage() {
  const dispatch      = useDispatch()
  const { projectId } = useParams()

  const sprints       = useSelector(selectSprints)
  const loading       = useSelector(selectSprintLoading)
  const activeSprint  = useSelector(selectActiveSprint)
  const stats         = useSelector(selectSprintStats)
  const activeView    = useSelector(selectActiveView)
  const tasks         = useSelector(selectTasks)

  const [showCreate, setShowCreate] = useState(false)

  // ============================
  // Fetch Data
  // ============================
  useEffect(() => {
    if (projectId) {
      const id = Number(projectId)
      dispatch(fetchSprints(id))
      dispatch(fetchProjectTasks(id))
    }
    return () => dispatch(clearSprints())
  }, [projectId, dispatch])

  // ============================
  // Group Tasks by Sprint
  // ============================
  const getSprintTasks = (sprintId) =>
    tasks.filter(t => t.sprintId === sprintId)

  const backlogTasks = tasks.filter(
    t => !t.sprintId
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================== */}
      {/*         Header           */}
      {/* ======================== */}
      <div className="bg-white border-b
                       border-gray-100 px-6 py-5
                       sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">

          {/* Title Row */}
          <div className="flex items-center
                           justify-between mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x:  0  }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-indigo-100
                               rounded-xl flex items-center
                               justify-center">
                <BoltIcon
                  className="w-5 h-5 text-indigo-600"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold
                                text-gray-900">
                  Sprint Management
                </h1>
                <p className="text-sm text-gray-500">
                  {stats.total} sprint
                  {stats.total !== 1 ? 's' : ''} •{' '}
                  {activeSprint
                    ? `"${activeSprint.name}" active`
                    : 'No active sprint'
                  }
                </p>
              </div>
            </motion.div>

            {/* Create Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x:  0 }}
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
              New Sprint
            </motion.button>
          </div>

          {/* View Tabs */}
          <div className="flex items-center gap-1
                           bg-gray-100 rounded-xl p-1
                           w-fit">
            {VIEW_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() =>
                  dispatch(setActiveView(tab.key))
                }
                className={`flex items-center gap-2
                              px-4 py-2 rounded-lg
                              text-sm font-medium
                              transition-all duration-200
                              ${activeView === tab.key
                                ? 'bg-white text-gray-900 ' +
                                  'shadow-sm'
                                : 'text-gray-500 ' +
                                  'hover:text-gray-700'
                              }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================== */}
      {/*        Content           */}
      {/* ======================== */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Stats Bar */}
        <SprintStatsBar stats={stats} />

        {/* Active Sprint Banner */}
        {activeSprint && (
          <ActiveSprintBanner
            sprint={activeSprint}
            tasks={getSprintTasks(activeSprint.id)}
            projectId={Number(projectId)}
          />
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1
                           md:grid-cols-2
                           lg:grid-cols-3 gap-5 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6
                            animate-pulse border
                            border-gray-100"
              >
                <div className="flex justify-between
                                 mb-4">
                  <div className="w-24 h-6 bg-gray-200
                                   rounded-full" />
                  <div className="w-16 h-6 bg-gray-100
                                   rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-gray-200
                                 rounded mb-2" />
                <div className="w-full h-3 bg-gray-100
                                 rounded mb-6" />
                <div className="w-full h-2 bg-gray-100
                                 rounded-full mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j}
                         className="h-14 bg-gray-50
                                     rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && sprints.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            className="flex flex-col items-center
                         justify-center py-24 text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1   }}
              transition={{
                type:   'spring',
                bounce: 0.4,
              }}
              className="w-24 h-24 bg-indigo-50
                           rounded-3xl flex items-center
                           justify-center mb-6"
            >
              <BoltIcon
                className="w-12 h-12 text-indigo-300"
              />
            </motion.div>
            <h3 className="text-xl font-bold
                            text-gray-800 mb-2">
              No sprints yet
            </h3>
            <p className="text-gray-400 max-w-sm mb-8
                           text-sm">
              Create your first sprint to start
              planning and tracking work
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98   }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2
                          px-6 py-3 bg-indigo-600
                          text-white rounded-xl
                          font-semibold text-sm
                          hover:bg-indigo-700
                          shadow-lg shadow-indigo-200"
            >
              <PlusIcon className="w-4 h-4" />
              Create First Sprint
            </motion.button>
          </motion.div>
        )}

        {/* Sprint Views */}
        {!loading && sprints.length > 0 && (
          <AnimatePresence mode="wait">

            {/* Board View */}
            {activeView === 'board' && (
              <motion.div
                key="board"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y:  0 }}
                exit={{ opacity: 0            }}
                transition={{ duration: 0.3   }}
                className="mt-6"
              >
                <SprintBoard
                  sprints={sprints}
                  getSprintTasks={getSprintTasks}
                  backlogTasks={backlogTasks}
                  projectId={Number(projectId)}
                />
              </motion.div>
            )}

            {/* List View */}
            {activeView === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y:  0 }}
                exit={{ opacity: 0            }}
                transition={{ duration: 0.3   }}
                className="mt-6 space-y-4"
              >
                {sprints.map((sprint, index) => (
                  <SprintCard
                    key={sprint.id}
                    sprint={sprint}
                    tasks={getSprintTasks(sprint.id)}
                    projectId={Number(projectId)}
                    index={index}
                  />
                ))}
              </motion.div>
            )}

            {/* Timeline View */}
            {activeView === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y:  0 }}
                exit={{ opacity: 0            }}
                transition={{ duration: 0.3   }}
                className="mt-6"
              >
                <SprintTimeline sprints={sprints} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Sprint Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateSprintModal
            projectId={Number(projectId)}
            onClose={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}