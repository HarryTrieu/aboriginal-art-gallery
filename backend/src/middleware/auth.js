import admin from '../config/firebase.js'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = await admin.auth().verifyIdToken(token)

    let user = await User.findOne({ firebaseUid: decoded.uid })
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name,
        photoURL: decoded.picture,
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default protect