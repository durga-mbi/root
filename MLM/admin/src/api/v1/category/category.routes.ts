import {
  createCategoriescontroller,
  deleteCatagorycontroller,
  getCategories,
  updateCategorycontroller,
} from "@/controllers/category.controller";
import express from "express";
export const categoryRouter = express.Router();
categoryRouter.post("/create", createCategoriescontroller);
categoryRouter.get("/get", getCategories);
categoryRouter.put("/update/:id", updateCategorycontroller);
categoryRouter.delete("/delete/:id", deleteCatagorycontroller);
