// src/components/sprint/SprintTimeline.jsx
import { motion }        from 'framer-motion'
import {
  differenceInDays,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  parseISO,
} from 'date-fns'

const STATUS_GRADIENT = {
  PLANNED:   'from-blue-400   to-blue-600',
  ACTIVE:    'from-green-400  to-green-600',
  COMPLETED: 'from-purple-400 to-purple-600',
}

const STATUS_BG = {
  PLANNED:   'bg-blue-50   border-blue-200',
  ACTIVE:    'bg-green-50  border-green-200',
  COMPLETED: 'bg-purple-50 border-purple-200',
}

export default function SprintTimeline({ sprints }) {
  if (!sprints.length) return null

  // Find overall date range
  const validSprints = sprints.filter(
    s => s.startDate && s.endDate
  )

  if (!validSprints.length) {
    return (
      <div className="bg-white rounded-2xl p-12
                       text-center border border-gray-100">
        <p className="text-gray-400">
          No sprint dates configured
        </p>
      </div>
    )
  }

  const allDates = validSprints.flatMap(s => [
    new Date(s.startDate),
    new Date(s.endDate),
  ])

  const minDate = new Date(
    Math.min(...allDates.map(d => d.getTime()))
  )
  const maxDate = new Date(
    Math.max(...allDates.map(d => d.getTime()))
  )

  const totalDays = differenceInDays(maxDate, minDate) + 1

  const today = new Date()
  const todayOffset = differenceInDays(today, minDate)

  // Generate month labels
  const months = []
  let current = startOfMonth(minDate)
  while (current <= maxDate) {
    months.push(new Date(current))
    current = new Date(
      current.getFullYear(),
      current.getMonth() + 1,
      1
    )
  }

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm
                     overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b
                       border-gray-100">
        <h3 className="text-lg font-bold
                        text-gray-900">
          Sprint Timeline
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {format(minDate, 'MMM yyyy')} —{' '}
          {format(maxDate, 'MMM yyyy')}
        </p>
      </div>

      <div className="p-6 overflow-x-auto">
        <div className="min-w-[600px]">

          {/* Month Headers */}
          <div className="flex mb-3 pl-48">
            {months.map((month, i) => {
              const monthStart = i === 0
                ? minDate
                : startOfMonth(month)
              const monthEnd = endOfMonth(month) > maxDate
                ? maxDate
                : endOfMonth(month)

              const startOffset = differenceInDays(
                monthStart, minDate
              )
              const monthDays = differenceInDays(
                monthEnd, monthStart
              ) + 1
              const widthPct =
                (monthDays / totalDays) * 100

              return (
                <div
                  key={i}
                  style={{ width: `${widthPct}%` }}
                  className="text-xs font-semibold
                              text-gray-500 px-1
                              border-l border-gray-200
                              pb-1"
                >
                  {format(month, 'MMM yyyy')}
                </div>
              )
            })}
          </div>

          {/* Sprint Rows */}
          <div className="space-y-3">
            {validSprints.map((sprint, index) => {
              const start = new Date(sprint.startDate)
              const end   = new Date(sprint.endDate)

              const leftOffset =
                differenceInDays(start, minDate) /
                totalDays * 100

              const width =
                (differenceInDays(end, start) + 1) /
                totalDays * 100

              const gradient =
                STATUS_GRADIENT[sprint.status] ||
                STATUS_GRADIENT.PLANNED

              return (
                <motion.div
                  key={sprint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x:  0  }}
                  transition={{
                    duration: 0.4,
                    delay:    index * 0.08,
                  }}
                  className="flex items-center gap-4"
                >
                  {/* Sprint Name */}
                  <div className="w-44 flex-shrink-0
                                   text-right pr-4">
                    <p className="text-sm font-semibold
                                   text-gray-800 truncate">
                      {sprint.name}
                    </p>
                    <p className={`text-xs font-medium
                                    mt-0.5
                                    ${sprint.status ===
                                      'ACTIVE'
                                      ? 'text-green-600'
                                      : sprint.status ===
                                        'COMPLETED'
                                        ? 'text-purple-600'
                                        : 'text-blue-600'
                                    }`}>
                      {sprint.status}
                    </p>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-10">
                    {/* Background Grid */}
                    <div className="absolute inset-0
                                     rounded-lg
                                     bg-gray-50
                                     border
                                     border-gray-100" />

                    {/* Sprint Bar */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1  }}
                      transition={{
                        duration: 0.8,
                        delay:    0.3 + index * 0.1,
                        ease:     'easeOut',
                      }}
                      style={{
                        left:  `${leftOffset}%`,
                        width: `${width}%`,
                        transformOrigin: 'left',
                      }}
                      className={`absolute top-1.5
                                   bottom-1.5 rounded-lg
                                   bg-gradient-to-r
                                   ${gradient}
                                   shadow-md flex items-center
                                   px-3 cursor-pointer
                                   hover:brightness-105
                                   transition-filter`}
                    >
                      <span className="text-white text-xs
                                        font-bold truncate">
                        {format(start, 'MMM dd')} -{' '}
                        {format(end, 'MMM dd')}
                      </span>
                    </motion.div>

                    {/* Today Marker */}
                    {today >= minDate &&
                     today <= maxDate && (
                      <div
                        className="absolute top-0 bottom-0
                                    w-0.5 bg-red-500
                                    z-10"
                        style={{
                          left: `${todayOffset / totalDays * 100}%`
                        }}
                      >
                        <div className="absolute -top-1
                                         left-1/2
                                         -translate-x-1/2
                                         w-2 h-2
                                         bg-red-500
                                         rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="w-20 flex-shrink-0
                                   text-left">
                    <p className="text-xs font-medium
                                   text-gray-500">
                      {differenceInDays(end, start) + 1}d
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Today Legend */}
          <div className="flex items-center gap-2
                           mt-6 pl-48">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500" />
              <div className="w-1.5 h-1.5 bg-red-500
                               rounded-full" />
              <span className="text-xs text-red-500
                                font-medium">
                Today
              </span>
            </div>
            <div className="flex items-center
                             gap-4 ml-4">
              {Object.entries({
                PLANNED:   'Planned',
                ACTIVE:    'Active',
                COMPLETED: 'Completed',
              }).map(([status, label]) => (
                <div
                  key={status}
                  className="flex items-center gap-1.5"
                >
                  <div className={`w-3 h-3 rounded
                                    bg-gradient-to-r
                                    ${STATUS_GRADIENT[status]}`}
                  />
                  <span className="text-xs text-gray-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}