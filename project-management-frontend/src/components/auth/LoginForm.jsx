// src/components/auth/LoginForm.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input  from '../common/Input/Input'
import Button from '../common/Button/Button'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

function LoginForm() {
  const { login, loading, error } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => login(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

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
        placeholder="Enter your password"
        leftIcon={<LockClosedIcon />}
        error={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded" {...register('rememberMe')} />
          <span className="text-gray-600">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign up</Link>
      </p>
    </form>
  )
}

export default LoginForm
