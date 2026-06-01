// src/components/analytics/ProgressCard.jsx
import { motion } from 'framer-motion'

export default function ProgressCard({
  title,
  current,
  total,
  color     = 'indigo',
  loading   = false,
  showLabel = true,
  size      = 'md',
}) {
  const percentage = total === 0
    ? 0
    : Math.round(current / total * 100)

  const SIZES = {
    sm: { radius: 45, stroke: 8,  text: 'text-lg' },
    md: { radius: 58, stroke: 10, text: 'text-2xl' },
    lg: { radius: 70, stroke: 12, text: 'text-3xl' },
  }

  const COLORS = {
    indigo: { stroke: '#6366f1', bg: '#e0e7ff' },
    green:  { stroke: '#22c55e', bg: '#dcfce7' },
    orange: { stroke: '#f97316', bg: '#ffedd5' },
    red:    { stroke: '#ef4444', bg: '#fee2e2' },
  }

  const cfg    = SIZES[size]
  const clr    = COLORS[color]
  const radius = cfg.radius
  const circ   = 2 * Math.PI * radius
  const offset = circ - (percentage / 100 * circ)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6
                       border border-gray-100
                       shadow-sm animate-pulse
                       flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-200
                         rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="w-32 h-4 bg-gray-200
                           rounded" />
          <div className="w-24 h-3 bg-gray-100
                           rounded" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-6
                  border border-gray-100 shadow-sm
                  hover:shadow-md transition-shadow
                  flex items-center gap-6"
    >
      {/* Circular Progress */}
      <div className="relative flex-shrink-0">
        <svg
          width={radius * 2 + cfg.stroke * 2}
          height={radius * 2 + cfg.stroke * 2}
          className="-rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={radius + cfg.stroke}
            cy={radius + cfg.stroke}
            r={radius}
            fill="none"
            stroke={clr.bg}
            strokeWidth={cfg.stroke}
          />
          {/* Progress Circle */}
          <motion.circle
            cx={radius + cfg.stroke}
            cy={radius + cfg.stroke}
            r={radius}
            fill="none"
            stroke={clr.stroke}
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex
                         items-center justify-center">
          <span className={`font-bold text-gray-900
                             ${cfg.text}`}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900
                        text-sm mb-1">
          {title}
        </h4>
        {showLabel && (
          <p className="text-gray-500 text-xs mb-3">
            {current} of {total} completed
          </p>
        )}

        {/* Mini Progress Bar */}
        <div className="w-full bg-gray-100
                         rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${percentage}%`
            }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-2 rounded-full
                        transition-all"
            style={{ backgroundColor: clr.stroke }}
          />
        </div>

        <div className="flex justify-between
                         mt-1">
          <span className="text-xs text-gray-400">
            0%
          </span>
          <span className="text-xs text-gray-400">
            100%
          </span>
        </div>
      </div>
    </motion.div>
  )
}