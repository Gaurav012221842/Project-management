// src/components/sprint/SprintStatsBar.jsx
import { motion } from 'framer-motion'
import {
  BoltIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const STAT_CONFIG = [
  {
    key:    'total',
    label:  'Total Sprints',
    icon:   BoltIcon,
    bg:     'bg-indigo-50',
    iconBg: 'bg-indigo-500',
    text:   'text-indigo-600',
  },
  {
    key:    'active',
    label:  'Active',
    icon:   PlayCircleIcon,
    bg:     'bg-green-50',
    iconBg: 'bg-green-500',
    text:   'text-green-600',
  },
  {
    key:    'planned',
    label:  'Planned',
    icon:   ClockIcon,
    bg:     'bg-blue-50',
    iconBg: 'bg-blue-500',
    text:   'text-blue-600',
  },
  {
    key:    'completed',
    label:  'Completed',
    icon:   CheckCircleIcon,
    bg:     'bg-purple-50',
    iconBg: 'bg-purple-500',
    text:   'text-purple-600',
  },
]

export default function SprintStatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2
                     md:grid-cols-4 gap-4 mb-6">
      {STAT_CONFIG.map((config, index) => (
        <motion.div
          key={config.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{
            duration: 0.4,
            delay:    index * 0.08,
          }}
          className={`${config.bg} rounded-2xl p-4
                        border border-white shadow-sm`}
        >
          <div className="flex items-center
                           justify-between mb-3">
            <div className={`w-9 h-9 ${config.iconBg}
                              rounded-xl flex
                              items-center
                              justify-center`}>
              <config.icon
                className="w-5 h-5 text-white"
              />
            </div>
            <span className={`text-3xl font-bold
                               ${config.text}`}>
              {stats[config.key] ?? 0}
            </span>
          </div>
          <p className={`text-sm font-semibold
                          ${config.text}`}>
            {config.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}