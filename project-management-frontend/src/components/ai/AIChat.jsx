// src/components/ai/AIChat.jsx
import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  PaperAirplaneIcon,
  SparklesIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import {
  SparklesIcon as SparklesSolid,
} from '@heroicons/react/24/solid'
import {
  sendChatMessage,
  addChatMessage,
  clearChat,
  selectChatHistory,
  selectChatLoading,
} from '../../features/ai/aiSlice'
import { selectSelectedProject }
  from '../../features/project/projectSlice'

const QUICK_PROMPTS = [
  '📋 What tasks should I prioritize?',
  '🐛 How do I debug a React error?',
  '⚡ Best practices for sprint planning?',
  '🚀 How to improve team velocity?',
  '📊 Explain agile methodology',
  '🎯 How to write good acceptance criteria?',
]

export default function AIChat({ projectId }) {
  const dispatch      = useDispatch()
  const chatHistory   = useSelector(selectChatHistory)
  const isLoading     = useSelector(selectChatLoading)
  const project       = useSelector(selectSelectedProject)

  const [message,    setMessage]    = useState('')
  const [copied,     setCopied]     = useState(null)
  const bottomRef                   = useRef(null)
  const textareaRef                 = useRef(null)

  // ============================
  // Auto Scroll
  // ============================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [chatHistory])

  // ============================
  // Send Message
  // ============================
  const handleSend = useCallback(() => {
    const trimmed = message.trim()
    if (!trimmed || isLoading) return

    // Add user message
    dispatch(addChatMessage({
      role:    'user',
      content: trimmed,
    }))

    // Send to AI
    dispatch(sendChatMessage({
      message:        trimmed,
      projectContext: project?.name,
      history:        chatHistory.slice(-6),
    }))

    setMessage('')
  }, [message, isLoading, chatHistory, project, dispatch])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopy = async (text, index) => {
    await navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt)
    textareaRef.current?.focus()
  }

  return (
    <div className="bg-white rounded-2xl border
                     border-gray-100 shadow-sm
                     overflow-hidden flex flex-col"
         style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>

      {/* ======================== */}
      {/*         Header           */}
      {/* ======================== */}
      <div className="flex items-center justify-between
                       px-6 py-4 border-b border-gray-100
                       bg-gradient-to-r from-indigo-50
                       to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br
                           from-indigo-600 to-purple-600
                           rounded-xl flex items-center
                           justify-center shadow-md">
            <SparklesSolid
              className="w-5 h-5 text-white"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              AI Assistant
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400
                               rounded-full
                               animate-pulse" />
              <span className="text-xs text-gray-500">
                GPT-3.5 • Online
              </span>
            </div>
          </div>
        </div>

        {chatHistory.length > 0 && (
          <button
            onClick={() => dispatch(clearChat())}
            className="flex items-center gap-1.5
                        text-xs text-gray-400
                        hover:text-red-500
                        hover:bg-red-50 px-3 py-1.5
                        rounded-xl transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* ======================== */}
      {/*       Chat Messages      */}
      {/* ======================== */}
      <div className="flex-1 overflow-y-auto p-4
                       space-y-4">

        {/* Welcome State */}
        {chatHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y:  0 }}
            className="flex flex-col items-center
                         justify-center h-full
                         text-center py-8"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale:  [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat:   Infinity,
                ease:     'easeInOut',
              }}
              className="text-5xl mb-4"
            >
              🤖
            </motion.div>
            <h3 className="text-lg font-bold
                            text-gray-800 mb-2">
              Hello! I'm your AI Assistant
            </h3>
            <p className="text-sm text-gray-400
                           mb-6 max-w-sm">
              Ask me anything about project management,
              tasks, sprints, or best practices.
            </p>

            {/* Quick Prompts */}
            <div className="grid grid-cols-2 gap-2
                             w-full max-w-md">
              {QUICK_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y:  0 }}
                  transition={{
                    duration: 0.3,
                    delay:    i * 0.06,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98   }}
                  onClick={() =>
                    handleQuickPrompt(prompt)
                  }
                  className="px-3 py-2.5 bg-gray-50
                              hover:bg-indigo-50
                              hover:border-indigo-200
                              border border-gray-200
                              rounded-xl text-xs
                              text-gray-600
                              hover:text-indigo-700
                              transition-all text-left
                              font-medium"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence initial={false}>
          {chatHistory.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y:  0, scale: 1    }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3
                           ${msg.role === 'user'
                             ? 'flex-row-reverse'
                             : 'flex-row'
                           }`}
            >
              {/* Avatar */}
              <div className={`
                w-8 h-8 rounded-xl flex-shrink-0
                flex items-center justify-center
                ${msg.role === 'user'
                  ? 'bg-indigo-600'
                  : 'bg-gradient-to-br from-indigo-600 ' +
                    'to-purple-600'
                }
              `}>
                {msg.role === 'user'
                  ? <UserCircleIcon
                      className="w-5 h-5 text-white"
                    />
                  : <SparklesSolid
                      className="w-4 h-4 text-white"
                    />
                }
              </div>

              {/* Bubble */}
              <div className={`
                group relative max-w-[80%]
                ${msg.role === 'user'
                  ? 'items-end' : 'items-start'
                }
                flex flex-col
              `}>
                <div className={`
                  px-4 py-3 rounded-2xl text-sm
                  leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white ' +
                      'rounded-br-sm'
                    : 'bg-gray-50 text-gray-800 ' +
                      'rounded-bl-sm border ' +
                      'border-gray-100'
                  }
                `}>
                  {msg.content}
                </div>

                {/* Copy Button */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() =>
                      handleCopy(msg.content, index)
                    }
                    className="mt-1 opacity-0
                                group-hover:opacity-100
                                flex items-center gap-1
                                text-[10px] text-gray-400
                                hover:text-indigo-600
                                transition-all"
                  >
                    <ClipboardDocumentIcon
                      className="w-3 h-3"
                    />
                    {copied === index ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y:  0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl
                             bg-gradient-to-br
                             from-indigo-600 to-purple-600
                             flex items-center
                             justify-center">
              <SparklesSolid
                className="w-4 h-4 text-white"
              />
            </div>
            <div className="bg-gray-50 rounded-2xl
                             rounded-bl-sm px-4 py-3
                             border border-gray-100">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      y:       [0, -6, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat:   Infinity,
                      delay:    i * 0.15,
                    }}
                    className="w-2 h-2 bg-indigo-400
                                rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ======================== */}
      {/*         Input            */}
      {/* ======================== */}
      <div className="border-t border-gray-100 p-4
                       bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI anything..."
              rows={1}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-50
                          border border-gray-200
                          rounded-2xl text-sm resize-none
                          focus:outline-none focus:ring-2
                          focus:ring-indigo-500
                          focus:border-transparent
                          disabled:opacity-50
                          max-h-32 leading-relaxed"
              style={{ minHeight: '48px' }}
            />
          </div>

          <motion.button
            whileHover={
              message.trim() && !isLoading
                ? { scale: 1.05 } : {}
            }
            whileTap={
              message.trim() && !isLoading
                ? { scale: 0.95 } : {}
            }
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`
              w-11 h-11 rounded-2xl flex items-center
              justify-center transition-all flex-shrink-0
              ${message.trim() && !isLoading
                ? 'bg-indigo-600 text-white shadow-lg ' +
                  'shadow-indigo-200 hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-400 ' +
                  'cursor-not-allowed'
              }
            `}
          >
            {isLoading
              ? <div className="w-4 h-4 border-2
                                 border-white
                                 border-t-transparent
                                 rounded-full
                                 animate-spin" />
              : <PaperAirplaneIcon className="w-4 h-4" />
            }
          </motion.button>
        </div>

        <p className="text-[10px] text-gray-400 mt-2
                       text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}