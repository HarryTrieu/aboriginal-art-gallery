import Artist from '../models/Artist.js'
import Artwork from '../models/Artwork.js'
import Comment from '../models/Comment.js'
import cloudinary from '../config/cloudinary.js'

// GET /api/artists?page=1&limit=10
export const getArtists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [artists, total] = await Promise.all([
      Artist.find().sort({ name: 1 }).skip(skip).limit(limit).select('-__v'),
      Artist.countDocuments(),
    ])

    res.status(200).json({ artists, currentPage: page, totalPages: Math.ceil(total / limit), total })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/artists/:id
export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).select('-__v')
    if (!artist) return res.status(404).json({ message: 'Artist not found' })

    const artworks = await Artwork.find({ artist: req.params.id }).select('-__v')
    res.status(200).json({ artist, artworks })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/artists  (admin only)
export const createArtist = async (req, res) => {
  try {
    const { name, bio, tribe, region, birthYear } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })

    const existing = await Artist.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } })
    if (existing) return res.status(409).json({ message: `An artist named "${name}" already exists` })

    let profileImageUrl = ''
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'aboriginal-art/artists' },
          (error, result) => { if (error) reject(error); else resolve(result) }
        ).end(req.file.buffer)
      })
      profileImageUrl = result.secure_url
    }

    const artist = await Artist.create({
      name, bio, tribe, region,
      birthYear: birthYear ? parseInt(birthYear) : undefined,
      profileImageUrl,
    })

    res.status(201).json(artist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/artists/:id  (admin only)
export const updateArtist = async (req, res) => {
  try {
    const { name, bio, tribe, region, birthYear } = req.body
    const updateData = { name, bio, tribe, region, birthYear }

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'aboriginal-art/artists' },
          (error, result) => { if (error) reject(error); else resolve(result) }
        ).end(req.file.buffer)
      })
      updateData.profileImageUrl = result.secure_url
    }

    const artist = await Artist.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (!artist) return res.status(404).json({ message: 'Artist not found' })

    res.status(200).json(artist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/artists/:id  (admin only)
export const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id)
    if (!artist) return res.status(404).json({ message: 'Artist not found' })

    const artworks = await Artwork.find({ artist: req.params.id })
    const artworkIds = artworks.map(a => a._id)
    await Comment.deleteMany({ artwork: { $in: artworkIds } })
    await Artwork.deleteMany({ artist: req.params.id })

    res.status(200).json({ message: 'Artist and all related content deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}