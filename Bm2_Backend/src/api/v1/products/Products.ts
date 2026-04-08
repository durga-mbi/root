import express from "express";
import * as productController from "../../../controllers/products/ProductController";
import validateRequest from "../../../middleware/validate-request";
import { productFilterSchema } from "../../../data/request-schemas";

const router = express.Router();

// Search products by name (Old style)
router.get("/search", productController.searchProducts);

// Get products with filters
/**
 * @openapi
 * /v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get products with filters (price, rating, category)
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products matching filters
 */
router.get(
  "/",
  validateRequest(productFilterSchema, "query"),
  productController.getAll,
);

/**
 * @openapi
 * /v1/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/:id", productController.getOne);

export default router;
