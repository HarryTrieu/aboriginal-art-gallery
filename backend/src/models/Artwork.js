import mongoose from 'mongoose'

const artworkSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  imageUrl:    { type: String, required: true },
  medium:      { type: String },
  year:        { type: Number },
  artist:      { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  tags:        [String],
  createdAt:   { type: Date, default: Date.now },
})

export default mongoose.model('Artwork', artworkSchema)