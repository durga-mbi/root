import {
  createSubCategory,
  deleteSubcategoryController,
  getSubCategories,
  updateSubCategorycontroller,
} from "@/controllers/subcategory.controller";
import express from "express";

export const subcategoryRouter = express.Router();

subcategoryRouter.post("/create", createSubCategory);
subcategoryRouter.get("/get", getSubCategories);
subcategoryRouter.put("/update/:id", updateSubCategorycontroller);
subcategoryRouter.delete("/delete/:id", deleteSubcategoryController);
