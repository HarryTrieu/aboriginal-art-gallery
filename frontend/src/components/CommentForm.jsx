import { useState } from 'react'
import api from '../services/api'

export default function CommentForm({ artworkId, onCommentAdded }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      setSubmitting(true)
      await api.post(`/comments/artwork/${artworkId}`, { content })
      setContent('')
      onCommentAdded()
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={2}
        className="flex-1 border border-stone-300 rounded-lg px-4 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50 self-end"
      >
        Post
      </button>
    </form>
  )
}