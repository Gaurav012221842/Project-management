// src/components/analytics/VelocityChart.jsx
import { motion }     from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const planned   = payload.find(
      p => p.dataKey === 'Planned'
    )?.value
    const completed = payload.find(
      p => p.dataKey === 'Completed'
    )?.value

    const rate = planned > 0
      ? Math.round(completed / planned * 100)
      : 0

    return (
      <div className="bg-white border border-gray-200
                       rounded-xl shadow-lg p-4">
        <p className="font-semibold text-gray-800
                       mb-2 pb-2 border-b
                       border-gray-100">
          {label}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-gray-500">
              Planned
            </span>
            <span className="text-xs font-bold
                              text-gray-700">
              {planned} pts
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-gray-500">
              Completed
            </span>
            <span className="text-xs font-bold
                              text-indigo-600">
              {completed} pts
            </span>
          </div>
          <div className="flex justify-between gap-4
                           pt-1 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Velocity
            </span>
            <span className={`text-xs font-bold
                               ${rate >= 80
                                 ? 'text-green-600'
                                 : rate >= 50
                                   ? 'text-yellow-600'
                                   : 'text-red-600'}`}>
              {rate}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function VelocityChart({
  data,
  loading = false
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6
                       border border-gray-100
                       shadow-sm animate-pulse">
        <div className="w-40 h-6 bg-gray-200
                         rounded mb-6" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    )
  }

  const chartData = data?.sprints?.map(sprint => ({
    name:      sprint.sprintName,
    Planned:   sprint.plannedPoints,
    Completed: sprint.completedPoints,
  })) || []

  const avgVelocity = data?.averageVelocity || 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
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
            Sprint Velocity
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Story points per sprint
          </p>
        </div>

        {/* Avg Velocity Badge */}
        <div className="text-center bg-indigo-50
                         rounded-xl px-4 py-2">
          <p className="text-2xl font-bold
                         text-indigo-600">
            {avgVelocity}
          </p>
          <p className="text-xs text-indigo-400">
            avg velocity
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={chartData}
          margin={{
            top: 5, right: 10,
            left: -20, bottom: 5
          }}
          barGap={4}
          barSize={30}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
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
              paddingTop: '16px',
              fontSize:   '12px',
              color:      '#6b7280',
            }}
          />

          {/* Average Reference Line */}
          {avgVelocity > 0 && (
            <ReferenceLine
              y={avgVelocity}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value:    `Avg: ${avgVelocity}`,
                position: 'right',
                fontSize: 11,
                fill:     '#f59e0b',
              }}
            />
          )}

          <Bar
            dataKey="Planned"
            fill="#e0e7ff"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Completed"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}