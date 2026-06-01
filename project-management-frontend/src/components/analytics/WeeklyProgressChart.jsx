// src/components/analytics/WeeklyProgressChart.jsx
import { motion }         from 'framer-motion'
import { useState }       from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({
  active, payload, label
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border
                       border-gray-200
                       rounded-xl shadow-lg p-4
                       min-w-[180px]">
        <p className="font-semibold text-gray-800
                       mb-3 pb-2 border-b
                       border-gray-100">
          {label}
        </p>
        {payload.map((entry, i) => (
          <div
            key={i}
            className="flex items-center
                        justify-between gap-4
                        mb-1"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-500">
                {entry.name}
              </span>
            </div>
            <span className="text-xs font-bold
                              text-gray-800">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function WeeklyProgressChart({
  data,
  loading = false
}) {
  const [activeMetric, setActiveMetric] =
    useState('all')

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6
                       border border-gray-100
                       shadow-sm animate-pulse">
        <div className="w-48 h-6 bg-gray-200
                         rounded mb-6" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    )
  }

  const chartData = data?.weeks?.map(week => ({
    name:      week.week,
    dateRange: week.dateRange,
    Created:   week.tasksCreated,
    Completed: week.tasksCompleted,
    Points:    week.storyPointsCompleted,
  })) || []

  const metrics = [
    { key: 'all',       label: 'All'       },
    { key: 'Created',   label: 'Created'   },
    { key: 'Completed', label: 'Completed' },
    { key: 'Points',    label: 'Points'    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl p-6
                  border border-gray-100 shadow-sm
                  hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center
                       justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold
                          text-gray-900">
            Weekly Progress
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Tasks created vs completed per week
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-gray-100
                         rounded-lg p-1">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() =>
                setActiveMetric(metric.key)
              }
              className={`px-3 py-1.5 rounded-md
                           text-xs font-medium
                           transition-colors
                           ${activeMetric === metric.key
                             ? 'bg-white text-gray-900 ' +
                               'shadow-sm'
                             : 'text-gray-500 ' +
                               'hover:text-gray-700'
                           }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={chartData}
          margin={{
            top: 5, right: 10,
            left: -20, bottom: 5
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{
              fontSize:   11,
              fill:       '#9ca3af',
              fontWeight: 500
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop:  '20px',
              fontSize:    '12px',
              color:       '#6b7280',
            }}
          />

          {(activeMetric === 'all' ||
            activeMetric === 'Created') && (
            <Bar
              dataKey="Created"
              fill="#e0e7ff"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          )}

          {(activeMetric === 'all' ||
            activeMetric === 'Completed') && (
            <Bar
              dataKey="Completed"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          )}

          {(activeMetric === 'all' ||
            activeMetric === 'Points') && (
            <Line
              type="monotone"
              dataKey="Points"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{
                fill:        '#f59e0b',
                strokeWidth: 2,
                r:           4,
              }}
              activeDot={{ r: 6 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  )
}