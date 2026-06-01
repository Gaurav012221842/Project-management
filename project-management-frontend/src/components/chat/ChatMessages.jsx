// src/components/chat/ChatMessages.jsx
import {
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatMessageItem             from './ChatMessageItem'
import TypingIndicator             from './TypingIndicator'
import { ArrowDownIcon }           from '@heroicons/react/24/outline'

export default function ChatMessages({
  messages,
  currentUser,
  typingUsers,
  loading,
  hasMore,
  onLoadMore,
  projectId,
}) {
  const bottomRef        = useRef(null)
  const containerRef     = useRef(null)
  const [showScrollBtn, setShowScrollBtn] =
    useState(false)
  const [isAtBottom, setIsAtBottom] =
    useState(true)
  const prevScrollHeight = useRef(0)

  // ============================
  // Auto Scroll to Bottom
  // ============================
  const scrollToBottom = useCallback(
    (smooth = true) => {
      bottomRef.current?.scrollIntoView({
        behavior: smooth ? 'smooth' : 'instant'
      })
    },
    []
  )

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom()
    }
  }, [messages, isAtBottom])

  // ============================
  // Scroll Detection
  // ============================
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = container

    const atBottom =
      scrollHeight - scrollTop - clientHeight < 50

    setIsAtBottom(atBottom)
    setShowScrollBtn(!atBottom)

    // Load more when near top
    if (scrollTop < 100 && hasMore && !loading) {
      prevScrollHeight.current = scrollHeight
      onLoadMore()
    }
  }, [hasMore, loading, onLoadMore])

  // Maintain scroll position after load more
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const newScrollHeight = container.scrollHeight
    const diff =
      newScrollHeight - prevScrollHeight.current

    if (diff > 0 && prevScrollHeight.current > 0) {
      container.scrollTop = diff
      prevScrollHeight.current = 0
    }
  }, [messages.length])

  // ============================
  // Group Messages by Date
  // ============================
  const groupedMessages = messages.reduce(
    (groups, msg) => {
      const date = new Date(msg.createdAt)
        .toLocaleDateString('en-US', {
          year:    'numeric',
          month:   'long',
          day:     'numeric',
        })

      if (!groups[date]) groups[date] = []
      groups[date].push(msg)
      return groups
    },
    {}
  )

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 p-4 space-y-4
                       overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-pulse
                         ${i % 2 === 0
                           ? ''
                           : 'flex-row-reverse'}`}
          >
            <div className="w-8 h-8 bg-gray-200
                             rounded-full
                             flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="w-24 h-3 bg-gray-200
                               rounded" />
              <div className={`h-10 bg-gray-100
                                rounded-2xl
                                ${i % 2 === 0
                                  ? 'w-3/4'
                                  : 'w-2/3'}`}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto
                    px-4 py-4 space-y-4
                    scroll-smooth"
      >
        {/* Load More Indicator */}
        {loading && messages.length > 0 && (
          <div className="flex justify-center py-2">
            <div className="flex items-center gap-2
                             text-xs text-gray-400">
              <div className="w-3 h-3 border-2
                               border-indigo-400
                               border-t-transparent
                               rounded-full
                               animate-spin" />
              Loading older messages...
            </div>
          </div>
        )}

        {/* No More Messages */}
        {!hasMore && messages.length > 0 && (
          <div className="flex justify-center py-2">
            <p className="text-xs text-gray-400
                           bg-gray-100 px-3 py-1
                           rounded-full">
              Beginning of conversation
            </p>
          </div>
        )}

        {/* Empty State */}
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center
                           justify-center h-full
                           text-center py-16">
            <div className="text-5xl mb-4">💬</div>
            <h4 className="font-semibold
                            text-gray-700 mb-2">
              No messages yet
            </h4>
            <p className="text-sm text-gray-400">
              Be the first to say something!
            </p>
          </div>
        )}

        {/* Messages Grouped By Date */}
        {Object.entries(groupedMessages).map(
          ([date, dayMessages]) => (
            <div key={date}>

              {/* Date Separator */}
              <div className="flex items-center
                               gap-3 my-4">
                <div className="flex-1 h-px
                                 bg-gray-100" />
                <span className="text-xs
                                  text-gray-400
                                  bg-gray-50
                                  px-3 py-1
                                  rounded-full
                                  border
                                  border-gray-100
                                  flex-shrink-0">
                  {date === new Date()
                    .toLocaleDateString('en-US', {
                      year:  'numeric',
                      month: 'long',
                      day:   'numeric',
                    })
                    ? 'Today'
                    : date
                  }
                </span>
                <div className="flex-1 h-px
                                 bg-gray-100" />
              </div>

              {/* Messages */}
              <div className="space-y-1">
                <AnimatePresence initial={false}>
                  {dayMessages.map((msg, idx) => {
                    const isOwn =
                      msg.sender?.id ===
                      currentUser?.id

                    const prevMsg =
                      dayMessages[idx - 1]
                    const showAvatar =
                      !prevMsg ||
                      prevMsg.sender?.id !==
                      msg.sender?.id

                    return (
                      <ChatMessageItem
                        key={msg.id}
                        message={msg}
                        isOwn={isOwn}
                        showAvatar={showAvatar}
                        projectId={projectId}
                      />
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          )
        )}

        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <TypingIndicator users={typingUsers} />
          )}
        </AnimatePresence>

        {/* Bottom Anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 right-4
                        w-9 h-9 bg-indigo-600
                        rounded-full shadow-lg
                        flex items-center
                        justify-center
                        text-white
                        hover:bg-indigo-700
                        transition-colors
                        z-10"
          >
            <ArrowDownIcon className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}