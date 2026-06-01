// src/pages/chat/ChatPage.jsx
import { useState }               from 'react'
import { useParams }              from 'react-router-dom'
import { motion }                 from 'framer-motion'
import {
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import ChatPanel from '../../components/chat/ChatPanel'

export default function ChatPage() {
  const { projectId } = useParams()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50
                     flex items-center
                     justify-center">

      {/* Toggle Button (for embedded use) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6
                    w-14 h-14 bg-indigo-600
                    rounded-full shadow-xl
                    flex items-center justify-center
                    text-white z-40
                    hover:bg-indigo-700
                    transition-colors"
      >
        <ChatBubbleLeftRightIcon
          className="w-6 h-6"
        />
      </motion.button>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}