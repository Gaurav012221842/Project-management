// src/utils/validationUtils.js
export const RULES = {
  required:  { required: 'This field is required' },
  email: {
    required: 'Email is required',
    pattern: {
      value:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Enter a valid email address',
    },
  },
  password: {
    required:  'Password is required',
    minLength: { value: 8, message: 'At least 8 characters required' },
  },
  name: {
    required:  'Name is required',
    minLength: { value: 2,   message: 'At least 2 characters required' },
    maxLength: { value: 100, message: 'Max 100 characters'             },
  },
  url: {
    pattern: {
      value:   /^https?:\/\/.+/,
      message: 'Enter a valid URL',
    },
  },
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongPassword(password = '') {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  )
}

export function isValidUrl(url) {
  try { new URL(url); return true } catch { return false }
}
