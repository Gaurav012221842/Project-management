// src/components/chat/ChatMessageItem.jsx
import { useState }               from 'react'
import { useDispatch }            from 'react-redux'
import { motion }                 from 'framer-motion'
import { format }                 from 'date-fns'
import {
  TrashIcon,
  DocumentIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import { deleteMessage }
  from '../../features/chat/chatSlice'
import Avatar from '../common/Avatar'

export default function ChatMessageItem({
  message,
  isOwn,
  showAvatar,
  projectId,
}) {
  const dispatch      = useDispatch()
  const [showMenu, setShowMenu] = useState(false)

  const timeStr = message.createdAt
    ? format(new Date(message.createdAt), 'HH:mm')
    : ''
  const senderName = message.sender?.name ||
    message.sender?.username ||
    message.sender?.email ||
    'User'
  const senderAvatar = message.sender?.profilePic ||
    message.sender?.avatarUrl ||
    message.sender?.profile_pic ||
    ''

  const handleDelete = () => {
    dispatch(deleteMessage({
      projectId,
      messageId: message.id
    }))
    setShowMenu(false)
  }

  // ============================
  // File Message
  // ============================
  if (message.messageType === 'FILE' ||
      message.messageType === 'IMAGE') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`flex items-end gap-2
                     ${isOwn
                       ? 'flex-row-reverse'
                       : 'flex-row'}`}
      >
        {/* Avatar */}
        {showAvatar && !isOwn ? (
          <Avatar
            name={senderName}
            src={senderAvatar}
            size="xs"
          />
        ) : (
          <div className="w-7 flex-shrink-0" />
        )}

        <div className={`max-w-[75%]
                          ${isOwn
                            ? 'items-end'
                            : 'items-start'}
                          flex flex-col`}>
          {showAvatar && !isOwn && (
            <span className="text-xs text-gray-400
                              mb-1 ml-1">
              {senderName}
            </span>
          )}

          {/* Image Message */}
          {message.messageType === 'IMAGE' ? (
            <div className="rounded-2xl overflow-hidden
                             max-w-[200px]">
              <img
                src={message.fileUrl}
                alt="shared"
                className="w-full object-cover
                            cursor-pointer
                            hover:opacity-90
                            transition-opacity"
                onClick={() =>
                  window.open(message.fileUrl, '_blank')
                }
              />
            </div>
          ) : (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3
                           p-3 rounded-2xl border
                           cursor-pointer
                           hover:shadow-sm
                           transition-all
                           ${isOwn
                             ? 'bg-indigo-600 ' +
                               'border-indigo-500 ' +
                               'text-white'
                             : 'bg-white ' +
                               'border-gray-200 ' +
                               'text-gray-700'
                           }`}
            >
              <DocumentIcon className="w-8 h-8
                                        flex-shrink-0" />
              <div>
                <p className="text-sm font-medium
                               truncate max-w-[120px]">
                  {message.fileName || 'File'}
                </p>
                <p className={`text-xs
                                ${isOwn
                                  ? 'text-indigo-200'
                                  : 'text-gray-400'}`}>
                  Click to download
                </p>
              </div>
            </a>
          )}

          <span className="text-xs text-gray-400
                            mt-1">
            {timeStr}
          </span>
        </div>
      </motion.div>
    )
  }

  // ============================
  // Text Message
  // ============================
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 group
                   ${isOwn
                     ? 'flex-row-reverse'
                     : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isOwn ? (
        showAvatar ? (
          <Avatar
            name={senderName}
            src={senderAvatar}
            size="xs"
            className="mb-4"
          />
        ) : (
          <div className="w-7 flex-shrink-0" />
        )
      ) : null}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[75%]
                        ${isOwn
                          ? 'items-end'
                          : 'items-start'}`}>

        {/* Sender Name */}
        {showAvatar && !isOwn && (
          <span className="text-xs text-gray-400
                            mb-1 ml-3">
            {senderName}
          </span>
        )}

        <div className="relative flex items-end gap-1">
          {/* Delete Button (Own Messages) */}
          {isOwn && (
            <div className="opacity-0 group-hover:opacity-100
                             transition-opacity mb-1">
              <div className="relative">
                <button
                  onClick={() =>
                    setShowMenu(!showMenu)
                  }
                  className="p-1 text-gray-300
                              hover:text-gray-500
                              rounded transition-colors"
                >
                  <EllipsisHorizontalIcon
                    className="w-4 h-4"
                  />
                </button>

                {showMenu && (
                  <div className="absolute bottom-8
                                   right-0 bg-white
                                   rounded-xl shadow-lg
                                   border border-gray-100
                                   py-1 z-20 min-w-[100px]">
                    <button
                      onClick={handleDelete}
                      className="flex items-center
                                  gap-2 px-3 py-2
                                  text-sm text-red-500
                                  hover:bg-red-50
                                  w-full text-left
                                  transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bubble */}
          <div className={`px-4 py-2.5 rounded-2xl
                            max-w-full break-words
                            ${isOwn
                              ? 'bg-indigo-600 ' +
                                'text-white ' +
                                'rounded-br-sm'
                              : 'bg-gray-100 ' +
                                'text-gray-800 ' +
                                'rounded-bl-sm'
                            }`}>
            <p className="text-sm leading-relaxed
                           whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>

        {/* Time */}
        <span className={`text-xs text-gray-400
                           mt-1
                           ${isOwn ? 'mr-1' : 'ml-1'}`}>
          {timeStr}
        </span>
      </div>
    </motion.div>
  )
}
