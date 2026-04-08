import express from "express";
import * as productController from "../../../controllers/products/ProductController";

const router = express.Router();

// Search product registers by name: GET /product-register/search?q=term&limit=50
router.get("/search", productController.searchProducts);

// Get all product registers (optional: ?slugs=new-arrivals or ?slugs=category-slug, ?limit=20, ?cursor=id)
router.get("/", productController.getAll);

// Get product register by ID
router.get("/:id", productController.getOne);

export default router;
