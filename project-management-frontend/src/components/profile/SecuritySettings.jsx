// src/components/profile/SecuritySettings.jsx
import { useState }  from 'react'
import { motion }    from 'framer-motion'
import { format }    from 'date-fns'
import {
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  TrashIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import ConfirmDialog
  from '../common/ConfirmDialog/ConfirmDialog'
import toast from 'react-hot-toast'

// Mock active sessions
const MOCK_SESSIONS = [
  {
    id:        1,
    device:    'Chrome on macOS',
    location:  'Mumbai, India',
    ip:        '192.168.1.1',
    lastSeen:  new Date(),
    isCurrent: true,
  },
  {
    id:        2,
    device:    'Firefox on Windows',
    location:  'Delhi, India',
    ip:        '10.0.0.1',
    lastSeen:  new Date(Date.now() - 86400000),
    isCurrent: false,
  },
]

export default function SecuritySettings({ profile }) {
  const [sessions,    setSessions]    =
    useState(MOCK_SESSIONS)
  const [twoFactor,   setTwoFactor]   = useState(false)
  const [showRevoke,  setShowRevoke]  = useState(false)
  const [revokeId,    setRevokeId]    = useState(null)
  const [showDelete,  setShowDelete]  = useState(false)

  const handleRevokeSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id))
    setShowRevoke(false)
    toast.success('Session revoked!')
  }

  const handleRevokeAll = () => {
    setSessions(sessions.filter(s => s.isCurrent))
    toast.success('All other sessions revoked!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y:  0 }}
      className="space-y-6"
    >

      {/* ======================== */}
      {/*    Security Overview     */}
      {/* ======================== */}
      <div className="bg-white rounded-2xl border
                       border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 bg-green-100
                           rounded-xl flex items-center
                           justify-center">
            <ShieldCheckIcon
              className="w-6 h-6 text-green-600"
            />
          </div>
          <div>
            <h2 className="text-base font-bold
                            text-gray-900">
              Security Overview
            </h2>
            <p className="text-sm text-green-600
                           font-medium">
              ✅ Account is secure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1
                         md:grid-cols-3 gap-4">
          {[
            {
              icon:   CheckBadgeIcon,
              label:  'Email Verified',
              value:  'Verified',
              color:  'text-green-600 bg-green-50',
              iconBg: 'bg-green-500',
            },
            {
              icon:   KeyIcon,
              label:  'Password Strength',
              value:  'Strong',
              color:  'text-blue-600 bg-blue-50',
              iconBg: 'bg-blue-500',
            },
            {
              icon:   DevicePhoneMobileIcon,
              label:  '2-Factor Auth',
              value:  twoFactor ? 'Enabled' : 'Disabled',
              color:  twoFactor
                ? 'text-green-600 bg-green-50'
                : 'text-orange-600 bg-orange-50',
              iconBg: twoFactor
                ? 'bg-green-500' : 'bg-orange-500',
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{
                duration: 0.3,
                delay:    i * 0.08,
              }}
              className={`p-4 rounded-2xl border-2
                            border-white ${item.color}`}
            >
              <div className={`w-9 h-9 ${item.iconBg}
                                rounded-xl flex
                                items-center
                                justify-center mb-3`}>
                <item.icon
                  className="w-5 h-5 text-white"
                />
              </div>
              <p className="font-bold text-sm">
                {item.value}
              </p>
              <p className="text-xs opacity-70 mt-0.5">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ======================== */}
      {/*    Two-Factor Auth       */}
      {/* ======================== */}
      <div className="bg-white rounded-2xl border
                       border-gray-100 shadow-sm
                       overflow-hidden">
        <div className="px-6 py-5 border-b
                         border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-bold
                          text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Add extra security to your account
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-start
                           justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100
                               rounded-xl flex items-center
                               justify-center flex-shrink-0">
                <DevicePhoneMobileIcon
                  className="w-6 h-6 text-indigo-600"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900
                               text-sm">
                  Authenticator App
                </p>
                <p className="text-xs text-gray-400
                               mt-1 max-w-md">
                  Use an authenticator app like
                  Google Authenticator or Authy
                  to generate time-based codes
                </p>
                {twoFactor && (
                  <span className="inline-flex items-center
                                    gap-1 mt-2 px-2 py-1
                                    bg-green-100 text-green-700
                                    text-xs font-semibold
                                    rounded-full">
                    <CheckBadgeIcon className="w-3.5 h-3.5" />
                    Enabled
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setTwoFactor(!twoFactor)
                toast.success(
                  twoFactor
                    ? '2FA disabled'
                    : '2FA enabled! 🔐'
                )
              }}
              className={`
                px-4 py-2 rounded-xl text-sm
                font-semibold transition-all
                flex-shrink-0
                ${twoFactor
                  ? 'bg-red-50 text-red-600 ' +
                    'hover:bg-red-100'
                  : 'bg-indigo-600 text-white ' +
                    'hover:bg-indigo-700 shadow-lg ' +
                    'shadow-indigo-200'
                }
              `}
            >
              {twoFactor ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* ======================== */}
      {/*     Active Sessions      */}
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
              Active Sessions
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Devices currently logged in
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAll}
              className="text-xs text-red-500
                          hover:text-red-700
                          font-medium px-3 py-1.5
                          rounded-lg hover:bg-red-50
                          transition-colors"
            >
              Revoke All Others
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x:  0  }}
              transition={{
                duration: 0.3,
                delay:    index * 0.08,
              }}
              className="flex items-center gap-4
                           px-6 py-4"
            >
              {/* Device Icon */}
              <div className={`w-11 h-11 rounded-xl
                                flex items-center
                                justify-center
                                flex-shrink-0
                                ${session.isCurrent
                                  ? 'bg-indigo-100'
                                  : 'bg-gray-100'
                                }`}>
                <ComputerDesktopIcon
                  className={`w-5 h-5
                               ${session.isCurrent
                                 ? 'text-indigo-600'
                                 : 'text-gray-400'
                               }`}
                />
              </div>

              {/* Session Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold
                                 text-gray-900 truncate">
                    {session.device}
                  </p>
                  {session.isCurrent && (
                    <span className="px-2 py-0.5
                                      bg-green-100
                                      text-green-700
                                      text-[10px]
                                      font-bold
                                      rounded-full
                                      flex-shrink-0">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-center
                                 gap-3 mt-0.5">
                  <div className="flex items-center
                                   gap-1 text-xs
                                   text-gray-400">
                    <GlobeAltIcon className="w-3 h-3" />
                    {session.location}
                  </div>
                  <span className="text-xs text-gray-300">
                    •
                  </span>
                  <span className="text-xs text-gray-400">
                    {session.isCurrent
                      ? 'Active now'
                      : `Last seen ${format(
                          session.lastSeen,
                          'MMM dd, HH:mm'
                        )}`
                    }
                  </span>
                </div>
              </div>

              {/* Revoke */}
              {!session.isCurrent && (
                <button
                  onClick={() => {
                    setRevokeId(session.id)
                    setShowRevoke(true)
                  }}
                  className="p-2 text-gray-400
                              hover:text-red-500
                              hover:bg-red-50
                              rounded-lg
                              transition-colors"
                  title="Revoke session"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ======================== */}
      {/*    Danger Zone           */}
      {/* ======================== */}
      <div className="bg-white rounded-2xl border-2
                       border-red-100 shadow-sm
                       overflow-hidden">
        <div className="px-6 py-5 border-b
                         border-red-100 bg-red-50/50">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon
              className="w-5 h-5 text-red-500"
            />
            <h2 className="text-base font-bold
                            text-red-700">
              Danger Zone
            </h2>
          </div>
          <p className="text-sm text-red-400 mt-0.5">
            Irreversible and destructive actions
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-start
                           justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900
                             text-sm">
                Delete Account
              </p>
              <p className="text-xs text-gray-400 mt-1
                             max-w-md">
                Once deleted, all your data including
                projects, tasks, and settings will be
                permanently removed. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-2
                          px-4 py-2 bg-red-50 text-red-600
                          border border-red-200 rounded-xl
                          text-sm font-semibold
                          hover:bg-red-100
                          transition-colors flex-shrink-0"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Revoke Session Dialog */}
      {showRevoke && (
        <ConfirmDialog
          title="Revoke Session"
          message="This device will be logged out immediately."
          onConfirm={() => handleRevokeSession(revokeId)}
          onCancel={() => setShowRevoke(false)}
          confirmLabel="Revoke Session"
          isDanger
        />
      )}

      {/* Delete Account Dialog */}
      {showDelete && (
        <ConfirmDialog
          title="Delete Account"
          message="Are you absolutely sure? This will permanently delete your account and all associated data."
          onConfirm={() => {
            setShowDelete(false)
            toast.error('Account deletion requested')
          }}
          onCancel={() => setShowDelete(false)}
          confirmLabel="Delete My Account"
          isDanger
        />
      )}
    </motion.div>
  )
}