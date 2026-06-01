// src/components/chat/ChatInput.jsx
import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'

// Simple Emoji List
const EMOJIS = [
  '😀','😂','❤️','👍','👎','🎉',
  '🔥','✅','❌','🚀','💡','⭐',
  '😅','🤔','😎','👏','🙌','💪',
]

export default function ChatInput({
  onSendMessage,
  onTyping,
  isConnected,
}) {
  const [message, setMessage]       = useState('')
  const [showEmoji, setShowEmoji]   = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef                 = useRef(null)
  const fileInputRef                = useRef(null)

  // ============================
  // Auto Resize Textarea
  // ============================
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height =
      Math.min(ta.scrollHeight, 120) + 'px'
  }, [message])

  // ============================
  // Send Message
  // ============================
  const handleSend = useCallback(() => {
    const trimmed = message.trim()
    if (!trimmed || !isConnected) return
    onSendMessage(trimmed)
    setMessage('')
    textareaRef.current?.focus()
  }, [message, isConnected, onSendMessage])

  // ============================
  // Key Handler
  // ============================
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  // ============================
  // Change Handler
  // ============================
  const handleChange = useCallback((e) => {
    setMessage(e.target.value)
    if (onTyping) onTyping()
  }, [onTyping])

  // ============================
  // Emoji Insert
  // ============================
  const insertEmoji = useCallback((emoji) => {
    const ta    = textareaRef.current
    const start = ta?.selectionStart || 0
    const end   = ta?.selectionEnd   || 0
    const newMsg =
      message.slice(0, start) +
      emoji +
      message.slice(end)
    setMessage(newMsg)
    setShowEmoji(false)
    ta?.focus()
  }, [message])

  // ============================
  // File Upload
  // ============================
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    const isImage = file.type.startsWith('image/')
    onSendMessage(
      file.name,
      isImage ? 'IMAGE' : 'FILE'
    )
    e.target.value = ''
  }, [onSendMessage])

  // ============================
  // Drag & Drop
  // ============================
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const isImage = file.type.startsWith('image/')
      onSendMessage(
        file.name,
        isImage ? 'IMAGE' : 'FILE'
      )
    }
  }

  const canSend =
    message.trim().length > 0 && isConnected

  return (
    <div
      className={`flex-shrink-0 bg-white
                   border-t border-gray-100 p-4
                   ${isDragging
                     ? 'border-indigo-400 ' +
                       'bg-indigo-50'
                     : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mb-3 p-3 bg-white rounded-xl
                        border border-gray-200
                        shadow-lg"
          >
            <div className="grid grid-cols-9 gap-1">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="text-xl p-1 rounded
                              hover:bg-gray-100
                              transition-colors
                              leading-none"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag Overlay Text */}
      {isDragging && (
        <div className="text-center text-sm
                         text-indigo-600 font-medium
                         mb-2">
          📎 Drop file to share
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2">

        {/* Action Buttons */}
        <div className="flex gap-1 mb-1">
          {/* Emoji */}
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className={`p-2 rounded-lg
                         transition-colors
                         ${showEmoji
                           ? 'text-indigo-600 ' +
                             'bg-indigo-50'
                           : 'text-gray-400 ' +
                             'hover:text-gray-600 ' +
                             'hover:bg-gray-100'
                         }`}
          >
            <FaceSmileIcon className="w-5 h-5" />
          </button>

          {/* File Upload */}
          <button
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="p-2 rounded-lg text-gray-400
                        hover:text-gray-600
                        hover:bg-gray-100
                        transition-colors"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isConnected
                ? 'Type a message...'
                : 'Connecting...'
            }
            disabled={!isConnected}
            rows={1}
            className="w-full resize-none px-4 py-3
                        bg-gray-50 border border-gray-200
                        rounded-2xl text-sm
                        placeholder-gray-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                        focus:border-transparent
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        max-h-[120px]
                        leading-relaxed"
          />
        </div>

        {/* Send Button */}
        <motion.button
          whileHover={canSend
            ? { scale: 1.05 }
            : {}
          }
          whileTap={canSend
            ? { scale: 0.95 }
            : {}
          }
          onClick={handleSend}
          disabled={!canSend}
          className={`p-3 rounded-2xl mb-0.5
                       transition-all duration-200
                       flex-shrink-0
                       ${canSend
                         ? 'bg-indigo-600 ' +
                           'text-white ' +
                           'shadow-md ' +
                           'hover:bg-indigo-700 ' +
                           'hover:shadow-lg'
                         : 'bg-gray-100 ' +
                           'text-gray-400 ' +
                           'cursor-not-allowed'
                       }`}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-400
                     mt-2 text-center">
        Press <kbd className="bg-gray-100 px-1
                               rounded text-gray-500">
          Enter
        </kbd> to send •{' '}
        <kbd className="bg-gray-100 px-1 rounded
                         text-gray-500">
          Shift+Enter
        </kbd>{' '}
        for new line
      </p>
    </div>
  )
}