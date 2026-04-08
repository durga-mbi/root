import { Request, Response, NextFunction } from "express";
import * as productRepo from "../../data/repositories/Product.Repository";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, subcategoryId, brandId } = req.query;
    const products = await productRepo.getAllProducts({
      categoryId: categoryId ? Number(categoryId) : undefined,
      subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
      brandId: brandId ? Number(brandId) : undefined,
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productRepo.getProductById(Number(id));
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await productRepo.getCategoriesWithHierarchy();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};
