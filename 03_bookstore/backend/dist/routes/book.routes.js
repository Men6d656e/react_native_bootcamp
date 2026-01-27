import { Router } from "express";
import Book from "../models/Book.model.js";
import { createBook, getAllBooks, getUserBooks, deleteBook } from "../controllers/book.controller.js";
import protectRoute from "../middleware/auth.middleware.js";
const router = Router();
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book entry
 *     description: Submit a new book recommendation to the community. This includes an image which is automatically processed and optimized by Cloudinary.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, caption, rating, image]
 *             properties:
 *               title:
 *                 type: string
 *                 description: The name of the book.
 *               caption:
 *                 type: string
 *                 description: A short review or description of the book.
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Your personal score from 1 to 5.
 *               image:
 *                 type: string
 *                 description: A Base64 encoded image string for the book cover.
 *     responses:
 *       201:
 *         description: Book recommendation saved successfully.
 *       401:
 *         description: Authentication token is missing or invalid.
 */
router.post("/", protectRoute, createBook);
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Discover all books
 *     description: Fetches a list of all book recommendations available in the system. Supports high-performance pagination.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: The page number to fetch.
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         description: Number of books per page.
 *         schema: { type: integer, default: 2 }
 *     responses:
 *       200:
 *         description: A paginated list of books with metadata.
 */
router.get("/", protectRoute, getAllBooks);
/**
 * @swagger
 * /books/user:
 *   get:
 *     summary: User's personal collection
 *     description: Retrieves all books recommended by the currently logged-in user.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A collection of the user's personal recommendations.
 */
router.get("/user", protectRoute, getUserBooks);
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove a book
 *     description: Deletes a book recommendation. Note that users can only delete their own entries. The associated image will also be removed from Cloudinary.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the book entry.
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Entry and associated assets deleted.
 *       401:
 *         description: You are not authorized to delete this book.
 *       404:
 *         description: Book entry not found.
 */
router.delete("/:id", protectRoute, deleteBook);
export default router;
//# sourceMappingURL=book.routes.js.map