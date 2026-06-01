// src/components/analytics/TeamPerformanceChart.jsx
import { motion }         from 'framer-motion'
import { useState }       from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const ProgressBar = ({
  label,
  value,
  max,
  color = 'bg-indigo-500'
}) => {
  const pct = max === 0 ? 0 :
    Math.min(100, Math.round(value / max * 100))

  return (
    <div className="space-y-1">
      <div className="flex justify-between
                       text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold
                          text-gray-700">
          {value}
        </span>
      </div>
      <div className="w-full bg-gray-100
                       rounded-full h-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-1.5 rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

const MemberCard = ({ member, index, isSelected,
  onSelect, maxValues }) => {

  const completionColor =
    member.completionRate >= 0.8
      ? 'text-green-600 bg-green-100'
      : member.completionRate >= 0.5
        ? 'text-yellow-600 bg-yellow-100'
        : 'text-red-600 bg-red-100'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => onSelect(member)}
      className={`p-4 rounded-xl border-2 cursor-pointer
                   transition-all duration-200
                   ${isSelected
                     ? 'border-indigo-400 bg-indigo-50'
                     : 'border-gray-100 bg-white ' +
                       'hover:border-indigo-200 ' +
                       'hover:bg-gray-50'
                   }`}
    >
      {/* Member Header */}
      <div className="flex items-center
                       gap-3 mb-3">
        <div className="relative">
          <img
            src={
              member.userAvatar ||
              '/default-avatar.png'
            }
            alt={member.userName}
            className="w-10 h-10 rounded-full
                        object-cover border-2
                        border-white shadow-sm"
          />
          <div className={`absolute -bottom-1 -right-1
                            w-4 h-4 rounded-full
                            border-2 border-white
                            ${member.completionRate >= 0.7
                              ? 'bg-green-400'
                              : 'bg-yellow-400'
                            }`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900
                         text-sm truncate">
            {member.userName}
          </p>
          <p className="text-xs text-gray-500">
            {member.tasksAssigned} tasks assigned
          </p>
        </div>

        <div className={`px-2.5 py-1 rounded-full
                          text-xs font-bold
                          ${completionColor}`}>
          {Math.round(member.completionRate * 100)}%
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <ProgressBar
          label="Tasks Completed"
          value={member.tasksCompleted}
          max={maxValues.tasks}
          color="bg-green-500"
        />
        <ProgressBar
          label="Story Points"
          value={member.storyPointsCompleted}
          max={maxValues.points}
          color="bg-indigo-500"
        />
        <ProgressBar
          label="Comments"
          value={member.commentsCount}
          max={maxValues.comments}
          color="bg-purple-500"
        />
      </div>
    </motion.div>
  )
}

export default function TeamPerformanceChart({
  data,
  loading = false
}) {
  const [selectedMember, setSelectedMember] =
    useState(null)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6
                       border border-gray-100
                       shadow-sm animate-pulse">
        <div className="w-48 h-6 bg-gray-200
                         rounded mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}
                 className="h-40 bg-gray-100
                             rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const members = data?.members || []

  const maxValues = {
    tasks:    Math.max(
      ...members.map(m => m.tasksCompleted), 1
    ),
    points:   Math.max(
      ...members.map(m => m.storyPointsCompleted), 1
    ),
    comments: Math.max(
      ...members.map(m => m.commentsCount), 1
    ),
  }

  // Radar data for selected member
  const radarData = selectedMember
    ? [
        {
          subject: 'Completion',
          value:   Math.round(
            selectedMember.completionRate * 100
          )
        },
        {
          subject: 'Tasks',
          value:   Math.round(
            selectedMember.tasksCompleted /
            maxValues.tasks * 100
          )
        },
        {
          subject: 'Points',
          value:   Math.round(
            selectedMember.storyPointsCompleted /
            maxValues.points * 100
          )
        },
        {
          subject: 'Comments',
          value:   Math.round(
            selectedMember.commentsCount /
            maxValues.comments * 100
          )
        },
        {
          subject: 'Activity',
          value:   Math.round(
            (selectedMember.tasksCompleted +
             selectedMember.tasksInProgress) /
            (selectedMember.tasksAssigned || 1) * 100
          )
        },
      ]
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
            Team Performance
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {members.length} team members •{' '}
            Click member for details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3
                       gap-6">

        {/* Member Cards */}
        <div className="lg:col-span-2 space-y-3
                         max-h-96 overflow-y-auto
                         pr-1">
          {members.length === 0 ? (
            <div className="flex items-center
                             justify-center h-40">
              <p className="text-gray-400">
                No team data available
              </p>
            </div>
          ) : (
            members.map((member, index) => (
              <MemberCard
                key={member.userId}
                member={member}
                index={index}
                isSelected={
                  selectedMember?.userId ===
                  member.userId
                }
                onSelect={setSelectedMember}
                maxValues={maxValues}
              />
            ))
          )}
        </div>

        {/* Radar Chart */}
        <div className="flex flex-col">
          {selectedMember ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-3">
                <img
                  src={
                    selectedMember.userAvatar ||
                    '/default-avatar.png'
                  }
                  alt={selectedMember.userName}
                  className="w-12 h-12 rounded-full
                              object-cover mx-auto
                              border-2 border-indigo-200
                              mb-2"
                />
                <p className="font-semibold
                               text-gray-800 text-sm">
                  {selectedMember.userName}
                </p>
              </div>

              <ResponsiveContainer
                width="100%"
                height={220}
              >
                <RadarChart
                  data={radarData}
                  margin={{
                    top:    10, right:  10,
                    bottom: 10, left:  10
                  }}
                >
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fontSize: 10,
                      fill:     '#6b7280'
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name={selectedMember.userName}
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip
                    formatter={
                      (value) => [`${value}%`, '']
                    }
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <div className="flex items-center
                             justify-center
                             h-full min-h-[200px]
                             border-2 border-dashed
                             border-gray-200 rounded-xl">
              <div className="text-center">
                <p className="text-2xl mb-2">👈</p>
                <p className="text-sm text-gray-400">
                  Select a member
                </p>
                <p className="text-sm text-gray-400">
                  to view radar chart
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}