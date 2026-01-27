import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with an encrypted password and a default avatar. Use this to onboard new users to the platform.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: 
 *                 type: string
 *                 description: A unique handle for the user (minimum 3 chars).
 *               email: 
 *                 type: string
 *                 format: email
 *                 description: A valid email address for account verification and recovery.
 *               password: 
 *                 type: string
 *                 format: password
 *                 description: A strong password (minimum 6 chars).
 *     responses:
 *       201:
 *         description: Account created successfully. Returns JWT and user details.
 *       400:
 *         description: Validation error or account already exists.
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns a JSON Web Token (JWT) which must be used for protected routes.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Success. Authentication token provided in the response.
 *       400:
 *         description: Invalid email or password.
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     description: Ends the user session by clearing the authentication token cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Session terminated successfully.
 */
router.post("/logout", logout);

export default router;