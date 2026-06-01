// src/components/common/Loader/GlobalLoader.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector }             from 'react-redux'
import { SparklesIcon }            from '@heroicons/react/24/solid'
import {
  selectGlobalLoading,
} from '../../../features/ui/uiSlice'

export default function GlobalLoader() {
  const isLoading = useSelector(selectGlobalLoading)

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0   }}
          className="fixed inset-0 bg-white/80
                      backdrop-blur-sm z-[999]
                      flex flex-col items-center
                      justify-center"
        >
          <motion.div
            animate={{
              scale:   [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat:   Infinity,
              ease:     'easeInOut',
            }}
            className="w-16 h-16 bg-indigo-600
                        rounded-2xl flex items-center
                        justify-center shadow-2xl
                        shadow-indigo-300 mb-6"
          >
            <SparklesIcon
              className="w-8 h-8 text-white"
            />
          </motion.div>

          <p className="text-gray-600 font-medium
                         text-sm">
            Loading...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}