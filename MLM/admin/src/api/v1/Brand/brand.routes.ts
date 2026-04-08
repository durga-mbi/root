import {
  createBrandController,
  deleteBrandController,
  getBrandsController,
  updateBrandController,
} from "@/controllers/Brand.controller";
import express from "express";

export const brandRouter = express.Router();
brandRouter.post("/create", createBrandController);
brandRouter.get("/get", getBrandsController);
brandRouter.put("/update/:id", updateBrandController);
brandRouter.delete("/delete/:id", deleteBrandController);
