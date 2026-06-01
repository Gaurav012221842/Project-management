// src/components/comment/CommentForm.jsx
import React, { useState } from 'react'
import Avatar from '../common/Avatar/Avatar'
import Button from '../common/Button/Button'

function CommentForm({ user, onSubmit, placeholder = 'Write a comment...', autoFocus = false }) {
  const [text,    setText]    = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    await onSubmit?.(text.trim())
    setText('')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Avatar name={user?.name || user?.username || 'U'} src={user?.avatarUrl} size="sm" className="mt-0.5" />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={2}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e)
          }}
        />
        {text.trim() && (
          <div className="flex justify-end mt-1.5">
            <Button type="submit" size="sm" loading={loading}>Post</Button>
          </div>
        )}
      </div>
    </form>
  )
}

export default CommentForm
