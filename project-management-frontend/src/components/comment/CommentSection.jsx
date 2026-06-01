// src/components/comment/CommentSection.jsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../features/auth/authSlice'
import CommentItem from './CommentItem'
import CommentForm from './CommentForm'
import Skeleton    from '../common/Loader/Skeleton'
import commentService from '../../services/api/commentService'
import { useState } from 'react'

function CommentSection({ taskId }) {
  const dispatch   = useDispatch()
  const user       = useSelector(selectUser)
  const [comments, setComments] = useState([])
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (!taskId) return
    setLoading(true)
    commentService.getComments(taskId)
      .then(res => setComments(res.data?.content || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [taskId])

  const handleAdd = async (content) => {
    const res = await commentService.createComment(taskId, { content })
    setComments(prev => [...prev, res.data])
  }

  const handleEdit = async (id, content) => {
    await commentService.updateComment(id, { content })
    setComments(prev => prev.map(c => c.id === id ? { ...c, content } : c))
  }

  const handleDelete = async (id) => {
    await commentService.deleteComment(id)
    setComments(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700">Comments ({comments.length})</h4>
      <CommentForm user={user} onSubmit={handleAdd} />
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} lines={2} />)}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
