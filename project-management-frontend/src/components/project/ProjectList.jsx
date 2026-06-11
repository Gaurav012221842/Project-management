// src/components/project/ProjectList.jsx
import { useState }               from 'react'
import { useNavigate }            from 'react-router-dom'
import { useDispatch }            from 'react-redux'
import { motion }                 from 'framer-motion'
import { format }                 from 'date-fns'
import {
  ChevronRightIcon,
  PencilSquareIcon,
  TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import {
  deleteProject,
} from '../../features/project/projectSlice'
import { getProjectColorIndex } from '../../utils/projectUtils'

const STATUS_CONFIG = {
  ACTIVE:    { label: 'Active',    class: 'bg-green-100  text-green-700'  },
  COMPLETED: { label: 'Completed', class: 'bg-blue-100   text-blue-700'   },
  ON_HOLD:   { label: 'On Hold',   class: 'bg-yellow-100 text-yellow-700' },
  CANCELLED: { label: 'Cancelled', class: 'bg-red-100    text-red-700'    },
}

const PROJECT_COLORS = [
  'bg-indigo-500', 'bg-blue-500',
  'bg-green-500',  'bg-orange-500',
  'bg-pink-500',   'bg-teal-500',
]

export default function ProjectList({ projects }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm
                     overflow-hidden">

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4
                       px-6 py-3 bg-gray-50
                       border-b border-gray-100
                       text-xs font-semibold
                       text-gray-500 uppercase
                       tracking-wider">
        <div className="col-span-4">Project</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Progress</div>
        <div className="col-span-2">Members</div>
        <div className="col-span-1">Due Date</div>
        <div className="col-span-1 text-right">
          Actions
        </div>
      </div>

      {/* Project Rows */}
      {projects.map((project, index) => {
        const status =
          STATUS_CONFIG[project.status] ||
          STATUS_CONFIG.ACTIVE

        const progress = project.stats?.progress || 0

        const color =
          PROJECT_COLORS[
            getProjectColorIndex(project.id, PROJECT_COLORS.length)
          ]

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0   }}
            transition={{
              duration: 0.3,
              delay:    index * 0.05,
            }}
            className="grid grid-cols-12 gap-4
                        px-6 py-4 items-center
                        border-b border-gray-50
                        last:border-b-0
                        hover:bg-gray-50/70
                        transition-colors
                        cursor-pointer group"
            onClick={() =>
              navigate(
                `/projects/${project.id}/board`
              )
            }
          >
            {/* Project Info */}
            <div className="col-span-4 flex
                             items-center gap-3">
              <div className={`w-9 h-9 ${color}
                                rounded-xl flex
                                items-center
                                justify-center
                                text-white font-bold
                                text-sm flex-shrink-0`}>
                {project.name
                  .charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm
                               text-gray-900 truncate
                               group-hover:text-indigo-600
                               transition-colors">
                  {project.name}
                </p>
                <p className="text-xs text-gray-400
                               truncate">
                  {project.description ||
                   'No description'}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={`px-2.5 py-1
                                 rounded-full text-xs
                                 font-semibold
                                 ${status.class}`}>
                {status.label}
              </span>
            </div>

            {/* Progress */}
            <div className="col-span-2">
              <div className="flex items-center
                               gap-2">
                <div className="flex-1 bg-gray-100
                                 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className={`h-1.5 rounded-full
                                  ${color}`}
                  />
                </div>
                <span className="text-xs font-medium
                                  text-gray-600 w-8">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Members */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {project.members
                    ?.slice(0, 3)
                    .map((m, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full
                                    border-2 border-white
                                    bg-indigo-200
                                    overflow-hidden"
                        title={m.name}
                      >
                        {m.profilePic ? (
                          <img
                            src={m.profilePic}
                            alt={m.name}
                            className="w-full h-full
                                        object-cover"
                          />
                        ) : (
                          <div className="w-full h-full
                                           bg-indigo-400
                                           flex items-center
                                           justify-center
                                           text-white
                                           text-[9px]
                                           font-bold">
                            {m.name?.charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
                <span className="text-xs text-gray-400">
                  {project.members?.length || 0}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div className="col-span-1">
              <span className="text-xs text-gray-400">
                {project.endDate
                  ? format(
                      new Date(project.endDate),
                      'MMM dd'
                    )
                  : '—'
                }
              </span>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex items-center
                             justify-end gap-1
                             opacity-0
                             group-hover:opacity-100
                             transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(
                    `/projects/${project.id}/analytics`
                  )
                }}
                className="p-1.5 rounded-lg
                            text-gray-400
                            hover:text-indigo-600
                            hover:bg-indigo-50
                            transition-colors"
                title="Analytics"
              >
                <ChartBarIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg
                            text-gray-400
                            hover:text-gray-600
                            hover:bg-gray-100
                            transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
