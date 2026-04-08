import express from "express";
import * as categoryController from "../../../controllers/categories/CategoryController";

const router = express.Router();

// Get all categories
/**
 * @openapi
 * /v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", categoryController.getAll);

/**
 * @openapi
 * /v1/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 */
router.get("/:id", categoryController.getOne);

export default router;
