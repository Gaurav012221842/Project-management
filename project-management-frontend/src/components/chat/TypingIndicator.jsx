// src/components/chat/TypingIndicator.jsx
import { motion } from 'framer-motion'

export default function TypingIndicator({ users }) {
  if (!users || users.length === 0) return null

  const text =
    users.length === 1
      ? `${users[0].userName} is typing`
      : users.length === 2
        ? `${users[0].userName} and ${users[1].userName} are typing`
        : `${users.length} people are typing`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 px-2"
    >
      {/* Avatar Stack */}
      <div className="flex -space-x-1">
        {users.slice(0, 3).map((user, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full
                        bg-indigo-200 border-2
                        border-white flex items-center
                        justify-center text-xs
                        font-bold text-indigo-600"
          >
            {user.userName?.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>

      {/* Typing Bubble */}
      <div className="flex items-center gap-2
                       bg-gray-100 rounded-2xl
                       rounded-bl-sm px-4 py-2.5">
        {/* Dots Animation */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y:       [0, -4, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat:   Infinity,
                delay:    i * 0.15,
              }}
              className="w-1.5 h-1.5 bg-gray-400
                          rounded-full"
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {text}...
        </span>
      </div>
    </motion.div>
  )
}