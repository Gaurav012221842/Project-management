// src/components/profile/ChangePasswordForm.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                  from 'react-hook-form'
import { motion }                   from 'framer-motion'
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import {
  changePassword,
  selectPasswordLoading,
} from '../../features/profile/profileSlice'

const getStrength = (pwd) => {
  if (!pwd) return null
  const checks = {
    length:    pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number:    /\d/.test(pwd),
    special:   /[@$!%*?&]/.test(pwd),
  }
  const score = Object.values(checks)
    .filter(Boolean).length

  return {
    score,
    checks,
    label:
      score <= 2 ? 'Weak'   :
      score <= 3 ? 'Fair'   :
      score <= 4 ? 'Good'   : 'Strong',
    color:
      score <= 2 ? 'bg-red-500'    :
      score <= 3 ? 'bg-yellow-500' :
      score <= 4 ? 'bg-blue-500'   :
                   'bg-green-500',
    textColor:
      score <= 2 ? 'text-red-500'    :
      score <= 3 ? 'text-yellow-500' :
      score <= 4 ? 'text-blue-500'   :
                   'text-green-500',
    width: `${(score / 5) * 100}%`,
  }
}

const PasswordField = ({
  name,
  label,
  show,
  onToggle,
  placeholder,
  rules,
  register,
  errors,
}) => (
  <div>
    <label className="block text-sm font-semibold
                        text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <LockClosedIcon
        className={`
          absolute left-3.5 top-1/2 -translate-y-1/2
          w-4 h-4 pointer-events-none
          ${errors[name] ? 'text-red-400' : 'text-gray-400'}
        `}
      />
      <input
        {...register(name, rules)}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className={`
          w-full pl-10 pr-12 py-3 border rounded-xl
          text-sm transition-all focus:outline-none
          focus:ring-2
          ${errors[name]
            ? 'border-red-300 focus:ring-red-500 bg-red-50'
            : 'border-gray-200 focus:ring-indigo-500 ' +
              'hover:border-gray-300'
          }
        `}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 top-1/2
                    -translate-y-1/2 text-gray-400
                    hover:text-gray-600
                    transition-colors"
      >
        {show
          ? <EyeSlashIcon className="w-4 h-4" />
          : <EyeIcon      className="w-4 h-4" />
        }
      </button>
    </div>
    {errors[name] && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y:  0 }}
        className="mt-1 text-xs text-red-500
                    flex items-center gap-1"
      >
        <ExclamationCircleIcon className="w-3.5 h-3.5" />
        {errors[name].message}
      </motion.p>
    )}
  </div>
)

export default function ChangePasswordForm() {
  const dispatch  = useDispatch()
  const isLoading = useSelector(selectPasswordLoading)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew,      setShowNew]    = useState(false)
  const [showConfirm,  setShowConfirm] = useState(false)
  const [success,      setSuccess]     = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const newPwd = watch('newPassword', '')
  const strength = getStrength(newPwd)

  const onSubmit = (data) => {
    dispatch(changePassword({
      currentPassword: data.currentPassword,
      newPassword:     data.newPassword,
    })).then((result) => {
      if (!result.error) {
        reset()
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

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
          Change Password
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Keep your account secure
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y:   0 }}
          className="mx-6 mt-5 flex items-center
                      gap-3 bg-green-50 border
                      border-green-200 rounded-xl p-4"
        >
          <ShieldCheckIcon
            className="w-5 h-5 text-green-600
                        flex-shrink-0"
          />
          <p className="text-green-700 text-sm
                         font-medium">
            Password changed successfully! 🎉
          </p>
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-5"
      >
        {/* Current Password */}
        <PasswordField
          name="currentPassword"
          label="Current Password"
          show={showCurrent}
          onToggle={() => setShowCurrent(!showCurrent)}
          placeholder="Enter current password"
          register={register}
          errors={errors}
          rules={{
            required: 'Current password is required'
          }}
        />

        {/* New Password */}
        <div>
          <PasswordField
            name="newPassword"
            label="New Password"
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
            placeholder="Enter new password"
            register={register}
            errors={errors}
            rules={{
              required:  'New password is required',
              minLength: {
                value:   8,
                message: 'At least 8 characters',
              },
              pattern: {
                value:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Need uppercase, lowercase & number',
              },
            }}
          />

          {/* Password Strength */}
          {newPwd && strength && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y:  0 }}
              className="mt-3 space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100
                                 rounded-full h-2">
                  <motion.div
                    animate={{ width: strength.width }}
                    transition={{ duration: 0.3 }}
                    className={`h-2 rounded-full
                                  ${strength.color}`}
                  />
                </div>
                <span className={`text-xs font-bold
                                   w-14 text-right
                                   ${strength.textColor}`}>
                  {strength.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'length',    label: '8+ chars'  },
                  { key: 'uppercase', label: 'Uppercase'  },
                  { key: 'lowercase', label: 'Lowercase'  },
                  { key: 'number',    label: 'Number'     },
                ].map(req => (
                  <div
                    key={req.key}
                    className="flex items-center gap-1.5"
                  >
                    <div className={`
                      w-3.5 h-3.5 rounded-full
                      flex items-center justify-center
                      flex-shrink-0 transition-colors
                      ${strength.checks[req.key]
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                      }
                    `}>
                      {strength.checks[req.key] && (
                        <svg
                          className="w-2 h-2 text-white"
                          viewBox="0 0 8 8"
                          fill="none"
                        >
                          <path
                            d="M1 4l2 2 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs
                      ${strength.checks[req.key]
                        ? 'text-green-600'
                        : 'text-gray-400'
                      }`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <PasswordField
          name="confirmPassword"
          label="Confirm New Password"
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
          placeholder="Confirm new password"
          register={register}
          errors={errors}
          rules={{
            required: 'Please confirm your password',
            validate: (val) =>
              val === watch('newPassword') ||
              'Passwords do not match',
          }}
        />

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-100
                         rounded-xl p-4">
          <p className="text-xs font-semibold
                         text-blue-700 mb-2">
            🔐 Security Tips
          </p>
          <ul className="space-y-1">
            {[
              'Use at least 8 characters',
              'Mix uppercase, lowercase, numbers',
              'Avoid using personal information',
              'Use a unique password for this account',
            ].map((tip) => (
              <li
                key={tip}
                className="text-xs text-blue-600
                            flex items-center gap-1.5"
              >
                <div className="w-1 h-1 bg-blue-400
                                 rounded-full" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-3
                         border-t border-gray-100">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading
              ? { scale: 1.01 } : {}}
            whileTap={!isLoading
              ? { scale: 0.99 } : {}}
            className={`
              flex items-center gap-2
              px-6 py-2.5 rounded-xl
              font-semibold text-sm text-white
              transition-all
              ${isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
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
                Changing...
              </>
            ) : (
              <>
                <ShieldCheckIcon className="w-4 h-4" />
                Change Password
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
