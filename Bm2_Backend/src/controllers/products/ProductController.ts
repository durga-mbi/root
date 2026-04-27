import { Request, Response, NextFunction } from "express";
import * as productUseCase from "../../usecases/products/ProductUseCase";

const DEFAULT_LIMIT = 10;

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const queryData = res.locals.validatedQuery || req.query;
    const { slugs, q, minPrice, maxPrice, rating, categoryId } = queryData;

    // Pagination — supports both cursor and page-based
    const rawLimit = queryData.limit
      ? parseInt(queryData.limit as string)
      : DEFAULT_LIMIT;
    const limit =
      isNaN(rawLimit) || rawLimit < 1 ? DEFAULT_LIMIT : Math.min(rawLimit, 100);
    const cursor = queryData.cursor
      ? parseInt(queryData.cursor as string)
      : undefined;

    let result;

    if (slugs === "new-arrivals") {
      result = await productUseCase.getNewArrivals(limit, cursor);
    } else if (slugs) {
      result = await productUseCase.getProductsByCategorySlug(
        slugs as string,
        limit,
        cursor,
      );
    } else if (q || minPrice || maxPrice || rating || categoryId) {
      result = await productUseCase.getFilteredProducts({
        q,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        rating: rating ? parseFloat(rating as string) : undefined,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        limit,
        cursor,
      });
    } else {
      result = await productUseCase.getAllProductRegisters(limit, cursor);
    }

    res.status(200).json({
      success: true,
      count: result.data.length,
      total: result.totalCount,
      nextCursor: result.nextCursor ?? null,
      hasMore: result.nextCursor !== null,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const searchTerm = req.query.q as string;
    const rawLimit = req.query.limit
      ? parseInt(req.query.limit as string)
      : DEFAULT_LIMIT;
    const limit =
      isNaN(rawLimit) || rawLimit < 1 ? DEFAULT_LIMIT : Math.min(rawLimit, 100);

    if (!searchTerm || searchTerm.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Search term is required",
      });
      return;
    }

    const products = await productUseCase.searchProductRegistersByName(
      searchTerm.trim(),
      limit,
    );

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
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
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
      return;
    }

    const result = await productUseCase.getProductDetail(productId);

    res.status(200).json({
      success: true,
      data: result.product,
      relatedProducts: result.relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};