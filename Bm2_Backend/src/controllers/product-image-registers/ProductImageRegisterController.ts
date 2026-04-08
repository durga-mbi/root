import { Request, Response, NextFunction } from "express";
import * as productImageRegisterUseCase from "../../usecases/product-image-registers/ProductImageRegisterUseCase";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const cursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;

    const result =
      await productImageRegisterUseCase.getAllProductImageRegisters(
        limit,
        cursor,
      );

    res.status(200).json({
      success: true,
      count: result.data.length,
      data: result.data,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

export const getByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
      return;
    }

    const images =
      await productImageRegisterUseCase.getProductImageRegistersByProductId(
        productId,
      );

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const image = await productImageRegisterUseCase.getProductImageRegisterById(
      parseInt(req.params.id),
    );

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};
