// src/components/analytics/TaskStatusChart.jsx
import { motion }          from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const STATUS_LABELS = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW:   'In Review',
  DONE:        'Done',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white border border-gray-200
                       rounded-xl shadow-lg p-4">
        <p className="font-semibold text-gray-800 mb-1">
          {STATUS_LABELS[data.name] || data.name}
        </p>
        <p className="text-gray-600">
          <span className="font-bold
                            text-gray-900">
            {data.value}
          </span>
          {' '}tasks
        </p>
        <p className="text-gray-500 text-sm">
          {data.payload.percentage}%
        </p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center
                   gap-3 mt-4">
    {payload.map((entry, index) => (
      <div
        key={index}
        className="flex items-center gap-2"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm text-gray-600">
          {STATUS_LABELS[entry.value] || entry.value}
        </span>
      </div>
    ))}
  </div>
)

const RADIAN = Math.PI / 180
const renderCustomLabel = ({
  cx, cy,
  midAngle,
  innerRadius, outerRadius,
  percent,
}) => {
  if (percent < 0.05) return null
  const radius =
    innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(
    -midAngle * RADIAN
  )
  const y = cy + radius * Math.sin(
    -midAngle * RADIAN
  )
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function TaskStatusChart({
  data,
  loading = false
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6
                       border border-gray-100
                       shadow-sm">
        <div className="w-40 h-6 bg-gray-200
                         rounded animate-pulse mb-6" />
        <div className="w-48 h-48 bg-gray-100
                         rounded-full mx-auto
                         animate-pulse" />
      </div>
    )
  }

  const chartData = data?.byStatus?.filter(
    d => d.count > 0
  ) || []

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-6
                  border border-gray-100 shadow-sm
                  hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold
                        text-gray-900">
          Task Status
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Distribution by current status
        </p>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="flex items-center
                         justify-center h-64">
          <p className="text-gray-400">
            No data available
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="count"
              nameKey="status"
              labelLine={false}
              label={renderCustomLabel}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="flex items-center
                        gap-2 p-2 rounded-lg
                        bg-gray-50"
          >
            <div
              className="w-2.5 h-2.5 rounded-full
                          flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <p className="text-xs text-gray-500
                             truncate">
                {STATUS_LABELS[item.status] ||
                 item.status}
              </p>
              <p className="text-sm font-bold
                             text-gray-800">
                {item.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}