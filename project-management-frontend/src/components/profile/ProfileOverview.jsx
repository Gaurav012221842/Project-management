// src/components/profile/ProfileOverview.jsx
import { motion }    from 'framer-motion'
import { format }    from 'date-fns'
import {
  CheckCircleIcon,
  ClockIcon,
  BoltIcon,
  FolderIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
} from '@heroicons/react/24/outline'

export default function ProfileOverview({
  profile,
  stats,
}) {
  const statCards = [
    {
      label:  'Total Projects',
      value:  stats?.totalProjects || 0,
      icon:   FolderIcon,
      bg:     'bg-indigo-50',
      iconBg: 'bg-indigo-500',
      text:   'text-indigo-600',
    },
    {
      label:  'Tasks Completed',
      value:  stats?.completedTasks || 0,
      icon:   CheckCircleIcon,
      bg:     'bg-green-50',
      iconBg: 'bg-green-500',
      text:   'text-green-600',
    },
    {
      label:  'In Progress',
      value:  stats?.inProgressTasks || 0,
      icon:   ClockIcon,
      bg:     'bg-blue-50',
      iconBg: 'bg-blue-500',
      text:   'text-blue-600',
    },
    {
      label:  'Story Points',
      value:  stats?.totalStoryPoints || 0,
      icon:   BoltIcon,
      bg:     'bg-yellow-50',
      iconBg: 'bg-yellow-500',
      text:   'text-yellow-600',
    },
    {
      label:  'Comments Made',
      value:  stats?.totalComments || 0,
      icon:   ChatBubbleLeftIcon,
      bg:     'bg-purple-50',
      iconBg: 'bg-purple-500',
      text:   'text-purple-600',
    },
    {
      label:  'Completion Rate',
      value:  `${stats?.completionRate || 0}%`,
      icon:   StarIcon,
      bg:     'bg-orange-50',
      iconBg: 'bg-orange-500',
      text:   'text-orange-600',
    },
  ]

  const achievements = [
    {
      icon:    '🚀',
      title:   'First Sprint',
      desc:    'Completed your first sprint',
      earned:  (stats?.completedSprints || 0) >= 1,
    },
    {
      icon:    '🔥',
      title:   'Task Master',
      desc:    'Completed 50+ tasks',
      earned:  (stats?.completedTasks || 0) >= 50,
    },
    {
      icon:    '⚡',
      title:   'Point Collector',
      desc:    'Earned 100+ story points',
      earned:  (stats?.totalStoryPoints || 0) >= 100,
    },
    {
      icon:    '🏆',
      title:   'Team Player',
      desc:    'Joined 5+ projects',
      earned:  (stats?.totalProjects || 0) >= 5,
    },
    {
      icon:    '💬',
      title:   'Communicator',
      desc:    'Made 20+ comments',
      earned:  (stats?.totalComments || 0) >= 20,
    },
    {
      icon:    '🎯',
      title:   'Sharp Shooter',
      desc:    '80%+ completion rate',
      earned:  (stats?.completionRate || 0) >= 80,
    },
  ]

  return (
    <div className="space-y-8">

      {/* ======================== */}
      {/*       Stat Cards         */}
      {/* ======================== */}
      <div className="grid grid-cols-2
                       md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y:  0 }}
            transition={{
              duration: 0.4,
              delay:    index * 0.07,
            }}
            className={`${stat.bg} rounded-2xl p-5
                          border border-white shadow-sm
                          hover:shadow-md
                          transition-shadow`}
          >
            <div className="flex items-center
                             justify-between mb-3">
              <div className={`w-10 h-10 ${stat.iconBg}
                                rounded-xl flex
                                items-center
                                justify-center`}>
                <stat.icon
                  className="w-5 h-5 text-white"
                />
              </div>
              <span className={`text-3xl font-black
                                 ${stat.text}`}>
                {stat.value}
              </span>
            </div>
            <p className={`text-sm font-semibold
                            ${stat.text}`}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ======================== */}
      {/*    Two Column Layout     */}
      {/* ======================== */}
      <div className="grid grid-cols-1
                       lg:grid-cols-2 gap-6">

        {/* About Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x:  0  }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6
                      border border-gray-100 shadow-sm"
        >
          <h3 className="text-base font-bold
                          text-gray-900 mb-4">
            About
          </h3>
          <div className="space-y-3">
            {[
              {
                label: 'Full Name',
                value: profile?.name,
              },
              {
                label: 'Email',
                value: profile?.email,
              },
              {
                label: 'Role',
                value: profile?.role,
              },
              {
                label: 'Member Since',
                value: profile?.createdAt
                  ? format(
                      new Date(profile.createdAt),
                      'MMMM dd, yyyy'
                    )
                  : '—',
              },
              {
                label: 'Location',
                value: profile?.location || '—',
              },
              {
                label: 'Bio',
                value: profile?.bio || '—',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start
                             justify-between gap-4
                             py-2 border-b
                             border-gray-50
                             last:border-0"
              >
                <span className="text-xs font-medium
                                  text-gray-400
                                  flex-shrink-0 w-28">
                  {item.label}
                </span>
                <span className="text-sm text-gray-700
                                  font-medium text-right
                                  break-all">
                  {item.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x:  0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6
                      border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrophyIcon
              className="w-5 h-5 text-yellow-500"
            />
            <h3 className="text-base font-bold
                            text-gray-900">
              Achievements
            </h3>
            <span className="ml-auto text-xs
                              font-medium text-gray-400
                              bg-gray-100 px-2 py-0.5
                              rounded-full">
              {achievements.filter(a => a.earned).length}
              /{achievements.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1   }}
                transition={{
                  duration: 0.3,
                  delay:    0.4 + index * 0.07,
                }}
                className={`
                  p-3 rounded-xl border-2
                  transition-all duration-200
                  ${badge.earned
                    ? 'border-yellow-200 ' +
                      'bg-yellow-50'
                    : 'border-gray-100 bg-gray-50 ' +
                      'opacity-50'
                  }
                `}
              >
                <div className="text-2xl mb-1.5
                                 leading-none">
                  {badge.icon}
                </div>
                <p className={`text-xs font-bold
                                leading-tight mb-0.5
                                ${badge.earned
                                  ? 'text-gray-900'
                                  : 'text-gray-400'
                                }`}>
                  {badge.title}
                </p>
                <p className="text-[10px] text-gray-400
                               leading-tight">
                  {badge.desc}
                </p>
                {badge.earned && (
                  <div className="mt-1.5 flex
                                   items-center gap-1">
                    <CheckCircleIcon
                      className="w-3 h-3 text-yellow-500"
                    />
                    <span className="text-[10px]
                                      text-yellow-600
                                      font-medium">
                      Earned
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ======================== */}
      {/*    Contribution Graph    */}
      {/* ======================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-2xl p-6
                    border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <FireIcon className="w-5 h-5 text-orange-500" />
          <h3 className="text-base font-bold
                          text-gray-900">
            Task Completion Rate
          </h3>
        </div>

        {/* Progress Bars */}
        {[
          {
            label: 'Features',
            value: stats?.featureTasks || 0,
            total: stats?.totalTasks   || 1,
            color: 'bg-indigo-500',
          },
          {
            label: 'Bugs Fixed',
            value: stats?.bugTasks     || 0,
            total: stats?.totalTasks   || 1,
            color: 'bg-red-500',
          },
          {
            label: 'Improvements',
            value: stats?.improvementTasks || 0,
            total: stats?.totalTasks       || 1,
            color: 'bg-green-500',
          },
          {
            label: 'Tasks',
            value: stats?.taskCount   || 0,
            total: stats?.totalTasks  || 1,
            color: 'bg-blue-500',
          },
        ].map((item, index) => {
          const pct = item.total === 0
            ? 0
            : Math.round(item.value / item.total * 100)
          return (
            <div key={item.label} className="mb-4">
              <div className="flex justify-between
                               text-xs mb-1.5">
                <span className="font-medium
                                  text-gray-700">
                  {item.label}
                </span>
                <span className="text-gray-400">
                  {item.value} ({pct}%)
                </span>
              </div>
              <div className="w-full bg-gray-100
                               rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 1,
                    delay:    0.5 + index * 0.1,
                  }}
                  className={`h-2.5 rounded-full
                                ${item.color}`}
                />
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}