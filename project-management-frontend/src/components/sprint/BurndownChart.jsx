// src/components/sprint/BurndownChart.jsx
import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatDate } from '../../utils/dateUtils'

function BurndownChart({ data = [], idealData = [] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No burndown data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => formatDate(d, 'MMM d')}
          tick={{ fontSize: 11 }}
        />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          labelFormatter={(d) => formatDate(d, 'MMM d, yyyy')}
          formatter={(val, name) => [val, name === 'remaining' ? 'Remaining' : 'Ideal']}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="remaining"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Remaining"
        />
        <Line
          type="monotone"
          dataKey="ideal"
          stroke="#d1d5db"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="Ideal"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default BurndownChart
