// src/components/analytics/BurndownChart.jsx
import { motion }         from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const CustomTooltip = ({
  active, payload, label
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200
                       rounded-xl shadow-lg p-4">
        <p className="font-semibold text-gray-700
                       mb-2 text-sm">
          {label}
        </p>
        {payload.map((entry, i) => (
          <div
            key={i}
            className="flex items-center
                        justify-between gap-4"
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
              {entry.value} pts
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function BurndownChart({
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

  if (!data) {
    return (
      <div className="bg-white rounded-2xl p-6
                       border border-gray-100
                       shadow-sm flex items-center
                       justify-center h-64">
        <p className="text-gray-400">
          Select an active sprint to view burndown
        </p>
      </div>
    )
  }

  // Merge ideal + actual
  const chartData = data.idealLine?.map(
    (idealPt, index) => ({
      date:   idealPt.date,
      Ideal:  idealPt.remaining,
      Actual: data.actualLine?.[index]?.remaining,
    })
  ) || []

  const isOnTrack =
    chartData.length > 0 &&
    chartData[chartData.length - 1]?.Actual <=
    chartData[chartData.length - 1]?.Ideal

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
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
            Burndown Chart
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {data.sprintName} •{' '}
            {data.totalStoryPoints} total points
          </p>
        </div>

        {/* On Track Badge */}
        <div className={`px-3 py-1.5 rounded-full
                          text-xs font-semibold
                          ${isOnTrack
                            ? 'bg-green-100 ' +
                              'text-green-700'
                            : 'bg-red-100 ' +
                              'text-red-700'
                          }`}>
          {isOnTrack ? '✅ On Track' : '⚠️ Behind'}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={chartData}
          margin={{
            top: 5, right: 10,
            left: -20, bottom: 5
          }}
        >
          <defs>
            <linearGradient
              id="idealGradient"
              x1="0" y1="0"
              x2="0" y2="1"
            >
              <stop
                offset="5%"
                stopColor="#94a3b8"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#94a3b8"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient
              id="actualGradient"
              x1="0" y1="0"
              x2="0" y2="1"
            >
              <stop
                offset="5%"
                stopColor="#6366f1"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#6366f1"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
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
              paddingTop: '20px',
              fontSize:   '12px',
              color:      '#6b7280',
            }}
          />
          <ReferenceLine
            y={0}
            stroke="#e5e7eb"
            strokeWidth={2}
          />

          {/* Ideal Line */}
          <Area
            type="monotone"
            dataKey="Ideal"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#idealGradient)"
            dot={false}
          />

          {/* Actual Line */}
          <Area
            type="monotone"
            dataKey="Actual"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#actualGradient)"
            dot={{
              fill:        '#6366f1',
              strokeWidth: 2,
              r:           3,
            }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}