import AppError from "@/errors/AppError";
import {
  createSubCategoryUsecase,
  deleteSubcategoryUsecase,
  getSubCategoryusecase,
  updateSubCategoryUsecase,
} from "@/useCase/subcategory.usecase";
import { Request, Response } from "express";

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    data.categoryId = Number(data.categoryId);
    const result = await createSubCategoryUsecase(data);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getSubCategoryusecase(page, limit);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const updateSubCategorycontroller = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    const result = await updateSubCategoryUsecase(id, req.body);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSubcategoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);
    await deleteSubcategoryUsecase(id);
    res.status(201).json({ msg: "delete sycessfully" });
  } catch (error: any) {
    throw AppError.internal(error);
  }
};
