import express from 'express'
import multer from 'multer'
import {
  getArtworks, getArtworkById, createArtwork, updateArtwork, deleteArtwork,
} from '../controllers/artworkController.js'
import protect from '../middleware/auth.js'
import requireAdmin from '../middleware/roles.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

/**
 * @swagger
 * /api/artworks:
 *   get:
 *     summary: Get all artworks (paginated)
 *     tags: [Artworks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page (default 12)
 *     responses:
 *       200:
 *         description: Paginated list of artworks with artist populated
 */
router.get('/', getArtworks)

/**
 * @swagger
 * /api/artworks/{id}:
 *   get:
 *     summary: Get a single artwork with full artist details
 *     tags: [Artworks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artwork object with artist populated
 *       404:
 *         description: Artwork not found
 */
router.get('/:id', getArtworkById)

/**
 * @swagger
 * /api/artworks:
 *   post:
 *     summary: Create a new artwork (admin only)
 *     tags: [Artworks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, artist, image]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               medium:
 *                 type: string
 *               year:
 *                 type: integer
 *               artist:
 *                 type: string
 *                 description: MongoDB ObjectId of the artist
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Artwork created
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin access required
 */
router.post('/', protect, requireAdmin, upload.single('image'), createArtwork)

/**
 * @swagger
 * /api/artworks/{id}:
 *   put:
 *     summary: Update an artwork (admin only)
 *     tags: [Artworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               medium:
 *                 type: string
 *               year:
 *                 type: integer
 *               artist:
 *                 type: string
 *               tags:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Artwork updated
 *       404:
 *         description: Artwork not found
 */
router.put('/:id', protect, requireAdmin, upload.single('image'), updateArtwork)

/**
 * @swagger
 * /api/artworks/{id}:
 *   delete:
 *     summary: Delete an artwork and its comments (admin only)
 *     tags: [Artworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artwork and its comments deleted
 *       404:
 *         description: Artwork not found
 */
router.delete('/:id', protect, requireAdmin, deleteArtwork)

export default router