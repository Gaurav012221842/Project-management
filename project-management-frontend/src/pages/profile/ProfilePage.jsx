// src/pages/profile/ProfilePage.jsx
import { useEffect }                from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  UserCircleIcon,
  LockClosedIcon,
  BellIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

// Components
import ProfileHeader      from '../../components/profile/ProfileHeader'
import ProfileOverview    from '../../components/profile/ProfileOverview'
import EditProfileForm    from '../../components/profile/EditProfileForm'
import ChangePasswordForm from '../../components/profile/ChangePasswordForm'
import ActivityFeed       from '../../components/profile/ActivityFeed'
import NotificationPrefs  from '../../components/profile/NotificationPrefs'
import SecuritySettings   from '../../components/profile/SecuritySettings'

// Redux
import {
  fetchProfile,
  fetchUserStats,
  fetchActivityLog,
  setActiveTab,
  selectProfile,
  selectProfileStats,
  selectProfileLoading,
  selectActiveTab,
} from '../../features/profile/profileSlice'

// ============================
// Tab Config
// ============================
const TABS = [
  {
    key:   'overview',
    label: 'Overview',
    icon:  ChartBarIcon,
  },
  {
    key:   'edit',
    label: 'Edit Profile',
    icon:  UserCircleIcon,
  },
  {
    key:   'password',
    label: 'Password',
    icon:  LockClosedIcon,
  },
  {
    key:   'activity',
    label: 'Activity',
    icon:  ClockIcon,
  },
  {
    key:   'notifications',
    label: 'Notifications',
    icon:  BellIcon,
  },
  {
    key:   'security',
    label: 'Security',
    icon:  ShieldCheckIcon,
  },
]

export default function ProfilePage() {
  const dispatch = useDispatch()

  const profile   = useSelector(selectProfile)
  const stats     = useSelector(selectProfileStats)
  const loading   = useSelector(selectProfileLoading)
  const activeTab = useSelector(selectActiveTab)

  // ============================
  // Fetch Data
  // ============================
  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchUserStats())
    dispatch(fetchActivityLog({ page: 0 }))
  }, [dispatch])

  if (loading && !profile) {
    return <ProfileSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================== */}
      {/*     Profile Header       */}
      {/* ======================== */}
      <ProfileHeader profile={profile} stats={stats} />

      {/* ======================== */}
      {/*        Tabs              */}
      {/* ======================== */}
      <div className="bg-white border-b
                       border-gray-100 sticky
                       top-14 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto
                           scrollbar-hide gap-1 py-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() =>
                  dispatch(setActiveTab(tab.key))
                }
                className={`
                  flex items-center gap-2
                  px-4 py-3 rounded-xl
                  text-sm font-medium
                  transition-all duration-200
                  whitespace-nowrap flex-shrink-0
                  ${activeTab === tab.key
                    ? 'bg-indigo-50 text-indigo-700 ' +
                      'font-semibold'
                    : 'text-gray-500 ' +
                      'hover:text-gray-700 ' +
                      'hover:bg-gray-50'
                  }
                `}
              >
                <tab.icon className={`
                  w-4 h-4
                  ${activeTab === tab.key
                    ? 'text-indigo-600'
                    : 'text-gray-400'
                  }
                `} />
                {tab.label}

                {/* Active Indicator */}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0
                                left-0 right-0 h-0.5
                                bg-indigo-600
                                rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================== */}
      {/*       Tab Content        */}
      {/* ======================== */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y:  0  }}
            exit={{ opacity: 0, y: -12    }}
            transition={{ duration: 0.25  }}
          >
            {activeTab === 'overview' && (
              <ProfileOverview
                profile={profile}
                stats={stats}
              />
            )}
            {activeTab === 'edit' && (
              <EditProfileForm profile={profile} />
            )}
            {activeTab === 'password' && (
              <ChangePasswordForm />
            )}
            {activeTab === 'activity' && (
              <ActivityFeed />
            )}
            {activeTab === 'notifications' && (
              <NotificationPrefs />
            )}
            {activeTab === 'security' && (
              <SecuritySettings profile={profile} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================
// Skeleton
// ============================
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-indigo-900
                       to-purple-900 h-48 animate-pulse" />
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-end gap-6 -mt-16 mb-6">
          <div className="w-32 h-32 rounded-3xl
                           bg-gray-300 animate-pulse
                           border-4 border-white" />
          <div className="pb-4 space-y-2 flex-1">
            <div className="w-48 h-7 bg-gray-200
                             rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-100
                             rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}
                 className="h-32 bg-white rounded-2xl
                             animate-pulse border
                             border-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}