// src/components/profile/ProfileHeader.jsx
import { useRef, useState }         from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion }                   from 'framer-motion'
import {
  CameraIcon,
  MapPinIcon,
  LinkIcon,
  CalendarIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import {
  uploadAvatar,
  selectAvatarLoading,
} from '../../features/profile/profileSlice'
import {
  updateUser,
} from '../../features/auth/authSlice'
import { format } from 'date-fns'

const ROLE_CONFIG = {
  ADMIN:     {
    label: 'Admin',
    color: 'bg-red-100    text-red-700',
  },
  MANAGER:   {
    label: 'Manager',
    color: 'bg-purple-100 text-purple-700',
  },
  DEVELOPER: {
    label: 'Developer',
    color: 'bg-blue-100   text-blue-700',
  },
  TESTER:    {
    label: 'Tester',
    color: 'bg-green-100  text-green-700',
  },
}

export default function ProfileHeader({
  profile,
  stats,
}) {
  const dispatch      = useDispatch()
  const avatarLoading = useSelector(selectAvatarLoading)
  const fileInputRef  = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const roleConfig = profile?.role
    ? ROLE_CONFIG[profile.role]
    : ROLE_CONFIG.DEVELOPER

  // ============================
  // Avatar Upload
  // ============================
  const handleAvatarChange = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    dispatch(uploadAvatar(formData)).then(
      (result) => {
        if (!result.error) {
          dispatch(updateUser({
            profilePic: result.payload.profilePic
          }))
        }
      }
    )
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleAvatarChange(file)
  }

  return (
    <div className="relative">

      {/* ======================== */}
      {/*      Cover Banner        */}
      {/* ======================== */}
      <div className="h-52 bg-gradient-to-br
                       from-indigo-900 via-indigo-800
                       to-purple-900 relative
                       overflow-hidden">

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(
              circle at 1px 1px,
              white 1px,
              transparent 0
            )`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20
                         w-80 h-80 bg-purple-500
                         rounded-full opacity-20
                         blur-3xl" />
        <div className="absolute -bottom-20 -left-20
                         w-80 h-80 bg-indigo-400
                         rounded-full opacity-20
                         blur-3xl" />
      </div>

      {/* ======================== */}
      {/*     Profile Content      */}
      {/* ======================== */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="flex flex-col sm:flex-row
                         items-start sm:items-end
                         gap-6 -mt-20 mb-6">

          {/* ======================== */}
          {/*      Avatar Upload       */}
          {/* ======================== */}
          <div
            className="relative flex-shrink-0 group"
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`
                w-32 h-32 rounded-3xl border-4
                border-white shadow-2xl overflow-hidden
                bg-indigo-200 cursor-pointer
                transition-all duration-300
                ${dragOver
                  ? 'ring-4 ring-indigo-400 ' +
                    'ring-offset-2'
                  : ''
                }
              `}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              {/* Avatar Image */}
              {profile?.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt={profile?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full
                                 bg-gradient-to-br
                                 from-indigo-400
                                 to-purple-600 flex
                                 items-center justify-center">
                  <span className="text-white text-5xl
                                    font-black">
                    {profile?.name?.charAt(0)
                      .toUpperCase() || '?'}
                  </span>
                </div>
              )}

              {/* Upload Overlay */}
              <div className="absolute inset-0
                               bg-black/50 flex flex-col
                               items-center justify-center
                               opacity-0 group-hover:opacity-100
                               transition-opacity duration-200">
                {avatarLoading ? (
                  <div className="w-8 h-8 border-3
                                   border-white
                                   border-t-transparent
                                   rounded-full
                                   animate-spin" />
                ) : (
                  <>
                    <CameraIcon
                      className="w-8 h-8 text-white mb-1"
                    />
                    <span className="text-white text-xs
                                      font-medium">
                      Change
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Online Indicator */}
            <div className="absolute bottom-1 right-1
                             w-5 h-5 bg-green-400
                             rounded-full border-3
                             border-white shadow-sm" />

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleAvatarChange(e.target.files[0])
              }
            />
          </div>

          {/* ======================== */}
          {/*      Profile Info        */}
          {/* ======================== */}
          <div className="flex-1 pb-2 min-w-0">
            <div className="flex items-center
                             gap-3 mb-2 flex-wrap">

              {/* Name */}
              <h1 className="text-2xl font-black
                              text-gray-900 truncate">
                {profile?.name || 'Loading...'}
              </h1>

              {/* Verified Badge */}
              <CheckBadgeIcon
                className="w-6 h-6 text-indigo-500
                            flex-shrink-0"
              />

              {/* Role Badge */}
              {roleConfig && (
                <span className={`px-3 py-1 rounded-full
                                   text-xs font-bold
                                   flex-shrink-0
                                   ${roleConfig.color}`}>
                  {roleConfig.label}
                </span>
              )}
            </div>

            {/* Email */}
            <p className="text-gray-500 text-sm
                           mb-3 truncate">
              {profile?.email}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4
                             flex-wrap">
              {profile?.createdAt && (
                <div className="flex items-center
                                 gap-1.5 text-xs
                                 text-gray-400">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Joined{' '}
                  {format(
                    new Date(profile.createdAt),
                    'MMM yyyy'
                  )}
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center
                                 gap-1.5 text-xs
                                 text-gray-400">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {profile.location}
                </div>
              )}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5
                              text-xs text-indigo-500
                              hover:text-indigo-700
                              transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Website
                </a>
              )}
            </div>
          </div>

          {/* ======================== */}
          {/*       Stats Row          */}
          {/* ======================== */}
          <div className="hidden sm:flex items-center
                           gap-6 pb-2 flex-shrink-0">
            {[
              {
                label: 'Projects',
                value: stats?.totalProjects || 0,
                icon:  '📁',
              },
              {
                label: 'Tasks Done',
                value: stats?.completedTasks || 0,
                icon:  '✅',
              },
              {
                label: 'Points',
                value: stats?.totalStoryPoints || 0,
                icon:  '⚡',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-xl mb-0.5">
                  {stat.icon}
                </div>
                <p className="text-2xl font-black
                               text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400
                               font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}