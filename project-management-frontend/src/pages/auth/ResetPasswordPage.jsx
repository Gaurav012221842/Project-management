// src/pages/auth/ResetPasswordPage.jsx
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  KeyIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import authService from '../../services/api/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('newPassword', '')

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)

    try {
      await authService.resetPassword({
        token,
        newPassword: data.newPassword,
      })
      setComplete(true)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Unable to reset password'
      )
    } finally {
      setLoading(false)
    }
  }

  if (complete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full
                        flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Password updated
        </h2>
        <p className="text-gray-500 mb-8">
          You can now sign in with your new password.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center
                     w-full py-3.5 rounded-2xl font-semibold text-sm
                     text-white bg-indigo-600 hover:bg-indigo-700
                     shadow-lg shadow-indigo-200 transition-colors"
        >
          Back to Login
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl
                        flex items-center justify-center mx-auto mb-4">
          <KeyIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Reset password
        </h2>
        <p className="text-gray-500">
          Create a new password for your account
        </p>
      </div>

      {(!token || error) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-red-50 border
                     border-red-200 rounded-2xl p-4 mb-6"
        >
          <ExclamationCircleIcon
            className="w-5 h-5 text-red-500 flex-shrink-0"
          />
          <p className="text-red-600 text-sm">
            {!token ? 'Reset token is missing' : error}
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold
                            text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4
                            flex items-center pointer-events-none">
              <LockClosedIcon
                className={`w-5 h-5 ${
                  errors.newPassword ? 'text-red-400' : 'text-gray-400'
                }`}
              />
            </div>
            <input
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                  message: 'Use uppercase, lowercase and a number',
                },
              })}
              type="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              className={`w-full pl-12 pr-4 py-3.5 border
                          rounded-2xl text-sm bg-white
                          focus:outline-none focus:ring-2
                          transition-all duration-200 ${
                            errors.newPassword
                              ? 'border-red-300 focus:ring-red-500 bg-red-50'
                              : 'border-gray-200 focus:ring-indigo-500 hover:border-gray-300'
                          }`}
            />
          </div>
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-500
                          flex items-center gap-1">
              <ExclamationCircleIcon className="w-3.5 h-3.5" />
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold
                            text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4
                            flex items-center pointer-events-none">
              <LockClosedIcon
                className={`w-5 h-5 ${
                  errors.confirmPassword ? 'text-red-400' : 'text-gray-400'
                }`}
              />
            </div>
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              className={`w-full pl-12 pr-4 py-3.5 border
                          rounded-2xl text-sm bg-white
                          focus:outline-none focus:ring-2
                          transition-all duration-200 ${
                            errors.confirmPassword
                              ? 'border-red-300 focus:ring-red-500 bg-red-50'
                              : 'border-gray-200 focus:ring-indigo-500 hover:border-gray-300'
                          }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-500
                          flex items-center gap-1">
              <ExclamationCircleIcon className="w-3.5 h-3.5" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={loading || !token}
          whileHover={!loading && token ? { scale: 1.01 } : {}}
          whileTap={!loading && token ? { scale: 0.99 } : {}}
          className={`w-full py-3.5 rounded-2xl font-semibold
                      text-sm text-white flex items-center
                      justify-center gap-2 transition-all duration-200 ${
                        loading || !token
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                      }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white
                              border-t-transparent rounded-full
                              animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <KeyIcon className="w-4 h-4" />
              Reset Password
            </>
          )}
        </motion.button>
      </form>

      <div className="text-center mt-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm
                     text-gray-500 hover:text-indigo-600
                     transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </motion.div>
  )
}
