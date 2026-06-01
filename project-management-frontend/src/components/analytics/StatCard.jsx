// src/components/analytics/StatCard.jsx
import { motion } from 'framer-motion'
import {
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/solid'

const COLOR_VARIANTS = {
  blue: {
    bg:       'bg-blue-50',
    icon:     'bg-blue-500',
    text:     'text-blue-600',
    border:   'border-blue-100',
    gradient: 'from-blue-500 to-blue-600',
  },
  green: {
    bg:       'bg-green-50',
    icon:     'bg-green-500',
    text:     'text-green-600',
    border:   'border-green-100',
    gradient: 'from-green-500 to-green-600',
  },
  purple: {
    bg:       'bg-purple-50',
    icon:     'bg-purple-500',
    text:     'text-purple-600',
    border:   'border-purple-100',
    gradient: 'from-purple-500 to-purple-600',
  },
  orange: {
    bg:       'bg-orange-50',
    icon:     'bg-orange-500',
    text:     'text-orange-600',
    border:   'border-orange-100',
    gradient: 'from-orange-500 to-orange-600',
  },
  red: {
    bg:       'bg-red-50',
    icon:     'bg-red-500',
    text:     'text-red-600',
    border:   'border-red-100',
    gradient: 'from-red-500 to-red-600',
  },
  indigo: {
    bg:       'bg-indigo-50',
    icon:     'bg-indigo-500',
    text:     'text-indigo-600',
    border:   'border-indigo-100',
    gradient: 'from-indigo-500 to-indigo-600',
  },
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color      = 'indigo',
  trend,
  trendValue,
  loading    = false,
  index      = 0,
}) {
  const colors = COLOR_VARIANTS[color]

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6
                       border border-gray-100
                       shadow-sm animate-pulse">
        <div className="flex items-center
                         justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200
                           rounded-xl" />
          <div className="w-16 h-4 bg-gray-200
                           rounded" />
        </div>
        <div className="w-20 h-8 bg-gray-200
                         rounded mb-2" />
        <div className="w-32 h-4 bg-gray-200
                         rounded" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay:    index * 0.1
      }}
      className={`bg-white rounded-2xl p-6
                   border ${colors.border}
                   shadow-sm hover:shadow-md
                   transition-all duration-300
                   group cursor-default`}
    >
      {/* Header */}
      <div className="flex items-center
                       justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl
                          bg-gradient-to-br
                          ${colors.gradient}
                          flex items-center
                          justify-center
                          shadow-md
                          group-hover:scale-110
                          transition-transform
                          duration-300`}>
          {Icon && (
            <Icon className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Trend Badge */}
        {trend !== undefined && (
          <div className={`flex items-center gap-1
                            px-2.5 py-1 rounded-full
                            text-xs font-semibold
                            ${trend >= 0
                              ? 'bg-green-100 ' +
                                'text-green-700'
                              : 'bg-red-100 ' +
                                'text-red-700'
                            }`}>
            {trend >= 0
              ? <ArrowUpIcon className="w-3 h-3" />
              : <ArrowDownIcon className="w-3 h-3" />
            }
            {Math.abs(trendValue || trend)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="space-y-1">
        <p className="text-3xl font-bold
                       text-gray-900 tracking-tight">
          {value ?? '—'}
        </p>
        <p className="text-sm font-medium
                       text-gray-500">
          {title}
        </p>
        {subtitle && (
          <p className={`text-xs font-medium
                          ${colors.text}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Progress Bar (optional) */}
      {typeof value === 'string' &&
       value.includes('%') && (
        <div className="mt-4">
          <div className="w-full bg-gray-100
                           rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${parseInt(value)}%`
              }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-1.5 rounded-full
                           bg-gradient-to-r
                           ${colors.gradient}`}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}