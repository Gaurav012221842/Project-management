// src/components/profile/EditProfileForm.jsx
import { useEffect }                from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                  from 'react-hook-form'
import { motion }                   from 'framer-motion'
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
  DocumentTextIcon,
  PhoneIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import {
  updateProfile,
  selectUpdateLoading,
} from '../../features/profile/profileSlice'
import {
  updateUser,
} from '../../features/auth/authSlice'

export default function EditProfileForm({ profile }) {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectUpdateLoading)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm()

  useEffect(() => {
    if (profile) {
      reset({
        name:     profile.name     || '',
        email:    profile.email    || '',
        phone:    profile.phone    || '',
        location: profile.location || '',
        website:  profile.website  || '',
        bio:      profile.bio      || '',
      })
    }
  }, [profile, reset])

  const onSubmit = (data) => {
    dispatch(updateProfile(data)).then((result) => {
      if (!result.error) {
        dispatch(updateUser({
          name:       data.name,
          profilePic: profile?.profilePic,
        }))
        reset(data)
      }
    })
  }

  const fields = [
    {
      name:        'name',
      label:       'Full Name',
      icon:        UserIcon,
      type:        'text',
      placeholder: 'John Doe',
      rules: {
        required:  'Name is required',
        minLength: {
          value:   2,
          message: 'At least 2 characters',
        },
      },
    },
    {
      name:        'email',
      label:       'Email Address',
      icon:        EnvelopeIcon,
      type:        'email',
      placeholder: 'you@example.com',
      disabled:    true,
      hint:        'Email cannot be changed',
      rules: {
        required: 'Email is required',
      },
    },
    {
      name:        'phone',
      label:       'Phone Number',
      icon:        PhoneIcon,
      type:        'tel',
      placeholder: '+1 (555) 000-0000',
      rules:       {},
    },
    {
      name:        'location',
      label:       'Location',
      icon:        MapPinIcon,
      type:        'text',
      placeholder: 'New York, USA',
      rules:       {},
    },
    {
      name:        'website',
      label:       'Website / Portfolio',
      icon:        LinkIcon,
      type:        'url',
      placeholder: 'https://yourwebsite.com',
      rules:       {
        pattern: {
          value:   /^https?:\/\/.+/,
          message: 'Must start with http:// or https://',
        },
      },
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y:  0 }}
      className="bg-white rounded-2xl border
                  border-gray-100 shadow-sm
                  overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b
                       border-gray-100 bg-gray-50/50">
        <h2 className="text-base font-bold
                        text-gray-900">
          Edit Profile
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Update your personal information
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6"
      >
        <div className="grid grid-cols-1
                         md:grid-cols-2 gap-5">

          {/* Dynamic Fields */}
          {fields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{
                duration: 0.3,
                delay:    index * 0.06,
              }}
              className={
                field.name === 'bio'
                  ? 'md:col-span-2'
                  : ''
              }
            >
              <label className="block text-sm
                                  font-semibold
                                  text-gray-700 mb-1.5">
                {field.label}
              </label>
              <div className="relative">
                <field.icon
                  className={`
                    absolute left-3.5 top-1/2
                    -translate-y-1/2 w-4 h-4
                    pointer-events-none
                    ${errors[field.name]
                      ? 'text-red-400'
                      : 'text-gray-400'
                    }
                  `}
                />
                <input
                  {...register(field.name, field.rules)}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  className={`
                    w-full pl-10 pr-4 py-3 border
                    rounded-xl text-sm transition-all
                    focus:outline-none focus:ring-2
                    ${field.disabled
                      ? 'bg-gray-50 text-gray-400 ' +
                        'cursor-not-allowed ' +
                        'border-gray-200'
                      : errors[field.name]
                        ? 'border-red-300 ' +
                          'focus:ring-red-500 bg-red-50'
                        : 'border-gray-200 ' +
                          'focus:ring-indigo-500 ' +
                          'hover:border-gray-300'
                    }
                  `}
                />
              </div>
              {field.hint && (
                <p className="mt-1 text-xs text-gray-400">
                  {field.hint}
                </p>
              )}
              {errors[field.name] && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y:  0 }}
                  className="mt-1 text-xs text-red-500"
                >
                  {errors[field.name].message}
                </motion.p>
              )}
            </motion.div>
          ))}

          {/* Bio Textarea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y:  0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="md:col-span-2"
          >
            <label className="block text-sm
                                font-semibold
                                text-gray-700 mb-1.5">
              Bio
            </label>
            <div className="relative">
              <DocumentTextIcon
                className="absolute left-3.5 top-3.5
                            w-4 h-4 text-gray-400
                            pointer-events-none"
              />
              <textarea
                {...register('bio', {
                  maxLength: {
                    value:   300,
                    message: 'Max 300 characters',
                  },
                })}
                placeholder="Tell your team about yourself..."
                rows={3}
                className="w-full pl-10 pr-4 py-3
                            border border-gray-200
                            rounded-xl text-sm
                            resize-none focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            hover:border-gray-300
                            transition-all"
              />
            </div>
            {errors.bio && (
              <p className="mt-1 text-xs text-red-500">
                {errors.bio.message}
              </p>
            )}
          </motion.div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center
                         justify-end gap-3 pt-5
                         border-t border-gray-100">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty}
            className="px-5 py-2.5 rounded-xl
                        border-2 border-gray-200
                        text-gray-600 font-semibold
                        text-sm hover:bg-gray-50
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        transition-all"
          >
            Reset
          </button>

          <motion.button
            type="submit"
            disabled={isLoading || !isDirty}
            whileHover={
              !isLoading && isDirty
                ? { scale: 1.01 } : {}
            }
            whileTap={
              !isLoading && isDirty
                ? { scale: 0.99 } : {}
            }
            className={`
              flex items-center gap-2
              px-6 py-2.5 rounded-xl
              font-semibold text-sm text-white
              transition-all duration-200
              ${isLoading || !isDirty
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 ' +
                  'shadow-lg shadow-indigo-200'
              }
            `}
          >
            {isLoading ? (
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
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}