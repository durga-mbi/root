import AppError from "@/errors/AppError";
import {
  createBrandUsecase,
  deleteBrandusecase,
  getBrandUsecase,
  updateBrandusease,
} from "@/useCase/brand.usecase";
import { Request, Response } from "express";
export const createBrandController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    data.subcategoryId = Number(data.subcategoryId);
    const brand = await createBrandUsecase(data);
    res.status(200).json({ msg: "brand creaded sucessfully", brand });
  } catch (error) {
    throw AppError.internal(error as any);
  }
};

export const getBrandsController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getBrandUsecase(page, limit);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBrandController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const result = await updateBrandusease(id, req.body);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBrandController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const result = await deleteBrandusecase(id);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
