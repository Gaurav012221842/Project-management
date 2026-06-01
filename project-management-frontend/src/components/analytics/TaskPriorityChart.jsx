// src/components/analytics/TaskPriorityChart.jsx
import { motion }         from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const PRIORITY_LABELS = {
  LOW:      'Low',
  MEDIUM:   'Medium',
  HIGH:     'High',
  CRITICAL: 'Critical',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200
                       rounded-xl shadow-lg p-4">
        <p className="font-semibold text-gray-800 mb-2">
          {PRIORITY_LABELS[label] || label} Priority
        </p>
        <p className="text-gray-600">
          <span className="font-bold text-gray-900">
            {payload[0].value}
          </span>
          {' '}tasks
          {' '}
          <span className="text-gray-400">
            ({payload[0].payload.percentage}%)
          </span>
        </p>
      </div>
    )
  }
  return null
}

export default function TaskPriorityChart({
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
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i}
                 className="h-10 bg-gray-100 rounded"/>
          ))}
        </div>
      </div>
    )
  }

  const chartData = data?.byPriority?.map(item => ({
    ...item,
    name: PRIORITY_LABELS[item.priority] ||
          item.priority,
  })) || []

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl p-6
                  border border-gray-100 shadow-sm
                  hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold
                        text-gray-900">
          Priority Distribution
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Tasks grouped by priority level
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={chartData}
          margin={{
            top: 5, right: 10,
            left: -20, bottom: 5
          }}
          barSize={40}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{
              fontSize:   12,
              fill:       '#6b7280',
              fontWeight: 500
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          />
          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Priority Legend */}
      <div className="flex items-center
                       justify-center gap-4 mt-4">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5"
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-500">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}