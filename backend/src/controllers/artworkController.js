import Artwork from '../models/Artwork.js'
import Comment from '../models/Comment.js'
import cloudinary from '../config/cloudinary.js'

// GET /api/artworks?page=1&limit=12
export const getArtworks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const [artworks, total] = await Promise.all([
      Artwork.find()
        .populate('artist', 'name tribe region profileImageUrl')
        .skip(skip).limit(limit).select('-__v'),
      Artwork.countDocuments(),
    ])

    res.status(200).json({ artworks, currentPage: page, totalPages: Math.ceil(total / limit), total })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 

// GET /api/artworks/:id
export const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate('artist').select('-__v')
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' })
    res.status(200).json(artwork)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/artworks  (admin only)
export const createArtwork = async (req, res) => {
  try {
    const { title, description, medium, year, artist, tags } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })
    if (!artist) return res.status(400).json({ message: 'Artist is required' })
    if (!req.file) return res.status(400).json({ message: 'Image is required' })

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'aboriginal-art/artworks' },
        (error, result) => { if (error) reject(error); else resolve(result) }
      ).end(req.file.buffer)
    })

    const artwork = await Artwork.create({
      title, description, medium,
      year: year ? parseInt(year) : undefined,
      artist,
      imageUrl: result.secure_url,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
    })

    res.status(201).json(artwork)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/artworks/:id  (admin only)
export const updateArtwork = async (req, res) => {
  try {
    const { title, description, medium, year, artist, tags } = req.body
    const updateData = { title, description, medium, year, artist }
    if (tags) updateData.tags = tags.split(',').map(t => t.trim())

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'aboriginal-art/artworks' },
          (error, result) => { if (error) reject(error); else resolve(result) }
        ).end(req.file.buffer)
      })
      updateData.imageUrl = result.secure_url
    }

    const artwork = await Artwork.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' })

    res.status(200).json(artwork)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/artworks/:id  (admin only)
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findByIdAndDelete(req.params.id)
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' })

    await Comment.deleteMany({ artwork: req.params.id })
    res.status(200).json({ message: 'Artwork and its comments deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}