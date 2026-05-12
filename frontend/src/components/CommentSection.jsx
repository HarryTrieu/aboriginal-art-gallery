import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import CommentForm from './CommentForm'

export default function CommentSection({ artworkId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/artwork/${artworkId}`)
      setComments(res.data)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/comments/artwork/${artworkId}`)
        setComments(res.data)
      } catch (error) {
        console.error('Failed to load comments:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [artworkId])

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`)
      setComments(prev => prev.filter(c => c._id !== commentId))
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-800 mb-4">
        Comments ({comments.length})
      </h2>

      {user && (
        <CommentForm artworkId={artworkId} onCommentAdded={fetchComments} />
      )}

      {loading ? (
        <p className="text-stone-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-stone-400 mt-4">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {comments.map(comment => (
            <div key={comment._id} className="flex gap-3 items-start p-4 bg-stone-50 rounded-xl">
              {comment.user?.photoURL && (
                <img
                  src={comment.user.photoURL}
                  alt={comment.user.displayName}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-stone-700 text-sm">{comment.user?.displayName}</p>
                <p className="text-stone-600 mt-1">{comment.content}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              {(user?.role === 'admin' || user?._id === comment.user?._id) && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 text-sm px-2 py-1 rounded-md transition-all cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}