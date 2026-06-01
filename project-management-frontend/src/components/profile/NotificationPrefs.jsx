// src/components/profile/NotificationPrefs.jsx
import { useState }  from 'react'
import { motion }    from 'framer-motion'
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const NOTIFICATION_GROUPS = [
  {
    title:    'Tasks',
    icon:     '📋',
    settings: [
      {
        key:     'taskAssigned',
        label:   'Task Assigned',
        desc:    'When a task is assigned to you',
        default: true,
      },
      {
        key:     'taskUpdated',
        label:   'Task Updated',
        desc:    'When your assigned task is updated',
        default: true,
      },
      {
        key:     'taskDeadline',
        label:   'Deadline Reminders',
        desc:    '24h before task is due',
        default: true,
      },
    ],
  },
  {
    title:    'Comments',
    icon:     '💬',
    settings: [
      {
        key:     'commentAdded',
        label:   'New Comment',
        desc:    'When someone comments on your task',
        default: true,
      },
      {
        key:     'mentioned',
        label:   'Mentions',
        desc:    'When someone @mentions you',
        default: true,
      },
    ],
  },
  {
    title:    'Sprints',
    icon:     '🚀',
    settings: [
      {
        key:     'sprintStarted',
        label:   'Sprint Started',
        desc:    'When a sprint begins',
        default: true,
      },
      {
        key:     'sprintCompleted',
        label:   'Sprint Completed',
        desc:    'When a sprint is completed',
        default: false,
      },
    ],
  },
  {
    title:    'Team',
    icon:     '👥',
    settings: [
      {
        key:     'memberAdded',
        label:   'Member Added',
        desc:    'When a new member joins your project',
        default: false,
      },
      {
        key:     'projectUpdated',
        label:   'Project Updates',
        desc:    'When project details are changed',
        default: false,
      },
    ],
  },
]

const CHANNELS = [
  {
    key:   'inApp',
    icon:  BellIcon,
    label: 'In-App',
    desc:  'Bell icon notifications',
  },
  {
    key:   'email',
    icon:  EnvelopeIcon,
    label: 'Email',
    desc:  'Email to your inbox',
  },
  {
    key:   'push',
    icon:  DevicePhoneMobileIcon,
    label: 'Push',
    desc:  'Browser push notifications',
  },
]

// Toggle Component
function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative inline-flex h-6 w-11 items-center
        rounded-full transition-colors duration-300
        focus:outline-none flex-shrink-0
        ${enabled
          ? 'bg-indigo-600'
          : 'bg-gray-200'
        }
      `}
    >
      <motion.span
        animate={{ x: enabled ? 20 : 2 }}
        transition={{
          type:      'spring',
          stiffness: 400,
          damping:   25,
        }}
        className="inline-block w-5 h-5 bg-white
                    rounded-full shadow-sm"
      />
    </button>
  )
}

export default function NotificationPrefs() {
  // Initialize state from defaults
  const initPrefs = () => {
    const prefs = {}
    NOTIFICATION_GROUPS.forEach(group => {
      group.settings.forEach(setting => {
        prefs[setting.key] = setting.default
      })
    })
    return prefs
  }

  const initChannels = () => ({
    inApp: true,
    email: true,
    push:  false,
  })

  const [prefs,    setPrefs]    = useState(initPrefs)
  const [channels, setChannels] = useState(initChannels)
  const [saving,   setSaving]   = useState(false)

  const togglePref = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleChannel = (key) => {
    setChannels(prev => ({
      ...prev, [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success('Notification preferences saved! 🔔')
  }

  const enableAll = () => {
    const all = {}
    NOTIFICATION_GROUPS.forEach(group => {
      group.settings.forEach(s => {
        all[s.key] = true
      })
    })
    setPrefs(all)
  }

  const disableAll = () => {
    const none = {}
    NOTIFICATION_GROUPS.forEach(group => {
      group.settings.forEach(s => {
        none[s.key] = false
      })
    })
    setPrefs(none)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y:  0 }}
      className="space-y-6"
    >

      {/* ======================== */}
      {/*    Delivery Channels     */}
      {/* ======================== */}
      <div className="bg-white rounded-2xl border
                       border-gray-100 shadow-sm
                       overflow-hidden">
        <div className="px-6 py-5 border-b
                         border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-bold
                          text-gray-900">
            Notification Channels
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Choose how to receive notifications
          </p>
        </div>

        <div className="p-6 grid grid-cols-1
                         md:grid-cols-3 gap-4">
          {CHANNELS.map((channel, index) => (
            <motion.div
              key={channel.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{
                duration: 0.3,
                delay:    index * 0.08,
              }}
              className={`
                p-4 rounded-2xl border-2 cursor-pointer
                transition-all duration-200
                ${channels[channel.key]
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-gray-200 bg-white ' +
                    'hover:border-indigo-200'
                }
              `}
              onClick={() => toggleChannel(channel.key)}
            >
              <div className="flex items-center
                               justify-between mb-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center
                  justify-center
                  ${channels[channel.key]
                    ? 'bg-indigo-600'
                    : 'bg-gray-100'
                  }
                `}>
                  <channel.icon className={`
                    w-5 h-5
                    ${channels[channel.key]
                      ? 'text-white'
                      : 'text-gray-400'
                    }
                  `} />
                </div>
                <Toggle
                  enabled={channels[channel.key]}
                  onToggle={() =>
                    toggleChannel(channel.key)
                  }
                />
              </div>
              <p className={`font-semibold text-sm
                              ${channels[channel.key]
                                ? 'text-indigo-900'
                                : 'text-gray-700'
                              }`}>
                {channel.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {channel.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ======================== */}
      {/*   Notification Types     */}
      {/* ======================== */}
      <div className="bg-white rounded-2xl border
                       border-gray-100 shadow-sm
                       overflow-hidden">
        <div className="flex items-center
                         justify-between px-6 py-5
                         border-b border-gray-100
                         bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold
                            text-gray-900">
              Notification Types
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Choose what triggers notifications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={disableAll}
              className="text-xs text-gray-500
                          hover:text-gray-700
                          font-medium px-3 py-1.5
                          rounded-lg hover:bg-gray-100
                          transition-colors"
            >
              Disable All
            </button>
            <button
              onClick={enableAll}
              className="text-xs text-indigo-600
                          hover:text-indigo-700
                          font-medium px-3 py-1.5
                          rounded-lg bg-indigo-50
                          hover:bg-indigo-100
                          transition-colors"
            >
              Enable All
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {NOTIFICATION_GROUPS.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{
                duration: 0.3,
                delay:    gi * 0.07,
              }}
            >
              <div className="flex items-center
                               gap-2 mb-3">
                <span className="text-lg">
                  {group.icon}
                </span>
                <h3 className="text-sm font-bold
                                text-gray-800">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-3">
                {group.settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center
                                justify-between py-2.5
                                px-4 rounded-xl
                                hover:bg-gray-50
                                transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium
                                     text-gray-800">
                        {setting.label}
                      </p>
                      <p className="text-xs text-gray-400
                                     mt-0.5">
                        {setting.desc}
                      </p>
                    </div>
                    <Toggle
                      enabled={prefs[setting.key]}
                      onToggle={() =>
                        togglePref(setting.key)
                      }
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 border-t
                         border-gray-100 bg-gray-50/50
                         flex justify-end">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99   }}
            onClick={handleSave}
            disabled={saving}
            className={`
              flex items-center gap-2
              px-6 py-2.5 rounded-xl font-semibold
              text-sm text-white transition-all
              ${saving
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 ' +
                  'shadow-lg shadow-indigo-200'
              }
            `}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2
                                 border-white
                                 border-t-transparent
                                 rounded-full
                                 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}