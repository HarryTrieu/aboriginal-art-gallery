import express from 'express'
import multer from 'multer'
import {
  getArtists, getArtistById, createArtist, updateArtist, deleteArtist,
} from '../controllers/artistController.js'
import protect from '../middleware/auth.js'
import requireAdmin from '../middleware/roles.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Get all artists (paginated)
 *     tags: [Artists]
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
 *         description: Results per page (default 10)
 *     responses:
 *       200:
 *         description: List of artists with pagination metadata
 */
router.get('/', getArtists)

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Get an artist and all their artworks
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artist object with artworks array
 *       404:
 *         description: Artist not found
 */
router.get('/:id', getArtistById)

/**
 * @swagger
 * /api/artists:
 *   post:
 *     summary: Create a new artist (admin only)
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               tribe:
 *                 type: string
 *               region:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Artist created
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin access required
 */
router.post('/', protect, requireAdmin, upload.single('profileImage'), createArtist)

/**
 * @swagger
 * /api/artists/{id}:
 *   put:
 *     summary: Update an artist (admin only)
 *     tags: [Artists]
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
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               tribe:
 *                 type: string
 *               region:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Artist updated
 *       404:
 *         description: Artist not found
 */
router.put('/:id', protect, requireAdmin, upload.single('profileImage'), updateArtist)

/**
 * @swagger
 * /api/artists/{id}:
 *   delete:
 *     summary: Delete an artist and all their artworks and comments (admin only)
 *     tags: [Artists]
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
 *         description: Artist and all related content deleted
 *       404:
 *         description: Artist not found
 */
router.delete('/:id', protect, requireAdmin, deleteArtist)

export default router