// src/components/chat/ChatHeader.jsx
import { useState }      from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'

export default function ChatHeader({
  isConnected,
  onlineCount,
  onClose,
  onSearch,
  onStartCall,
}) {
  const [showSearch, setShowSearch] = useState(false)
  const [showCallOptions, setShowCallOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) onSearch(query)
  }

  return (
    <div className="flex-shrink-0 bg-white
                     border-b border-gray-100">

      {/* Main Header */}
      <div className="flex items-center
                       justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100
                           rounded-xl flex items-center
                           justify-center">
            <ChatBubbleLeftRightIcon
              className="w-5 h-5 text-indigo-600"
            />
          </div>
          <div>
            <h3 className="font-semibold
                            text-gray-900 text-sm">
              Team Chat
            </h3>
            <div className="flex items-center
                             gap-1.5">
              {/* Connection Status */}
              <div className={`w-2 h-2 rounded-full
                                ${isConnected
                                  ? 'bg-green-400'
                                  : 'bg-gray-300'
                                }`} />
              <span className="text-xs text-gray-400">
                {isConnected
                  ? `${onlineCount} online`
                  : 'Connecting...'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setShowCallOptions(!showCallOptions)}
              className="p-2 rounded-lg text-gray-400
                          hover:text-gray-600
                          hover:bg-gray-100
                          transition-colors"
              title="Start a call"
            >
              <PhoneIcon className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showCallOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-20"
                >
                  <button
                    onClick={() => {
                      setShowCallOptions(false)
                      onStartCall?.('audio')
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    Audio call
                  </button>
                  <button
                    onClick={() => {
                      setShowCallOptions(false)
                      onStartCall?.('video')
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <VideoCameraIcon className="w-4 h-4" />
                    Video call
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg text-gray-400
                        hover:text-gray-600
                        hover:bg-gray-100
                        transition-colors"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400
                        hover:text-gray-600
                        hover:bg-gray-100
                        transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-3"
        >
          <div className="relative">
            <MagnifyingGlassIcon
              className="absolute left-3 top-1/2
                          -translate-y-1/2 w-4 h-4
                          text-gray-400"
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
              className="w-full pl-9 pr-4 py-2
                          bg-gray-50 border border-gray-200
                          rounded-lg text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                          focus:border-transparent"
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}