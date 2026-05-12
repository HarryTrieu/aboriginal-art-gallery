import mongoose from 'mongoose'

const artistSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  bio:             { type: String },
  tribe:           { type: String },
  region:          { type: String },
  birthYear:       { type: Number },
  profileImageUrl: { type: String },
  createdAt:       { type: Date, default: Date.now },
})

export default mongoose.model('Artist', artistSchema)