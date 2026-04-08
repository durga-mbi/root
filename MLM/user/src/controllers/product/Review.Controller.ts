import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma-client";
import AppError from "@/errors/AppError";

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    const { productId, rating, comment, images } = req.body;

    if (!productId || !rating) {
      throw AppError.badRequest("Product ID and rating are required");
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId: Number(productId),
        rating: Number(rating),
        comment,
        images, // Comma separated URLs
      },
    });

    res.status(201).json({ success: true, message: "Review added successfully", data: review });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId: Number(productId), status: "ACTIVE" },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
