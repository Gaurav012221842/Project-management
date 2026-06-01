// src/components/project/ProjectStats.jsx
import { useSelector }    from 'react-redux'
import { motion }         from 'framer-motion'
import {
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/outline'
import { selectProjects } from '../../features/project/projectSlice'

export default function ProjectStats() {
  const projects = useSelector(selectProjects)

  const stats = [
    {
      label:  'Total',
      value:  projects.length,
      icon:   FolderIcon,
      color:  'indigo',
      bg:     'bg-indigo-50',
      text:   'text-indigo-600',
      iconBg: 'bg-indigo-500',
    },
    {
      label:  'Active',
      value:  projects.filter(
                p => p.status === 'ACTIVE'
              ).length,
      icon:   ClockIcon,
      color:  'green',
      bg:     'bg-green-50',
      text:   'text-green-600',
      iconBg: 'bg-green-500',
    },
    {
      label:  'Completed',
      value:  projects.filter(
                p => p.status === 'COMPLETED'
              ).length,
      icon:   CheckCircleIcon,
      color:  'blue',
      bg:     'bg-blue-50',
      text:   'text-blue-600',
      iconBg: 'bg-blue-500',
    },
    {
      label:  'On Hold',
      value:  projects.filter(
                p => p.status === 'ON_HOLD'
              ).length,
      icon:   PauseCircleIcon,
      color:  'orange',
      bg:     'bg-orange-50',
      text:   'text-orange-600',
      iconBg: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-2
                     md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{
            duration: 0.4,
            delay:    index * 0.08
          }}
          className={`${stat.bg} rounded-2xl p-4
                        border border-white
                        shadow-sm`}
        >
          <div className="flex items-center
                           justify-between mb-3">
            <div className={`w-9 h-9 ${stat.iconBg}
                              rounded-xl flex
                              items-center
                              justify-center`}>
              <stat.icon
                className="w-5 h-5 text-white"
              />
            </div>
            <span className={`text-3xl font-bold
                               ${stat.text}`}>
              {stat.value}
            </span>
          </div>
          <p className={`text-sm font-semibold
                          ${stat.text}`}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}