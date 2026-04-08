import express from "express";
import * as productImageRegisterController from "../../../controllers/product-image-registers/ProductImageRegisterController";

const router = express.Router();

// Get all product image registers (?limit=50, ?cursor=id)
router.get("/", productImageRegisterController.getAll);

// Get product image registers by product ID
router.get(
  "/product/:productId",
  productImageRegisterController.getByProductId,
);

// Get product image register by ID
router.get("/:id", productImageRegisterController.getOne);

export default router;
