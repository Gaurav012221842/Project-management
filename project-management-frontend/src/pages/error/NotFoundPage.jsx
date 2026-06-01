// src/pages/error/NotFoundPage.jsx
import { useNavigate }  from 'react-router-dom'
import { motion }       from 'framer-motion'
import { HomeIcon }     from '@heroicons/react/24/outline'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50
                     flex items-center
                     justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{
            type:   'spring',
            bounce: 0.4,
            delay:  0.1,
          }}
          className="text-9xl font-black
                       text-transparent bg-clip-text
                       bg-gradient-to-br
                       from-indigo-500 to-purple-600
                       mb-6 leading-none"
        >
          404
        </motion.div>

        <h2 className="text-2xl font-bold
                        text-gray-900 mb-3">
          Page not found
        </h2>
        <p className="text-gray-400 mb-8
                       leading-relaxed">
          Oops! The page you're looking for
          doesn't exist or has been moved.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98   }}
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2
                      px-6 py-3 bg-indigo-600
                      text-white rounded-xl
                      font-semibold text-sm
                      hover:bg-indigo-700
                      shadow-lg shadow-indigo-200
                      transition-all"
        >
          <HomeIcon className="w-4 h-4" />
          Back to Projects
        </motion.button>
      </motion.div>
    </div>
  )
}