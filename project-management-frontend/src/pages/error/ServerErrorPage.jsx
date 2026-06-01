// src/pages/error/ServerErrorPage.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function ServerErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-8xl font-extrabold text-indigo-600 mb-2">500</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Internal Server Error</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Something went wrong on our end. We&apos;re working to fix it.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ServerErrorPage
