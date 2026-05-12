import Comment from '../models/Comment.js'

// GET /api/comments/artwork/:artworkId
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ artwork: req.params.artworkId })
      .populate('user', 'displayName photoURL')
      .sort({ createdAt: -1 })
      .select('-__v')

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/comments/artwork/:artworkId  (authenticated users)
export const addComment = async (req, res) => {
  try {
    const { content } = req.body
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' })
    }

    const comment = await Comment.create({
      content: content.trim(),
      user: req.user._id,
      artwork: req.params.artworkId,
    })

    const populated = await comment.populate('user', 'displayName photoURL')
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/comments/:id  (author or admin)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    const isOwner = comment.user.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' })
    }

    await comment.deleteOne()
    res.status(200).json({ message: 'Comment deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}