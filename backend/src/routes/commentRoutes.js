import express from 'express'
import { getComments, addComment, deleteComment } from '../controllers/commentController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

/**
 * @swagger
 * /api/comments/artwork/{artworkId}:
 *   get:
 *     summary: Get all comments for an artwork
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: artworkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of comments with user displayName and photo populated
 */
router.get('/artwork/:artworkId', getComments)

/**
 * @swagger
 * /api/comments/artwork/{artworkId}:
 *   post:
 *     summary: Add a comment to an artwork (authenticated users)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artworkId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 *       401:
 *         description: No token provided
 */
router.post('/artwork/:artworkId', protect, addComment)

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment (author or admin)
 *     tags: [Comments]
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
 *         description: Comment deleted
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', protect, deleteComment)

export default router