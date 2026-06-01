// src/pages/auth/RegisterPage.jsx
import { useState, useEffect }      from 'react'
import { Link, useNavigate }        from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                  from 'react-hook-form'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import {
  register as registerUser,
  selectAuth,
  clearError,
} from '../../features/auth/authSlice'

// ============================
// Password Strength Config
// ============================
const getPasswordStrength = (password) => {
  if (!password) return null

  const checks = {
    length:    password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number:    /\d/.test(password),
    special:   /[@$!%*?&]/.test(password),
  }

  const passed = Object.values(checks)
    .filter(Boolean).length

  return {
    checks,
    score:    passed,
    label:    passed <= 2
                ? 'Weak'
                : passed <= 3
                  ? 'Fair'
                  : passed <= 4
                    ? 'Good'
                    : 'Strong',
    color:    passed <= 2
                ? 'bg-red-500'
                : passed <= 3
                  ? 'bg-yellow-500'
                  : passed <= 4
                    ? 'bg-blue-500'
                    : 'bg-green-500',
    textColor: passed <= 2
                ? 'text-red-500'
                : passed <= 3
                  ? 'text-yellow-500'
                  : passed <= 4
                    ? 'text-blue-500'
                    : 'text-green-500',
    width:    `${(passed / 5) * 100}%`,
  }
}

// ============================
// Step Config
// ============================
const STEPS = [
  { id: 1, label: 'Account'  },
  { id: 2, label: 'Security' },
  { id: 3, label: 'Confirm'  },
]

export default function RegisterPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading, error, token } =
    useSelector(selectAuth)

  const [currentStep, setCurrentStep]   = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [agreeTerms,   setAgreeTerms]   = useState(false)
  const [passwordVal,  setPasswordVal]  = useState('')

  const strength = getPasswordStrength(passwordVal)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name:            '',
      email:           '',
      password:        '',
      confirmPassword: '',
    }
  })

  const watchedPassword = watch('password', '')

  // Sync password for strength checker
  useEffect(() => {
    setPasswordVal(watchedPassword)
  }, [watchedPassword])

  // Redirect if logged in
  useEffect(() => {
    if (token) navigate('/projects')
  }, [token, navigate])

  // Clear error on unmount
  useEffect(() => {
    return () => dispatch(clearError())
  }, [dispatch])

  // ============================
  // Next Step
  // ============================
  const handleNextStep = async () => {
    let fields = []

    if (currentStep === 1) {
      fields = ['name', 'email']
    } else if (currentStep === 2) {
      fields = ['password', 'confirmPassword']
    }

    const valid = await trigger(fields)
    if (valid) setCurrentStep(currentStep + 1)
  }

  // ============================
  // Submit
  // ============================
  const onSubmit = (data) => {
    if (!agreeTerms) return

    dispatch(registerUser({
      name:     data.name,
      email:    data.email,
      password: data.password,
    })).then((result) => {
      if (!result.error) {
        navigate('/projects')
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold
                        text-gray-900 mb-2">
          Create your account ✨
        </h2>
        <p className="text-gray-500">
          Join thousands of teams using ProjAI
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center flex-1"
          >
            <div className="flex flex-col
                             items-center">
              <motion.div
                animate={{
                  scale: currentStep === step.id
                    ? 1.1 : 1,
                }}
                className={`w-9 h-9 rounded-full
                             flex items-center
                             justify-center
                             text-sm font-bold
                             transition-all
                             duration-300
                             ${currentStep > step.id
                               ? 'bg-indigo-600 ' +
                                 'text-white'
                               : currentStep === step.id
                                 ? 'bg-indigo-600 ' +
                                   'text-white ' +
                                   'ring-4 ' +
                                   'ring-indigo-100'
                                 : 'bg-gray-100 ' +
                                   'text-gray-400'
                             }`}
              >
                {currentStep > step.id
                  ? <CheckCircleIcon
                      className="w-5 h-5"
                    />
                  : step.id
                }
              </motion.div>
              <span className={`text-xs mt-1
                                 font-medium
                                 ${currentStep >= step.id
                                   ? 'text-indigo-600'
                                   : 'text-gray-400'
                                 }`}>
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < STEPS.length - 1 && (
              <div className="flex-1 mx-2 mb-4">
                <div className="h-0.5 bg-gray-200
                                 rounded-full
                                 overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500
                                rounded-full"
                    animate={{
                      width: currentStep > step.id
                        ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y:  0  }}
          className="flex items-center gap-3
                       bg-red-50 border border-red-200
                       rounded-2xl p-4 mb-6"
        >
          <ExclamationCircleIcon
            className="w-5 h-5 text-red-500
                        flex-shrink-0"
          />
          <p className="text-red-600 text-sm">
            {error}
          </p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">

          {/* ==================== */}
          {/* Step 1: Account Info */}
          {/* ==================== */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30  }}
              animate={{ opacity: 1, x: 0   }}
              exit={{ opacity: 0, x: -30    }}
              transition={{ duration: 0.3   }}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label className="block text-sm
                                    font-semibold
                                    text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0
                                   left-0 pl-4 flex
                                   items-center
                                   pointer-events-none">
                    <UserIcon
                      className={`w-5 h-5
                                   ${errors.name
                                     ? 'text-red-400'
                                     : 'text-gray-400'}`}
                    />
                  </div>
                  <input
                    {...register('name', {
                      required:  'Full name is required',
                      minLength: {
                        value:   2,
                        message: 'At least 2 characters',
                      },
                      maxLength: {
                        value:   50,
                        message: 'Max 50 characters',
                      }
                    })}
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    autoFocus
                    className={`w-full pl-12 pr-4 py-3.5
                                 border rounded-2xl text-sm
                                 bg-white
                                 transition-all duration-200
                                 focus:outline-none
                                 focus:ring-2
                                 ${errors.name
                                   ? 'border-red-300 ' +
                                     'focus:ring-red-500 ' +
                                     'bg-red-50'
                                   : 'border-gray-200 ' +
                                     'focus:ring-indigo-500 ' +
                                     'focus:border-indigo-500 ' +
                                     'hover:border-gray-300'
                                 }`}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y:  0 }}
                    className="mt-1.5 text-xs
                                text-red-500 flex
                                items-center gap-1"
                  >
                    <ExclamationCircleIcon
                      className="w-3.5 h-3.5"
                    />
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm
                                    font-semibold
                                    text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0
                                   left-0 pl-4 flex
                                   items-center
                                   pointer-events-none">
                    <EnvelopeIcon
                      className={`w-5 h-5
                                   ${errors.email
                                     ? 'text-red-400'
                                     : 'text-gray-400'}`}
                    />
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern:  {
                        value:   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      }
                    })}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3.5
                                 border rounded-2xl text-sm
                                 bg-white
                                 transition-all duration-200
                                 focus:outline-none
                                 focus:ring-2
                                 ${errors.email
                                   ? 'border-red-300 ' +
                                     'focus:ring-red-500 ' +
                                     'bg-red-50'
                                   : 'border-gray-200 ' +
                                     'focus:ring-indigo-500 ' +
                                     'focus:border-indigo-500 ' +
                                     'hover:border-gray-300'
                                 }`}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y:  0 }}
                    className="mt-1.5 text-xs
                                text-red-500 flex
                                items-center gap-1"
                  >
                    <ExclamationCircleIcon
                      className="w-3.5 h-3.5"
                    />
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Next Button */}
              <motion.button
                type="button"
                onClick={handleNextStep}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99  }}
                className="w-full py-3.5 rounded-2xl
                            bg-indigo-600 text-white
                            font-semibold text-sm
                            hover:bg-indigo-700
                            shadow-lg shadow-indigo-200
                            transition-all duration-200
                            flex items-center
                            justify-center gap-2"
              >
                Continue
                <ArrowRightIcon className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* ==================== */}
          {/* Step 2: Security     */}
          {/* ==================== */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30  }}
              animate={{ opacity: 1, x: 0   }}
              exit={{ opacity: 0, x: -30    }}
              transition={{ duration: 0.3   }}
              className="space-y-5"
            >
              {/* Password */}
              <div>
                <label className="block text-sm
                                    font-semibold
                                    text-gray-700 mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0
                                   left-0 pl-4 flex
                                   items-center
                                   pointer-events-none">
                    <LockClosedIcon
                      className={`w-5 h-5
                                   ${errors.password
                                     ? 'text-red-400'
                                     : 'text-gray-400'}`}
                    />
                  </div>
                  <input
                    {...register('password', {
                      required:  'Password is required',
                      minLength: {
                        value:   8,
                        message: 'At least 8 characters',
                      },
                      pattern: {
                        value:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Must include uppercase, lowercase and number',
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoFocus
                    placeholder="Create strong password"
                    className={`w-full pl-12 pr-12 py-3.5
                                 border rounded-2xl text-sm
                                 bg-white
                                 transition-all duration-200
                                 focus:outline-none
                                 focus:ring-2
                                 ${errors.password
                                   ? 'border-red-300 ' +
                                     'focus:ring-red-500 ' +
                                     'bg-red-50'
                                   : 'border-gray-200 ' +
                                     'focus:ring-indigo-500 ' +
                                     'focus:border-indigo-500 ' +
                                     'hover:border-gray-300'
                                 }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute inset-y-0
                                right-0 pr-4 flex
                                items-center
                                text-gray-400
                                hover:text-gray-600
                                transition-colors"
                  >
                    {showPassword
                      ? <EyeSlashIcon
                          className="w-5 h-5"
                        />
                      : <EyeIcon
                          className="w-5 h-5"
                        />
                    }
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y:  0 }}
                    className="mt-1.5 text-xs
                                text-red-500 flex
                                items-center gap-1"
                  >
                    <ExclamationCircleIcon
                      className="w-3.5 h-3.5"
                    />
                    {errors.password.message}
                  </motion.p>
                )}

                {/* Password Strength */}
                {passwordVal && strength && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y:  0 }}
                    className="mt-3 space-y-2"
                  >
                    {/* Strength Bar */}
                    <div className="flex items-center
                                     gap-3">
                      <div className="flex-1
                                       bg-gray-100
                                       rounded-full h-2">
                        <motion.div
                          animate={{
                            width: strength.width
                          }}
                          transition={{
                            duration: 0.3
                          }}
                          className={`h-2 rounded-full
                                       transition-all
                                       ${strength.color}`}
                        />
                      </div>
                      <span className={`text-xs
                                         font-semibold
                                         w-12 text-right
                                         ${strength.textColor}`}>
                        {strength.label}
                      </span>
                    </div>

                    {/* Requirement Checks */}
                    <div className="grid grid-cols-2
                                     gap-1.5">
                      {[
                        {
                          key:   'length',
                          label: '8+ characters'
                        },
                        {
                          key:   'uppercase',
                          label: 'Uppercase'
                        },
                        {
                          key:   'lowercase',
                          label: 'Lowercase'
                        },
                        {
                          key:   'number',
                          label: 'Number'
                        },
                      ].map((req) => (
                        <div
                          key={req.key}
                          className="flex items-center
                                      gap-1.5"
                        >
                          <div className={`w-3.5 h-3.5
                                            rounded-full
                                            flex items-center
                                            justify-center
                                            flex-shrink-0
                                            transition-colors
                                            ${strength
                                              .checks[req.key]
                                              ? 'bg-green-500'
                                              : 'bg-gray-200'
                                            }`}>
                            {strength.checks[req.key] && (
                              <svg
                                className="w-2 h-2
                                            text-white"
                                viewBox="0 0 8 8"
                                fill="none"
                              >
                                <path
                                  d="M1 4l2 2 4-4"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs
                                             ${strength
                                               .checks[req.key]
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
              <div>
                <label className="block text-sm
                                    font-semibold
                                    text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0
                                   left-0 pl-4 flex
                                   items-center
                                   pointer-events-none">
                    <ShieldCheckIcon
                      className={`w-5 h-5
                                   ${errors.confirmPassword
                                     ? 'text-red-400'
                                     : 'text-gray-400'}`}
                    />
                  </div>
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (val) =>
                        val === watch('password') ||
                        'Passwords do not match',
                    })}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-12 py-3.5
                                 border rounded-2xl text-sm
                                 bg-white
                                 transition-all duration-200
                                 focus:outline-none
                                 focus:ring-2
                                 ${errors.confirmPassword
                                   ? 'border-red-300 ' +
                                     'focus:ring-red-500 ' +
                                     'bg-red-50'
                                   : 'border-gray-200 ' +
                                     'focus:ring-indigo-500 ' +
                                     'focus:border-indigo-500 ' +
                                     'hover:border-gray-300'
                                 }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                    className="absolute inset-y-0
                                right-0 pr-4 flex
                                items-center
                                text-gray-400
                                hover:text-gray-600
                                transition-colors"
                  >
                    {showConfirm
                      ? <EyeSlashIcon
                          className="w-5 h-5"
                        />
                      : <EyeIcon
                          className="w-5 h-5"
                        />
                    }
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y:  0 }}
                    className="mt-1.5 text-xs
                                text-red-500 flex
                                items-center gap-1"
                  >
                    <ExclamationCircleIcon
                      className="w-3.5 h-3.5"
                    />
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3.5 rounded-2xl
                              border-2 border-gray-200
                              text-gray-600 font-semibold
                              text-sm
                              hover:border-gray-300
                              hover:bg-gray-50
                              transition-all duration-200"
                >
                  Back
                </button>
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99  }}
                  className="flex-1 py-3.5 rounded-2xl
                              bg-indigo-600 text-white
                              font-semibold text-sm
                              hover:bg-indigo-700
                              shadow-lg shadow-indigo-200
                              transition-all duration-200
                              flex items-center
                              justify-center gap-2"
                >
                  Continue
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ==================== */}
          {/* Step 3: Confirm      */}
          {/* ==================== */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30  }}
              animate={{ opacity: 1, x: 0   }}
              exit={{ opacity: 0, x: -30    }}
              transition={{ duration: 0.3   }}
              className="space-y-6"
            >
              {/* Summary Card */}
              <div className="bg-indigo-50
                               border border-indigo-100
                               rounded-2xl p-5 space-y-3">
                <h4 className="font-semibold
                                text-indigo-900 text-sm">
                  Account Summary
                </h4>
                {[
                  {
                    label: 'Name',
                    value: watch('name')
                  },
                  {
                    label: 'Email',
                    value: watch('email')
                  },
                  {
                    label: 'Password',
                    value: '••••••••'
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center
                                justify-between"
                  >
                    <span className="text-xs
                                      text-indigo-500
                                      font-medium">
                      {item.label}
                    </span>
                    <span className="text-sm
                                      text-indigo-900
                                      font-semibold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Terms */}
              <div
                className={`flex items-start gap-3
                              p-4 rounded-2xl border-2
                              cursor-pointer
                              transition-all duration-200
                              ${agreeTerms
                                ? 'border-indigo-400 ' +
                                  'bg-indigo-50'
                                : 'border-gray-200 ' +
                                  'bg-white ' +
                                  'hover:border-indigo-200'
                              }`}
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                <div className={`w-5 h-5 rounded-md
                                  border-2 flex items-center
                                  justify-center
                                  transition-all
                                  flex-shrink-0 mt-0.5
                                  ${agreeTerms
                                    ? 'bg-indigo-600 ' +
                                      'border-indigo-600'
                                    : 'border-gray-300'
                                  }`}>
                  {agreeTerms && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600
                               leading-relaxed">
                  I agree to the{' '}
                  <span className="text-indigo-600
                                    font-medium">
                    Terms of Service
                  </span>
                  {' '}and{' '}
                  <span className="text-indigo-600
                                    font-medium">
                    Privacy Policy
                  </span>
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-3.5 rounded-2xl
                              border-2 border-gray-200
                              text-gray-600 font-semibold
                              text-sm
                              hover:border-gray-300
                              hover:bg-gray-50
                              transition-all duration-200"
                >
                  Back
                </button>

                {/* Create Account Button */}
                <motion.button
                  type="submit"
                  disabled={!agreeTerms || loading}
                  whileHover={
                    !loading && agreeTerms
                      ? { scale: 1.01 }
                      : {}
                  }
                  whileTap={
                    !loading && agreeTerms
                      ? { scale: 0.99 }
                      : {}
                  }
                  className={`flex-1 py-3.5 rounded-2xl
                               font-semibold text-sm
                               transition-all duration-200
                               flex items-center
                               justify-center gap-2
                               ${loading
                                 ? 'bg-indigo-400 ' +
                                   'cursor-not-allowed'
                                 : !agreeTerms
                                   ? 'bg-gray-200 ' +
                                     'text-gray-400 ' +
                                     'cursor-not-allowed'
                                   : 'bg-indigo-600 ' +
                                     'hover:bg-indigo-700 ' +
                                     'shadow-lg ' +
                                     'shadow-indigo-200'
                               } text-white`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2
                                       border-white
                                       border-t-transparent
                                       rounded-full
                                       animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon
                        className="w-4 h-4"
                      />
                      Create Account
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </form>

      {/* Footer Link */}
      <p className="text-center text-sm
                     text-gray-500 mt-8">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-indigo-600 font-semibold
                      hover:text-indigo-700
                      transition-colors"
        >
          Sign in →
        </Link>
      </p>
    </motion.div>
  )
}