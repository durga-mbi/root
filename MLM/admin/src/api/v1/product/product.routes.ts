import {
  createSkuConfigController,
  deleteProductController,
  getProductController,
  productControlleer,
  updateProductController,
} from "@/controllers/Product.controller";
import express from "express";

export const productRoutes = express.Router();
productRoutes.post("/configsku", createSkuConfigController);
productRoutes.post("/create", productControlleer);
productRoutes.get("/get", getProductController);
productRoutes.put("/update/:id", updateProductController);
productRoutes.delete("/delete/:id", deleteProductController);
