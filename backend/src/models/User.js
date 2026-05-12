import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email:       { type: String, required: true },
  displayName: { type: String },
  photoURL:    { type: String },
  role:        { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt:   { type: Date, default: Date.now },
})

export default mongoose.model('User', userSchema)