// src/components/analytics/AnalyticsDashboard.jsx
import { useEffect, useState }      from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams }                from 'react-router-dom'
import { motion }                   from 'framer-motion'
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  BoltIcon,
  FireIcon,
  ChartBarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

// Components
import StatCard             from './StatCard'
import TaskStatusChart      from './TaskStatusChart'
import TaskPriorityChart    from './TaskPriorityChart'
import WeeklyProgressChart  from './WeeklyProgressChart'
import BurndownChart        from './BurndownChart'
import VelocityChart        from './VelocityChart'
import TeamPerformanceChart from './TeamPerformanceChart'
import ProgressCard         from './ProgressCard'

// Redux
import {
  fetchProjectOverview,
  fetchBurndown,
  fetchVelocity,
  fetchTeamPerformance,
  fetchWeeklyProgress,
  fetchTaskDistribution,
  selectOverview,
  selectBurndown,
  selectVelocity,
  selectTeamPerformance,
  selectWeeklyProgress,
  selectTaskDistribution,
  selectAnalyticsLoading,
} from '../../features/analytics/analyticsSlice'

import {
  selectSprints
} from '../../features/sprint/sprintSlice'

export default function AnalyticsDashboard() {
  const dispatch      = useDispatch()
  const { projectId } = useParams()

  const [selectedSprintId, setSelectedSprintId] =
    useState(null)
  const [lastRefreshed, setLastRefreshed] =
    useState(new Date())

  // ============================
  // Selectors
  // ============================
  const overview         = useSelector(selectOverview)
  const burndown         = useSelector(selectBurndown)
  const velocity         = useSelector(selectVelocity)
  const teamPerformance  = useSelector(selectTeamPerformance)
  const weeklyProgress   = useSelector(selectWeeklyProgress)
  const taskDistribution = useSelector(selectTaskDistribution)
  const loading          = useSelector(selectAnalyticsLoading)
  const sprints          = useSelector(selectSprints)

  const activeSprint = sprints?.find(
    s => s.status === 'ACTIVE'
  )

  // ============================
  // Fetch All Data
  // ============================
  const fetchAll = () => {
    const id = projectId

    dispatch(fetchProjectOverview(id))
    dispatch(fetchVelocity(id))
    dispatch(fetchTeamPerformance(id))
    dispatch(fetchWeeklyProgress({
      projectId: id,
      weeks:     8
    }))
    dispatch(fetchTaskDistribution(id))

    const sprintId =
      selectedSprintId || activeSprint?.id

    if (sprintId) {
      dispatch(fetchBurndown({
        projectId: id,
        sprintId
      }))
    }

    setLastRefreshed(new Date())
  }

  useEffect(() => {
    fetchAll()
  }, [projectId, selectedSprintId])

  // ============================
  // Stat Cards Config
  // ============================
  const statCards = [
    {
      title:    'Total Tasks',
      value:    overview?.totalTasks ?? '—',
      subtitle: `${overview?.completionPercentage ?? 0}% complete`,
      icon:     ClipboardDocumentListIcon,
      color:    'indigo',
      index:    0,
    },
    {
      title:    'Completed',
      value:    overview?.completedTasks ?? '—',
      subtitle: 'Tasks finished',
      icon:     CheckCircleIcon,
      color:    'green',
      trend:    5,
      index:    1,
    },
    {
      title:    'In Progress',
      value:    overview?.inProgressTasks ?? '—',
      subtitle: 'Currently active',
      icon:     ClockIcon,
      color:    'blue',
      index:    2,
    },
    {
      title:    'Team Members',
      value:    overview?.totalMembers ?? '—',
      subtitle: 'Contributors',
      icon:     UsersIcon,
      color:    'purple',
      index:    3,
    },
    {
      title:    'Story Points',
      value:    overview?.completedStoryPoints ?? '—',
      subtitle: `of ${overview?.totalStoryPoints ?? 0} total`,
      icon:     BoltIcon,
      color:    'orange',
      index:    4,
    },
    {
      title:    'Overdue Tasks',
      value:    overview?.overdueTasks ?? '—',
      subtitle: 'Need attention',
      icon:     FireIcon,
      color:    overview?.overdueTasks > 0
                  ? 'red'
                  : 'green',
      index:    5,
    },
    {
      title:    'Active Sprints',
      value:    overview?.activeSprints ?? '—',
      subtitle: `${overview?.completedSprints ?? 0} completed`,
      icon:     ChartBarIcon,
      color:    'indigo',
      index:    6,
    },
    {
      title:    'Completion Rate',
      value:    `${overview?.completionPercentage ?? 0}%`,
      subtitle: 'Overall progress',
      icon:     CheckCircleIcon,
      color:    overview?.completionPercentage >= 70
                  ? 'green'
                  : overview?.completionPercentage >= 40
                    ? 'orange'
                    : 'red',
      index:    7,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ======================== */}
      {/*         Header           */}
      {/* ======================== */}
      <div className="flex items-center
                       justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold
                          text-gray-900">
            📊 Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated:{' '}
            {lastRefreshed.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-3">

          {/* Sprint Selector */}
          {sprints?.length > 0 && (
            <select
              value={selectedSprintId || ''}
              onChange={(e) =>
                setSelectedSprintId(
                  e.target.value
                    ? Number(e.target.value)
                    : null
                )
              }
              className="text-sm border border-gray-200
                          rounded-lg px-3 py-2
                          bg-white text-gray-700
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500"
            >
              <option value="">
                {activeSprint
                  ? activeSprint.name + ' (Active)'
                  : 'Select Sprint'}
              </option>
              {sprints.map(sprint => (
                <option
                  key={sprint.id}
                  value={sprint.id}
                >
                  {sprint.name}
                </option>
              ))}
            </select>
          )}

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAll}
            className="flex items-center gap-2
                        px-4 py-2 bg-indigo-600
                        text-white rounded-lg
                        text-sm font-medium
                        hover:bg-indigo-700
                        transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* ======================== */}
      {/*       Stat Cards         */}
      {/* ======================== */}
      <div className="grid grid-cols-2
                       md:grid-cols-4
                       gap-4 mb-8">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            loading={loading.overview}
            index={card.index}
          />
        ))}
      </div>

      {/* ======================== */}
      {/*    Progress Cards Row    */}
      {/* ======================== */}
      <div className="grid grid-cols-1
                       md:grid-cols-3
                       gap-4 mb-8">
        <ProgressCard
          title="Task Completion"
          current={overview?.completedTasks || 0}
          total={overview?.totalTasks || 0}
          color="indigo"
          loading={loading.overview}
        />
        <ProgressCard
          title="Story Points Progress"
          current={overview?.completedStoryPoints || 0}
          total={overview?.totalStoryPoints || 0}
          color="green"
          loading={loading.overview}
        />
        <ProgressCard
          title="Sprint Progress"
          current={overview?.completedSprints || 0}
          total={overview?.totalSprints || 0}
          color="orange"
          loading={loading.overview}
        />
      </div>

      {/* ======================== */}
      {/*   Charts Row 1           */}
      {/* ======================== */}
      <div className="grid grid-cols-1
                       lg:grid-cols-2
                       gap-6 mb-6">
        <TaskStatusChart
          data={taskDistribution}
          loading={loading.taskDistribution}
        />
        <TaskPriorityChart
          data={taskDistribution}
          loading={loading.taskDistribution}
        />
      </div>

      {/* ======================== */}
      {/*   Weekly Progress        */}
      {/* ======================== */}
      <div className="mb-6">
        <WeeklyProgressChart
          data={weeklyProgress}
          loading={loading.weeklyProgress}
        />
      </div>

      {/* ======================== */}
      {/*   Charts Row 2           */}
      {/* ======================== */}
      <div className="grid grid-cols-1
                       lg:grid-cols-2
                       gap-6 mb-6">
        <BurndownChart
          data={burndown}
          loading={loading.burndown}
        />
        <VelocityChart
          data={velocity}
          loading={loading.velocity}
        />
      </div>

      {/* ======================== */}
      {/*   Team Performance       */}
      {/* ======================== */}
      <div className="mb-6">
        <TeamPerformanceChart
          data={teamPerformance}
          loading={loading.teamPerformance}
        />
      </div>

      {/* ======================== */}
      {/*   Task Type Summary      */}
      {/* ======================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-2xl p-6
                    border border-gray-100
                    shadow-sm mb-6"
      >
        <h3 className="text-lg font-bold
                        text-gray-900 mb-6">
          Task Type Breakdown
        </h3>

        <div className="grid grid-cols-2
                         md:grid-cols-4 gap-4">
          {taskDistribution?.byType?.map(
            (item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay:    index * 0.1
                }}
                className="text-center p-4
                            rounded-xl border
                            border-gray-100
                            hover:shadow-sm
                            transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-full
                               mx-auto mb-3 flex
                               items-center
                               justify-center
                               text-white text-xl
                               font-bold"
                  style={{
                    backgroundColor: item.color
                  }}
                >
                  {item.type === 'FEATURE'  && '✨'}
                  {item.type === 'BUG'      && '🐛'}
                  {item.type === 'IMPROVEMENT' && '⚡'}
                  {item.type === 'TASK'     && '📋'}
                </div>
                <p className="text-2xl font-bold
                               text-gray-900">
                  {item.count}
                </p>
                <p className="text-sm text-gray-500
                               mt-1 capitalize">
                  {item.type.toLowerCase()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.percentage}%
                </p>

                {/* Mini Bar */}
                <div className="mt-3 w-full
                                 bg-gray-100
                                 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${item.percentage}%`
                    }}
                    transition={{
                      duration: 1,
                      delay:    0.5 + index * 0.1
                    }}
                    className="h-1 rounded-full"
                    style={{
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* ======================== */}
      {/*   Summary Table          */}
      {/* ======================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-2xl
                    border border-gray-100
                    shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold
                          text-gray-900">
            Project Summary
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Complete overview of project metrics
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs
                                font-semibold
                                text-gray-500
                                uppercase tracking-wider
                                px-6 py-3">
                  Metric
                </th>
                <th className="text-left text-xs
                                font-semibold
                                text-gray-500
                                uppercase tracking-wider
                                px-6 py-3">
                  Value
                </th>
                <th className="text-left text-xs
                                font-semibold
                                text-gray-500
                                uppercase tracking-wider
                                px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs
                                font-semibold
                                text-gray-500
                                uppercase tracking-wider
                                px-6 py-3">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                {
                  metric:   'Task Completion',
                  value:    `${overview?.completedTasks ?? 0} / ${overview?.totalTasks ?? 0}`,
                  status:   overview?.completionPercentage >= 70
                              ? 'On Track'
                              : 'In Progress',
                  statusColor: overview?.completionPercentage >= 70
                              ? 'text-green-600 bg-green-100'
                              : 'text-blue-600 bg-blue-100',
                  pct:      overview?.completionPercentage ?? 0,
                  color:    '#6366f1',
                },
                {
                  metric:   'Story Points',
                  value:    `${overview?.completedStoryPoints ?? 0} / ${overview?.totalStoryPoints ?? 0}`,
                  status:   'Active',
                  statusColor: 'text-blue-600 bg-blue-100',
                  pct:      overview?.totalStoryPoints > 0
                              ? Math.round(
                                  overview.completedStoryPoints /
                                  overview.totalStoryPoints * 100
                                )
                              : 0,
                  color:    '#22c55e',
                },
                {
                  metric:   'Overdue Tasks',
                  value:    overview?.overdueTasks ?? 0,
                  status:   overview?.overdueTasks > 0
                              ? 'Attention'
                              : 'All Good',
                  statusColor: overview?.overdueTasks > 0
                              ? 'text-red-600 bg-red-100'
                              : 'text-green-600 bg-green-100',
                  pct:      overview?.totalTasks > 0
                              ? Math.round(
                                  (overview?.overdueTasks ?? 0) /
                                  overview.totalTasks * 100
                                )
                              : 0,
                  color:    '#ef4444',
                },
                {
                  metric:   'Team Velocity',
                  value:    `${velocity?.averageVelocity ?? 0} pts/sprint`,
                  status:   'Tracking',
                  statusColor: 'text-purple-600 bg-purple-100',
                  pct:      Math.min(
                              100,
                              velocity?.averageVelocity
                                ? Math.round(
                                    velocity.averageVelocity / 50 * 100
                                  )
                                : 0
                            ),
                  color:    '#f59e0b',
                },
              ].map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50
                              transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm
                                      font-medium
                                      text-gray-900">
                      {row.metric}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm
                                      font-bold
                                      text-gray-700">
                      {row.value}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1
                                       rounded-full
                                       text-xs
                                       font-semibold
                                       ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center
                                     gap-3">
                      <div className="flex-1 bg-gray-100
                                       rounded-full h-2
                                       min-w-[120px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${row.pct}%`
                          }}
                          transition={{
                            duration: 1,
                            delay:    index * 0.1
                          }}
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: row.color
                          }}
                        />
                      </div>
                      <span className="text-xs
                                        font-medium
                                        text-gray-500
                                        w-10">
                        {row.pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  )
}
