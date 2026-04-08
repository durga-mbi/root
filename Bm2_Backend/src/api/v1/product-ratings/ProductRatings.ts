import express from "express";
import * as productRatingController from "../../../controllers/product-ratings/ProductRatingController";
import validateRequest from "../../../middleware/validate-request";
import {
  createProductRatingSchema,
  updateProductRatingSchema,
} from "../../../data/request-schemas";

const router = express.Router();

// Get rating statistics for a product
router.get("/product/:productId/stats", productRatingController.getStats);

// Get all ratings for a specific product
router.get("/product/:productId", productRatingController.getByProductId);

// Get all product ratings
router.get("/", productRatingController.getAll);

// Get product rating by ID
router.get("/:id", productRatingController.getOne);

// Create a new product rating
router.post(
  "/",
  validateRequest(createProductRatingSchema),
  productRatingController.create,
);

// Update a product rating
router.put(
  "/:id",
  validateRequest(updateProductRatingSchema),
  productRatingController.update,
);

// Delete a product rating
router.delete("/:id", productRatingController.remove);

export default router;
