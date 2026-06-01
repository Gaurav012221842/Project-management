// src/components/common/Loader/PageLoader.jsx
import React from 'react'
import Spinner from './Spinner'

function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
      <Spinner size="xl" />
      {message && <p className="mt-4 text-sm text-gray-500">{message}</p>}
    </div>
  )
}

export default PageLoader
