// src/pages/auth/ForgotPasswordPage.jsx
import { useState }               from 'react'
import { Link }                   from 'react-router-dom'
import { useForm }                from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'
import api from '../../services/api/axiosInstance'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [email,     setEmail]     = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await api.post(
        '/api/v1/auth/forgot-password',
        { email: data.email }
      )
      setEmail(data.email)
      setSubmitted(true)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">

        {/* ==================== */}
        {/* Send Email Form      */}
        {/* ==================== */}
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0   }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100
                               rounded-2xl flex
                               items-center
                               justify-center
                               mx-auto mb-4">
                <EnvelopeIcon
                  className="w-8 h-8 text-indigo-600"
                />
              </div>
              <h2 className="text-3xl font-bold
                              text-gray-900 mb-2">
                Forgot password? 🔑
              </h2>
              <p className="text-gray-500">
                Enter your email and we'll send
                a reset link
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y:  0  }}
                className="flex items-center gap-3
                             bg-red-50 border
                             border-red-200
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
                        message: 'Invalid email',
                      }
                    })}
                    type="email"
                    autoFocus
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3.5
                                 border rounded-2xl text-sm
                                 bg-white
                                 focus:outline-none
                                 focus:ring-2
                                 transition-all duration-200
                                 ${errors.email
                                   ? 'border-red-300 ' +
                                     'focus:ring-red-500 ' +
                                     'bg-red-50'
                                   : 'border-gray-200 ' +
                                     'focus:ring-indigo-500 ' +
                                     'hover:border-gray-300'
                                 }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs
                                 text-red-500 flex
                                 items-center gap-1">
                    <ExclamationCircleIcon
                      className="w-3.5 h-3.5"
                    />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading
                  ? { scale: 1.01 } : {}}
                whileTap={!loading
                  ? { scale: 0.99 } : {}}
                className={`w-full py-3.5 rounded-2xl
                             font-semibold text-sm
                             text-white
                             flex items-center
                             justify-center gap-2
                             transition-all duration-200
                             ${loading
                               ? 'bg-indigo-400 ' +
                                 'cursor-not-allowed'
                               : 'bg-indigo-600 ' +
                                 'hover:bg-indigo-700 ' +
                                 'shadow-lg ' +
                                 'shadow-indigo-200'
                             }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2
                                     border-white
                                     border-t-transparent
                                     rounded-full
                                     animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon
                      className="w-4 h-4"
                    />
                    Send Reset Link
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (

          /* ==================== */
          /* Success State        */
          /* ==================== */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1    }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0   }}
              animate={{ scale: 1   }}
              transition={{
                type:    'spring',
                bounce:  0.4,
                delay:   0.1,
              }}
              className="w-20 h-20 bg-green-100
                           rounded-full flex items-center
                           justify-center mx-auto mb-6"
            >
              <CheckCircleIcon
                className="w-10 h-10 text-green-600"
              />
            </motion.div>

            <h2 className="text-2xl font-bold
                            text-gray-900 mb-3">
              Check your email! 📬
            </h2>
            <p className="text-gray-500 mb-2">
              We sent a password reset link to
            </p>
            <p className="font-semibold
                           text-indigo-600 mb-8">
              {email}
            </p>

            <div className="bg-amber-50 border
                             border-amber-200
                             rounded-2xl p-4 mb-8
                             text-left">
              <p className="text-amber-700 text-sm
                             font-medium mb-1">
                ⏰ Link expires in 15 minutes
              </p>
              <p className="text-amber-600 text-xs">
                Check your spam folder if you
                don't see it in your inbox
              </p>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-indigo-600
                          hover:text-indigo-700
                          font-medium
                          transition-colors"
            >
              ← Use different email
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Login */}
      <div className="text-center mt-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2
                      text-sm text-gray-500
                      hover:text-gray-700
                      transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </motion.div>
  )
}