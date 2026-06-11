// src/components/chat/ChatPanel.jsx
import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams }                from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

// Components
import ChatHeader   from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput    from './ChatInput'

// Redux
import {
  fetchMessages,
  loadMoreMessages,
  addMessage,
  setTypingUser,
  setUserOnlineStatus,
  clearChat,
  selectMessages,
  selectTypingUsers,
  selectOnlineUsers,
  selectChatLoading,
  selectHasMore,
  selectCurrentPage,
} from '../../features/chat/chatSlice'

import { selectUser } from '../../features/auth/authSlice'

// Hooks
import { useWebSocket } from '../../hooks/useWebSocket'

export default function ChatPanel({
  isOpen,
  onClose
}) {
  const dispatch      = useDispatch()
  const { projectId } = useParams()
  const currentUser   = useSelector(selectUser)

  // Redux State
  const messages    = useSelector(selectMessages)
  const typingUsers = useSelector(selectTypingUsers)
  const onlineUsers = useSelector(selectOnlineUsers)
  const loading     = useSelector(selectChatLoading)
  const hasMore     = useSelector(selectHasMore)
  const currentPage = useSelector(selectCurrentPage)

  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef        = useRef(null)

  // ============================
  // WebSocket Handlers
  // ============================
  const handleNewMessage = useCallback((msg) => {
    dispatch(addMessage(msg))
  }, [dispatch])

  const handleTyping = useCallback((data) => {
    if (data.userId !== currentUser?.id) {
      dispatch(setTypingUser(data))
    }
  }, [dispatch, currentUser])

  const handleUserStatus = useCallback((data) => {
    dispatch(setUserOnlineStatus(data))
  }, [dispatch])

  const { isConnected, sendMessage, sendTyping } =
    useWebSocket({
      projectId,
      onMessage:    handleNewMessage,
      onTyping:     handleTyping,
      onUserStatus: handleUserStatus,
    })

  // ============================
  // Fetch Initial Messages
  // ============================
  useEffect(() => {
    if (projectId) {
      dispatch(fetchMessages({
        projectId,
        page:      0
      }))
    }
    return () => dispatch(clearChat())
  }, [projectId, dispatch])

  // ============================
  // Load More (Pagination)
  // ============================
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      dispatch(loadMoreMessages({
        projectId,
        page:      currentPage + 1
      }))
    }
  }, [hasMore, loading, projectId, currentPage])

  // ============================
  // Send Message
  // ============================
  const handleSendMessage = useCallback((
    content,
    type = 'TEXT'
  ) => {
    if (!content.trim()) return
    sendMessage(content, type)

    // Stop typing
    if (isTyping) {
      setIsTyping(false)
      sendTyping(false)
    }
  }, [sendMessage, sendTyping, isTyping])

  // ============================
  // Typing Handler
  // ============================
  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      sendTyping(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTyping(false)
    }, 2000)
  }, [isTyping, sendTyping])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{
            type:      'spring',
            damping:   25,
            stiffness: 200,
          }}
          className="fixed right-0 top-0 h-full
                      w-96 bg-white shadow-2xl
                      border-l border-gray-200
                      flex flex-col z-50"
        >
          {/* Header */}
          <ChatHeader
            isConnected={isConnected}
            onlineCount={onlineUsers.length}
            onClose={onClose}
          />

          {/* Messages */}
          <ChatMessages
            messages={messages}
            currentUser={currentUser}
            typingUsers={typingUsers}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            projectId={projectId}
          />

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onTyping={handleTypingStart}
            isConnected={isConnected}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
