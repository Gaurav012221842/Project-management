// src/components/project/ProjectCard.jsx
import { useState }               from 'react'
import { useNavigate }            from 'react-router-dom'
import { useDispatch }            from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { format }                 from 'date-fns'
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
  ChartBarIcon,
  RectangleStackIcon,
  CalendarIcon,
  UsersIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import EditProjectModal  from './EditProjectModal'
import ConfirmDeleteModal from '../common/ConfirmDialog/ConfirmDialog'
import {
  deleteProject,
} from '../../features/project/projectSlice'

// ============================
// Status Config
// ============================
const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Active',
    class: 'bg-green-100 text-green-700',
    dot:   'bg-green-500',
  },
  COMPLETED: {
    label: 'Completed',
    class: 'bg-blue-100 text-blue-700',
    dot:   'bg-blue-500',
  },
  ON_HOLD: {
    label: 'On Hold',
    class: 'bg-yellow-100 text-yellow-700',
    dot:   'bg-yellow-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    class: 'bg-red-100 text-red-700',
    dot:   'bg-red-500',
  },
}

// Project Color Palette
const PROJECT_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500   to-cyan-600',
  'from-green-500  to-emerald-600',
  'from-orange-500 to-red-600',
  'from-pink-500   to-rose-600',
  'from-teal-500   to-green-600',
]

export default function ProjectCard({
  project,
  index,
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showMenu,   setShowMenu]   = useState(false)
  const [showEdit,   setShowEdit]   = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const status = STATUS_CONFIG[project.status] ||
    STATUS_CONFIG.ACTIVE

  const colorGradient =
    PROJECT_COLORS[project.id % PROJECT_COLORS.length]

  const progress = project.stats?.progress || 0

  const memberCount =
    project.members?.length || 0

  const formattedDate = project.endDate
    ? format(new Date(project.endDate), 'MMM dd, yyyy')
    : null

  // ============================
  // Handlers
  // ============================
  const handleCardClick = () => {
    navigate(
      `/projects/${project.id}/board`
    )
  }

  const handleDelete = () => {
    dispatch(deleteProject(project.id))
    setShowDelete(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20  }}
        animate={{ opacity: 1, y: 0   }}
        transition={{
          duration: 0.4,
          delay:    index * 0.06,
        }}
        whileHover={{ y: -4, transition: { duration: 0.2 }}}
        className="bg-white rounded-2xl border
                    border-gray-100 shadow-sm
                    hover:shadow-xl
                    transition-all duration-300
                    overflow-hidden group
                    cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Card Top - Gradient Banner */}
        <div className={`h-2.5 bg-gradient-to-r
                          ${colorGradient}`} />

        <div className="p-5">

          {/* Header Row */}
          <div className="flex items-start
                           justify-between mb-4">

            {/* Project Icon */}
            <div className={`w-12 h-12 rounded-2xl
                              bg-gradient-to-br
                              ${colorGradient}
                              flex items-center
                              justify-center
                              text-white font-bold
                              text-xl shadow-md`}>
              {project.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <div className={`flex items-center gap-1.5
                                px-2.5 py-1 rounded-full
                                text-xs font-semibold
                                ${status.class}`}>
                <div className={`w-1.5 h-1.5 rounded-full
                                  ${status.dot}`} />
                {status.label}
              </div>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(!showMenu)
                  }}
                  className="p-1.5 rounded-lg
                              text-gray-400
                              hover:text-gray-600
                              hover:bg-gray-100
                              transition-colors
                              opacity-0
                              group-hover:opacity-100"
                >
                  <EllipsisHorizontalIcon
                    className="w-5 h-5"
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showMenu && (
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
                      className="absolute right-0
                                  top-9 bg-white
                                  rounded-xl shadow-xl
                                  border border-gray-100
                                  py-1.5 z-30
                                  min-w-[160px]"
                      onClick={e => e.stopPropagation()}
                    >
                      {[
                        {
                          icon:    ArrowTopRightOnSquareIcon,
                          label:   'Open Board',
                          onClick: () => navigate(
                            `/projects/${project.id}/board`
                          ),
                          class:   'text-gray-700',
                        },
                        {
                          icon:    ChartBarIcon,
                          label:   'Analytics',
                          onClick: () => navigate(
                            `/projects/${project.id}/analytics`
                          ),
                          class:   'text-gray-700',
                        },
                        {
                          icon:    PencilSquareIcon,
                          label:   'Edit Project',
                          onClick: () => {
                            setShowEdit(true)
                            setShowMenu(false)
                          },
                          class:   'text-gray-700',
                        },
                        {
                          icon:    TrashIcon,
                          label:   'Delete',
                          onClick: () => {
                            setShowDelete(true)
                            setShowMenu(false)
                          },
                          class:   'text-red-500',
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.onClick}
                          className={`flex items-center
                                       gap-3 w-full
                                       px-4 py-2.5
                                       text-sm
                                       font-medium
                                       hover:bg-gray-50
                                       transition-colors
                                       ${item.class}`}
                        >
                          <item.icon
                            className="w-4 h-4"
                          />
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Project Name */}
          <h3 className="font-bold text-gray-900
                          text-base mb-1.5
                          line-clamp-1 group-hover:
                          text-indigo-600
                          transition-colors">
            {project.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400
                         line-clamp-2 mb-4
                         leading-relaxed">
            {project.description ||
             'No description provided'}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center
                             justify-between mb-1.5">
              <span className="text-xs font-medium
                                text-gray-500">
                Progress
              </span>
              <span className="text-xs font-bold
                                text-gray-700">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-100
                             rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-2 rounded-full
                              bg-gradient-to-r
                              ${colorGradient}`}
              />
            </div>
          </div>

          {/* Footer Row */}
          <div className="flex items-center
                           justify-between pt-3
                           border-t border-gray-50">

            {/* Members */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.members
                  ?.slice(0, 4)
                  .map((member, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full
                                  border-2 border-white
                                  overflow-hidden
                                  bg-indigo-200"
                      title={member.name}
                    >
                      {member.profilePic ? (
                        <img
                          src={member.profilePic}
                          alt={member.name}
                          className="w-full h-full
                                      object-cover"
                        />
                      ) : (
                        <div className="w-full h-full
                                         bg-gradient-to-br
                                         from-indigo-400
                                         to-purple-500
                                         flex items-center
                                         justify-center
                                         text-white text-xs
                                         font-bold">
                          {member.name
                            ?.charAt(0)
                            .toUpperCase()
                          }
                        </div>
                      )}
                    </div>
                  ))
                }
                {memberCount > 4 && (
                  <div className="w-7 h-7 rounded-full
                                   border-2 border-white
                                   bg-gray-100 flex
                                   items-center
                                   justify-center
                                   text-xs font-bold
                                   text-gray-600">
                    +{memberCount - 4}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {memberCount} member
                {memberCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Due Date */}
            {formattedDate && (
              <div className="flex items-center
                               gap-1.5 text-xs
                               text-gray-400">
                <CalendarIcon className="w-3.5 h-3.5" />
                {formattedDate}
              </div>
            )}
          </div>

          {/* Quick Actions - Hover */}
          <div className="mt-4 pt-3 border-t
                           border-gray-50 flex gap-2
                           opacity-0 group-hover:opacity-100
                           transition-opacity duration-200">
            {[
              {
                icon:    RectangleStackIcon,
                label:   'Board',
                path:    'board',
                color:   'indigo',
              },
              {
                icon:    ChartBarIcon,
                label:   'Analytics',
                path:    'analytics',
                color:   'purple',
              },
            ].map(item => (
              <button
                key={item.path}
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(
                    `/projects/${project.id}/${item.path}`
                  )
                }}
                className={`flex-1 flex items-center
                              justify-center gap-1.5
                              py-2 rounded-lg text-xs
                              font-medium
                              bg-${item.color}-50
                              text-${item.color}-600
                              hover:bg-${item.color}-100
                              transition-colors`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEdit && (
          <EditProjectModal
            project={project}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {showDelete && (
          <ConfirmDeleteModal
            title="Delete Project"
            message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
            confirmLabel="Delete Project"
            isDanger
          />
        )}
      </AnimatePresence>
    </>
  )
}