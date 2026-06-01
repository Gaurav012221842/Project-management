// src/pages/auth/LoginPage.jsx
import { useState, useEffect }      from 'react'
import { Link, useNavigate }        from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm }                  from 'react-hook-form'
import { motion }                   from 'framer-motion'
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import {
  login,
  selectAuth,
  clearError,
} from '../../features/auth/authSlice'

export default function LoginPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading, error, token } =
    useSelector(selectAuth)

  const [showPassword, setShowPassword] =
    useState(false)
  const [rememberMe, setRememberMe] =
    useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email:    '',
      password: '',
    }
  })

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/projects')
  }, [token, navigate])

  // Clear error on unmount
  useEffect(() => {
    return () => dispatch(clearError())
  }, [dispatch])

  // ============================
  // Submit
  // ============================
  const onSubmit = async (data) => {
    dispatch(login({
      email:    data.email,
      password: data.password,
    })).then((result) => {
      if (!result.error) {
        navigate('/projects')
      }
    })
  }

  // ============================
  // Demo Login
  // ============================
  const handleDemoLogin = () => {
    setValue('email',    'demo@projAI.com')
    setValue('password', 'Demo@1234')
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
          Welcome back 👋
        </h2>
        <p className="text-gray-500">
          Sign in to your ProjAI account
        </p>
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* Email Field */}
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
                className={`w-5 h-5 transition-colors
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
                           focus:ring-offset-0
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

        {/* Password Field */}
        <div>
          <div className="flex items-center
                           justify-between mb-2">
            <label className="block text-sm
                                font-semibold
                                text-gray-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600
                          hover:text-indigo-700
                          font-medium
                          transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0
                             left-0 pl-4 flex
                             items-center
                             pointer-events-none">
              <LockClosedIcon
                className={`w-5 h-5 transition-colors
                             ${errors.password
                               ? 'text-red-400'
                               : 'text-gray-400'}`}
              />
            </div>
            <input
              {...register('password', {
                required:  'Password is required',
                minLength: {
                  value:   6,
                  message: 'Minimum 6 characters',
                }
              })}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`w-full pl-12 pr-12 py-3.5
                           border rounded-2xl text-sm
                           bg-white
                           transition-all duration-200
                           focus:outline-none
                           focus:ring-2
                           focus:ring-offset-0
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
              className="absolute inset-y-0 right-0
                          pr-4 flex items-center
                          text-gray-400
                          hover:text-gray-600
                          transition-colors"
            >
              {showPassword
                ? <EyeSlashIcon className="w-5 h-5" />
                : <EyeIcon      className="w-5 h-5" />
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
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-5 h-5 rounded-md border-2
                         flex items-center
                         justify-center
                         transition-all duration-200
                         flex-shrink-0
                         ${rememberMe
                           ? 'bg-indigo-600 ' +
                             'border-indigo-600'
                           : 'border-gray-300 ' +
                             'hover:border-indigo-400'
                         }`}
          >
            {rememberMe && (
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
          </button>
          <label
            className="text-sm text-gray-600
                        cursor-pointer
                        select-none"
            onClick={() => setRememberMe(!rememberMe)}
          >
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.01 } : {}}
          whileTap={!loading  ? { scale: 0.99 } : {}}
          className={`w-full py-3.5 rounded-2xl
                       font-semibold text-sm
                       transition-all duration-200
                       flex items-center
                       justify-center gap-2
                       ${loading
                         ? 'bg-indigo-400 ' +
                           'cursor-not-allowed'
                         : 'bg-indigo-600 ' +
                           'hover:bg-indigo-700 ' +
                           'shadow-lg ' +
                           'shadow-indigo-200 ' +
                           'hover:shadow-indigo-300'
                       } text-white`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2
                               border-white
                               border-t-transparent
                               rounded-full
                               animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </motion.button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0
                           flex items-center">
            <div className="w-full border-t
                             border-gray-200" />
          </div>
          <div className="relative flex
                           justify-center text-sm">
            <span className="px-4 bg-gray-50
                              text-gray-400">
              or
            </span>
          </div>
        </div>

        {/* Demo Login */}
        <motion.button
          type="button"
          onClick={handleDemoLogin}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99  }}
          className="w-full py-3.5 rounded-2xl
                      font-semibold text-sm
                      border-2 border-gray-200
                      text-gray-700 bg-white
                      hover:border-indigo-300
                      hover:text-indigo-700
                      hover:bg-indigo-50
                      transition-all duration-200
                      flex items-center
                      justify-center gap-2"
        >
          <SparklesIcon className="w-4 h-4
                                    text-indigo-500" />
          Try Demo Account
        </motion.button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-sm
                     text-gray-500 mt-8">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-indigo-600 font-semibold
                      hover:text-indigo-700
                      transition-colors"
        >
          Create one free →
        </Link>
      </p>
    </motion.div>
  )
}