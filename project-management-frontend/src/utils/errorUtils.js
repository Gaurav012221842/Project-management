// src/utils/errorUtils.js
export function getErrorMessage(error) {
  if (!error) return 'An unexpected error occurred'
  if (typeof error === 'string') return error
  return (
    error.response?.data?.message ||
    error.response?.data?.error   ||
    error.message                 ||
    'An unexpected error occurred'
  )
}

export function isNetworkError(error) {
  return !error.response && Boolean(error.request)
}

export function isAuthError(error) {
  return error.response?.status === 401 ||
         error.response?.status === 403
}

export function isValidationError(error) {
  return error.response?.status === 400
}

export function isNotFoundError(error) {
  return error.response?.status === 404
}

export function parseServerErrors(error) {
  const data = error.response?.data
  if (!data) return {}
  if (data.errors && typeof data.errors === 'object') return data.errors
  return {}
}
