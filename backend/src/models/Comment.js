import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  content:   { type: String, required: true },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artwork:   { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Comment', commentSchema)