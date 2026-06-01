// src/components/auth/ForgotPasswordForm.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import axiosInstance from '../../services/api/axiosInstance'
import Input  from '../common/Input/Input'
import Button from '../common/Button/Button'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

function ForgotPasswordForm() {
  const [sent,  setSent]  = useState(false)
  const [error, setError] = useState(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async ({ email }) => {
    setError(null)
    try {
      await axiosInstance.post('/api/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-3">
        <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-base font-semibold text-gray-800">Check your email</h3>
        <p className="text-sm text-gray-500">We&apos;ve sent a password reset link to your email address.</p>
        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">Back to login</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={<EnvelopeIcon />}
        error={errors.email?.message}
        hint="We\'ll send a reset link to this address"
        {...register('email', {
          required: 'Email is required',
          pattern:  { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
        })}
      />

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Send Reset Link
      </Button>

      <p className="text-center text-sm text-gray-500">
        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Back to login</Link>
      </p>
    </form>
  )
}

export default ForgotPasswordForm
