import AppError from "@/errors/AppError";
import {
  createProductUsecase,
  createConfig,
  deleteProductusecase,
  getProductUsecase,
  updaateProductUsecase,
} from "@/useCase/product.usecase";
import { Request, Response } from "express";

export const createSkuConfigController = async (
  req: Request,
  res: Response,
) => {
  try {
    const data = req.body;

    const sku = await createConfig(data);
    res.status(200).json({
      msg: "sku created successfully",
      sku,
    });
  } catch (error) {
    throw AppError.internal(error as any);
  }
};
export const productControlleer = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const data = req.body;
    data.categoryId = Number(data.categoryId);
    data.subcategoryId = Number(data.subcategoryId);
    data.brandId = Number(data.brandId);
    const product = await createProductUsecase(data);
    res.status(201).json({ msg: "product created sucessfully", product });
  } catch (error) {
    throw AppError.internal(error as any);
  }
};

export const getProductController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getProductUsecase(page, limit);
    res.status(201).json({ msg: "product fetch sucessfully", result });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log(id);

    const result = await updaateProductUsecase(id, req.body);

    res.status(200).json({ msg: "updaated sucessfuly", result });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log(id);

    const result = await deleteProductusecase(id);

    res.json({ msg: "delete sucessfully" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
