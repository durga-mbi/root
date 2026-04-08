import prisma from "../../../prisma-client";
import {
  ProductRating as PrismaProductRating,
  Prisma,
  ProductRatingImage as PrismaProductRatingImage,
} from "@prisma/client";

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
}

export interface CreateProductRatingData {
  productId?: number;
  totalRatings?: number;
  givenRatings?: number;
  message?: string;
  createdBy?: number;
}

export interface UpdateProductRatingData {
  productId?: number;
  totalRatings?: number;
  givenRatings?: number;
  message?: string;
  updatedBy?: number;
}

export interface CreateProductRatingImageData {
  url: string;
  cloudinaryPublicId?: string | null;
}

export const getProductRatingById = async (
  id: number,
): Promise<PrismaProductRating | null> => {
  return prisma.productRating.findUnique({
    where: { id },
  });
};

export const getProductRatingsByProductId = async (
  productId: number,
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<PrismaProductRating>> => {
  const take = limit + 1;

  const where: Prisma.ProductRatingWhereInput = { productId };
  const ratings = await prisma.productRating.findMany({
    where: cursor ? { ...where, id: { lt: cursor } } : where,
    include: {
      customer: {
        select: {
          fullName: true,
          profileImage: true,
        },
      },
      reviewImages: true,
    },
    orderBy: { createdAt: "desc" },
    take,
  });

  const hasMore = ratings.length > limit;
  const data = hasMore ? ratings.slice(0, limit) : ratings;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor };
};

export const getAllProductRatings = async (
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<PrismaProductRating>> => {
  const take = limit + 1;

  const ratings = await prisma.productRating.findMany({
    where: cursor ? { id: { lt: cursor } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: {
          fullName: true,
          profileImage: true,
        },
      },
      reviewImages: true,
    },
    take,
  });

  const hasMore = ratings.length > limit;
  const data = hasMore ? ratings.slice(0, limit) : ratings;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor };
};

export const createProductRating = async (
  data: CreateProductRatingData,
): Promise<PrismaProductRating> => {
  return prisma.productRating.create({
    data: {
      productId: data.productId,
      totalRatings: data.totalRatings,
      givenRatings: data.givenRatings,
      message: data.message,
      createdBy: data.createdBy,
    },
  });
};

export const createProductRatingImages = async (
  productRatingId: number,
  images: CreateProductRatingImageData[],
): Promise<number> => {
  if (images.length === 0) {
    return 0;
  }

  const data = images.map((image) => ({
    productRatingId,
    url: image.url,
    cloudinaryPublicId: image.cloudinaryPublicId,
  }));

  const result = await prisma.productRatingImage.createMany({
    data,
  });

  return result.count;
};

export const getProductRatingByIdWithRelations = async (
  id: number,
): Promise<PrismaProductRating | null> => {
  return prisma.productRating.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          fullName: true,
          profileImage: true,
        },
      },
      reviewImages: true,
    },
  });
};

export const updateProductRating = async (
  id: number,
  data: UpdateProductRatingData,
): Promise<PrismaProductRating> => {
  return prisma.productRating.update({
    where: { id },
    data: {
      productId: data.productId,
      totalRatings: data.totalRatings,
      givenRatings: data.givenRatings,
      message: data.message,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    },
  });
};

export const deleteProductRating = async (
  id: number,
): Promise<PrismaProductRating> => {
  return prisma.productRating.delete({
    where: { id },
  });
};

export const getProductRatingStats = async (
  productId: number,
): Promise<{
  totalCount: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
}> => {
  const ratings = await prisma.productRating.findMany({
    where: { productId },
    select: { givenRatings: true },
  });

  const totalCount = ratings.length;
  const validRatings = ratings.filter((r) => r.givenRatings !== null);
  const sum = validRatings.reduce((acc, r) => acc + (r.givenRatings || 0), 0);
  const averageRating = validRatings.length > 0 ? sum / validRatings.length : 0;

  // Count distribution
  const distribution: { [key: number]: number } = {};
  validRatings.forEach((r) => {
    const rating = r.givenRatings || 0;
    distribution[rating] = (distribution[rating] || 0) + 1;
  });

  const ratingDistribution = Object.entries(distribution).map(
    ([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }),
  );

  return {
    totalCount,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    ratingDistribution: ratingDistribution.sort((a, b) => b.rating - a.rating),
  };
};
