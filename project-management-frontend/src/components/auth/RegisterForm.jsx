// src/components/auth/RegisterForm.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input  from '../common/Input/Input'
import Button from '../common/Button/Button'
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

function RegisterForm() {
  const { register: authRegister, loading, error } = useAuth()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = (data) => authRegister({ name: data.name, email: data.email, password: data.password })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <Input
        label="Full Name"
        placeholder="Your name"
        leftIcon={<UserIcon />}
        error={errors.name?.message}
        {...register('name', {
          required:  'Name is required',
          minLength: { value: 2, message: 'At least 2 characters' },
        })}
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={<EnvelopeIcon />}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern:  { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
        })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        leftIcon={<LockClosedIcon />}
        error={errors.password?.message}
        hint="At least 8 characters"
        {...register('password', {
          required:  'Password is required',
          minLength: { value: 8, message: 'At least 8 characters required' },
        })}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        leftIcon={<LockClosedIcon />}
        error={errors.confirm?.message}
        {...register('confirm', {
          required: 'Please confirm your password',
          validate: (v) => v === password || 'Passwords do not match',
        })}
      />

      <Button type="submit" className="w-full" loading={loading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
      </p>
    </form>
  )
}

export default RegisterForm
