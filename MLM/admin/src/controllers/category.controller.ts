import AppError from "@/errors/AppError";
import {
  createCategoriesUsecase,
  deleteCatagoryUsecase,
  getCategoryUsecase,
  updateCategoryusecase,
} from "@/useCase/category.usecase";
import { Request, Response } from "express";

export const createCategoriescontroller = async (
  req: Request,
  res: Response,
) => {
  try {
    const data = req.body;
    const category = await createCategoriesUsecase(data);
    if (!category) {
      throw AppError.badRequest("catagory no created");
    }
    res.status(200).json({ msg: "category created sucessfully", category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getCategories = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getCategoryUsecase(page, limit);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCategorycontroller = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const category = await updateCategoryusecase(id, req.body);
    res.status(201).json({ msg: "update sucessfully", category });
  } catch (error: any) {
    throw AppError.internal(error);
  }
};
export const deleteCatagorycontroller = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteCatagoryUsecase(id);
    res.status(201).json({ msg: "Delete sucessfuly" });
  } catch (error: any) {
    throw AppError.internal(error);
  }
};
