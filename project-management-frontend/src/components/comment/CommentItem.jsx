// src/components/comment/CommentItem.jsx
import React, { useState } from 'react'
import Avatar        from '../common/Avatar/Avatar'
import CommentActions from './CommentActions'
import { formatRelative } from '../../utils/dateUtils'

function CommentItem({ comment, currentUser, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [text,    setText]    = useState(comment.content || '')
  const isOwner = currentUser?.id === comment.author?.id

  const handleSave = () => {
    onEdit?.(comment.id, text)
    setEditing(false)
  }

  return (
    <div className="flex gap-3 group">
      <Avatar name={comment.author?.name || comment.author?.username} src={comment.author?.avatarUrl} size="sm" className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-gray-800">{comment.author?.name || comment.author?.username}</span>
          <span className="text-xs text-gray-400">{formatRelative(comment.createdAt)}</span>
          <CommentActions
            canEdit={isOwner}
            canDelete={isOwner}
            onEdit={() => setEditing(true)}
            onDelete={() => onDelete?.(comment.id)}
          />
        </div>
        {editing ? (
          <div className="mt-1 space-y-1.5">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Save</button>
              <button onClick={() => { setEditing(false); setText(comment.content) }} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="mt-0.5 text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        )}
      </div>
    </div>
  )
}

export default CommentItem
