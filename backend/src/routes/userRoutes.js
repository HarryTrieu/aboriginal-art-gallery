import express from 'express'
import { loginOrRegister, getMe, getAllUsers, updateRole } from '../controllers/userController.js'
import protect from '../middleware/auth.js'
import requireAdmin from '../middleware/roles.js'

const router = express.Router()

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login or register via Firebase token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: "Bearer <Firebase ID token>"
 *     responses:
 *       200:
 *         description: Returns the MongoDB user document (creates one if first login)
 *       401:
 *         description: No token or invalid token
 */
router.post('/login', loginOrRegister)

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the currently logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user's MongoDB document
 *       401:
 *         description: No token provided
 */
router.get('/me', protect, getMe)

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of all user documents
 *       401:
 *         description: No token provided
 *       403:
 *         description: Admin access required
 */
router.get('/', protect, requireAdmin, getAllUsers)

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update a user's role (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Updated user document
 *       400:
 *         description: Invalid role value
 *       404:
 *         description: User not found
 */
router.patch('/:id/role', protect, requireAdmin, updateRole)

export default router