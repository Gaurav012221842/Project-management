// src/components/layout/PageHeader/PageHeader.jsx
import { motion } from 'framer-motion'

export default function PageHeader({
  title,
  subtitle,
  icon:    Icon,
  iconBg  = 'bg-indigo-100',
  iconColor = 'text-indigo-600',
  actions,
  children,
}) {
  return (
    <div className="bg-white border-b border-gray-100
                     px-6 py-5 sticky top-14 z-20
                     shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center
                         justify-between gap-4
                         flex-wrap">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x:  0  }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            {Icon && (
              <div className={`w-11 h-11 ${iconBg}
                                rounded-xl flex items-center
                                justify-center
                                flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold
                              text-gray-900 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500
                               mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </motion.div>

          {/* Right Actions */}
          {actions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x:  0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              {actions}
            </motion.div>
          )}
        </div>

        {/* Children (tabs, filters, etc) */}
        {children && (
          <div className="mt-4">{children}</div>
        )}
      </div>
    </div>
  )
}