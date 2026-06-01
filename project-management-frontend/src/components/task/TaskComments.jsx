// src/components/task/TaskComments.jsx
import { useState }                 from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion'
import { formatDistanceToNow }      from 'date-fns'
import {
  PaperAirplaneIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline'
import {
  addComment,
  deleteComment,
  selectTaskComments,
  selectCommentLoading,
} from '../../features/task/taskSlice'
import { selectUser }
  from '../../features/auth/authSlice'

export default function TaskComments({ task }) {
  const dispatch = useDispatch()
  const user     = useSelector(selectUser)
  const comments = useSelector(
    selectTaskComments(task.id)
  )
  const isLoading = useSelector(selectCommentLoading)

  const [content,    setContent]    = useState('')
  const [replyTo,    setReplyTo]    = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    dispatch(addComment({
      taskId:   task.id,
      content:  content.trim(),
      parentId: replyTo?.id || null,
    }))
    setContent('')
    setReplyTo(null)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-2">
        <ChatBubbleLeftIcon
          className="w-5 h-5 text-gray-400"
        />
        <h3 className="text-sm font-bold
                        text-gray-700">
          Comments
        </h3>
        <span className="text-xs text-gray-400
                          bg-gray-100 px-2 py-0.5
                          rounded-full font-medium">
          {comments.length}
        </span>
      </div>

      {/* Comment Input */}
      <div className="bg-gray-50 rounded-2xl p-4">
        {replyTo && (
          <div className="flex items-center
                           justify-between mb-3
                           bg-white rounded-xl
                           px-3 py-2 text-xs
                           text-gray-500 border
                           border-gray-100">
            <span>
              Replying to{' '}
              <span className="font-semibold
                                text-gray-700">
                {replyTo.user?.name}
              </span>
            </span>
            <button
              onClick={() => setReplyTo(null)}
              className="text-gray-400
                          hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl
                           bg-indigo-200 flex
                           items-center justify-center
                           text-indigo-700 text-sm
                           font-bold flex-shrink-0
                           mb-0.5">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Input */}
          <div className="flex-1 relative">
            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' &&
                    !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder={
                replyTo
                  ? `Reply to ${replyTo.user?.name}...`
                  : 'Add a comment...'
              }
              rows={1}
              className="w-full px-4 py-3 bg-white
                          border border-gray-200
                          rounded-xl text-sm resize-none
                          focus:outline-none focus:ring-2
                          focus:ring-indigo-500
                          max-h-32"
              style={{ minHeight: '44px' }}
            />
          </div>

          {/* Send Button */}
          <motion.button
            type="submit"
            disabled={!content.trim() || isLoading}
            whileHover={content.trim()
              ? { scale: 1.05 } : {}}
            whileTap={content.trim()
              ? { scale: 0.95 } : {}}
            className={`
              w-10 h-10 rounded-xl flex items-center
              justify-center mb-0.5 flex-shrink-0
              transition-all
              ${content.trim()
                ? 'bg-indigo-600 text-white ' +
                  'hover:bg-indigo-700 shadow-md'
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
        </form>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center
                         justify-center py-12
                         text-center">
          <div className="text-4xl mb-3">💬</div>
          <h4 className="font-semibold text-gray-600
                          mb-1">
            No comments yet
          </h4>
          <p className="text-sm text-gray-400">
            Be the first to comment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {comments
              .filter(c => !c.parentId)
              .map((comment, index) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  replies={comments.filter(
                    c => c.parentId === comment.id
                  )}
                  taskId={task.id}
                  currentUser={user}
                  onReply={setReplyTo}
                  index={index}
                />
              ))
            }
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ============================
// Comment Item
// ============================
function CommentItem({
  comment,
  replies,
  taskId,
  currentUser,
  onReply,
  index,
}) {
  const dispatch = useDispatch()
  const isOwn    =
    comment.user?.id === currentUser?.id

  const handleDelete = () => {
    dispatch(deleteComment({
      taskId,
      commentId: comment.id,
    }))
  }

  const timeAgo = comment.createdAt
    ? formatDistanceToNow(
        new Date(comment.createdAt),
        { addSuffix: true }
      )
    : 'just now'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y:  0 }}
      exit={{ opacity: 0              }}
      transition={{
        duration: 0.3,
        delay:    index * 0.05,
      }}
      className="flex gap-3 group"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl flex-shrink-0
                       bg-indigo-100 flex items-center
                       justify-center text-indigo-700
                       text-sm font-bold">
        {comment.user?.name?.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center
                         justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold
                              text-gray-900">
              {comment.user?.name}
            </span>
            <span className="text-xs text-gray-400">
              {timeAgo}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1
                           opacity-0 group-hover:opacity-100
                           transition-opacity">
            <button
              onClick={() => onReply(comment)}
              className="text-xs text-indigo-500
                          hover:text-indigo-700
                          font-medium px-2 py-1
                          rounded-lg hover:bg-indigo-50
                          transition-colors"
            >
              Reply
            </button>
            {isOwn && (
              <button
                onClick={handleDelete}
                className="p-1 rounded-lg
                            text-gray-400
                            hover:text-red-500
                            hover:bg-red-50
                            transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-2xl
                         rounded-tl-sm px-4 py-3
                         text-sm text-gray-700
                         leading-relaxed
                         whitespace-pre-wrap">
          {comment.content}
        </div>

        {/* Replies */}
        {replies?.length > 0 && (
          <div className="mt-3 ml-4 space-y-3
                           border-l-2 border-gray-100
                           pl-4">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="flex gap-3 group"
              >
                <div className="w-6 h-6 rounded-lg
                                 flex-shrink-0
                                 bg-purple-100 flex
                                 items-center
                                 justify-center
                                 text-purple-700
                                 text-xs font-bold">
                  {reply.user?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center
                                   gap-2 mb-1">
                    <span className="text-xs font-semibold
                                      text-gray-900">
                      {reply.user?.name}
                    </span>
                    <span className="text-[10px]
                                      text-gray-400">
                      {reply.createdAt
                        ? formatDistanceToNow(
                            new Date(reply.createdAt),
                            { addSuffix: true }
                          )
                        : 'just now'
                      }
                    </span>
                  </div>
                  <div className="bg-gray-50
                                   rounded-xl
                                   rounded-tl-sm
                                   px-3 py-2 text-xs
                                   text-gray-700
                                   leading-relaxed">
                    {reply.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}