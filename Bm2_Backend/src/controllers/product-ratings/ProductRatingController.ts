import { Request, Response, NextFunction } from "express";
import * as productRatingUseCase from "../../usecases/product-ratings/ProductRatingUseCase";

const mapProductRatingResponse = (rating: any) => ({
  id: rating.id,
  productId: rating.productId,
  totalRatings: rating.totalRatings,
  givenRatings: rating.givenRatings,
  message: rating.message,
  customerName: rating.customer?.fullName ?? "Anonymous",
  customerAvatar: rating.customer?.profileImage ?? null,
  reviewDate: rating.createdAt ? rating.createdAt.toISOString() : null,
  reviewImages: (rating.reviewImages ?? []).map((img: any) => ({
    url: img.url,
    cloudinaryPublicId: img.cloudinaryPublicId,
  })),
});

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsedLimit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const parsedCursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;

    const limit = isNaN(parsedLimit as any) ? undefined : parsedLimit;
    const cursor = isNaN(parsedCursor as any) ? undefined : parsedCursor;

    const result = await productRatingUseCase.getAllProductRatings(
      limit,
      cursor,
    );

    const data = result.data.map(mapProductRatingResponse);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
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
    const parsedLimit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const parsedCursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;

    const limit = isNaN(parsedLimit as any) ? undefined : parsedLimit;
    const cursor = isNaN(parsedCursor as any) ? undefined : parsedCursor;

    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
      return;
    }

    const result = await productRatingUseCase.getProductRatingsByProductId(
      productId,
      limit,
      cursor,
    );

    const data = result.data.map(mapProductRatingResponse);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
      nextCursor: result.nextCursor,
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID." });
      return;
    }
    const rating = await productRatingUseCase.getProductRatingById(id);

    res.status(200).json({
      success: true,
      data: mapProductRatingResponse(rating),
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { productId, totalRatings, givenRatings, message, createdBy } =
      req.body;

    const rating = await productRatingUseCase.createProductRating({
      productId,
      totalRatings,
      givenRatings,
      message,
      createdBy,
      reviewImages: req.body.reviewImages,
    });

    res.status(201).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID." });
      return;
    }
    const { productId, totalRatings, givenRatings, message, updatedBy } =
      req.body;

    const rating = await productRatingUseCase.updateProductRating(id, {
      productId,
      totalRatings,
      givenRatings,
      message,
      updatedBy,
    });

    res.status(200).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID." });
      return;
    }
    await productRatingUseCase.deleteProductRating(id);

    res.status(200).json({
      success: true,
      message: "Product rating deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
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

    const stats = await productRatingUseCase.getProductRatingStats(productId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
