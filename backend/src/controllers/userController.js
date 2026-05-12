import User from '../models/User.js'
import admin from '../config/firebase.js'

// POST /api/users/login 
export const loginOrRegister = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = await admin.auth().verifyIdToken(token)

    // upsert: create on first login, always refresh displayName + photoURL on every login
    const user = await User.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        $set: {
          email: decoded.email,
          displayName: decoded.name,
          photoURL: decoded.picture,
        },
      },
      { upsert: true, new: true }
    )

    res.status(200).json(user)
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// GET /api/users/me
export const getMe = async (req, res) => {
  res.status(200).json(req.user)
}

// GET /api/users  (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v')
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PATCH /api/users/:id/role  (admin only)
export const updateRole = async (req, res) => {
  try {
    const { role } = req.body
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be "user" or "admin"' })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}