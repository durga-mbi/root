import * as productRatingRepository from "../../data/repositories/product-ratings/ProductRatingRepository";
import AppError from "../../errors/AppError";
import { cloudinaryService } from "../../services/CloudinaryService";

export const getProductRatingById = async (id: number) => {
  const rating =
    await productRatingRepository.getProductRatingByIdWithRelations(id);
  if (!rating) {
    throw AppError.notFound("Product rating not found.");
  }
  return rating;
};

export const getProductRatingsByProductId = async (
  productId: number,
  limit?: number,
  cursor?: number,
) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  return await productRatingRepository.getProductRatingsByProductId(
    productId,
    queryLimit,
    queryCursor,
  );
};

export const getAllProductRatings = async (limit?: number, cursor?: number) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  return await productRatingRepository.getAllProductRatings(
    queryLimit,
    queryCursor,
  );
};

export const createProductRating = async (
  data: productRatingRepository.CreateProductRatingData & {
    reviewImages?: string[];
  },
) => {
  // Validate that givenRatings is within valid range (typically 1-5)
  if (data.givenRatings !== undefined) {
    if (data.givenRatings < 1 || data.givenRatings > 5) {
      throw AppError.badRequest("Given rating must be between 1 and 5.");
    }
  }

  const { reviewImages, ...ratingPayload } = data;

  const rating =
    await productRatingRepository.createProductRating(ratingPayload);

  const sanitizedImages = await processReviewImages(reviewImages);
  if (sanitizedImages.length > 0) {
    await productRatingRepository.createProductRatingImages(
      rating.id,
      sanitizedImages,
    );
  }

  const ratingWithRelations =
    await productRatingRepository.getProductRatingByIdWithRelations(rating.id);

  if (!ratingWithRelations) {
    throw AppError.internal("Unable to fetch created product rating.");
  }

  return ratingWithRelations;
};

export const updateProductRating = async (
  id: number,
  data: productRatingRepository.UpdateProductRatingData,
) => {
  // Check if rating exists
  const existingRating = await productRatingRepository.getProductRatingById(id);
  if (!existingRating) {
    throw AppError.notFound("Product rating not found.");
  }

  // Validate that givenRatings is within valid range (typically 1-5)
  if (data.givenRatings !== undefined) {
    if (data.givenRatings < 1 || data.givenRatings > 5) {
      throw AppError.badRequest("Given rating must be between 1 and 5.");
    }
  }

  return await productRatingRepository.updateProductRating(id, data);
};

export const deleteProductRating = async (id: number) => {
  const existingRating = await productRatingRepository.getProductRatingById(id);
  if (!existingRating) {
    throw AppError.notFound("Product rating not found.");
  }

  return await productRatingRepository.deleteProductRating(id);
};

export const getProductRatingStats = async (productId: number) => {
  return await productRatingRepository.getProductRatingStats(productId);
};

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value.trim());

const extractBase64Data = (value: string): string => {
  if (value.includes(",")) {
    return value.split(",").pop() ?? "";
  }
  return value;
};

const processReviewImages = async (
  reviewImages?: string[],
): Promise<productRatingRepository.CreateProductRatingImageData[]> => {
  if (!reviewImages || reviewImages.length === 0) {
    return [];
  }

  const validatedImages: productRatingRepository.CreateProductRatingImageData[] =
    [];

  for (const image of reviewImages) {
    const trimmed = image.trim();
    if (!trimmed) continue;

    if (isHttpUrl(trimmed)) {
      validatedImages.push({ url: trimmed });
      continue;
    }

    const base64Data = extractBase64Data(trimmed);
    if (!base64Data) {
      throw AppError.badRequest("Invalid review image payload.");
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64Data, "base64");
    } catch (error) {
      throw AppError.badRequest("Unable to decode review image data.");
    }

    if (!buffer.length) {
      throw AppError.badRequest("Review image data is empty.");
    }

    let uploadResult;
    try {
      uploadResult = await cloudinaryService.uploadImage(
        buffer,
        "bm2mall/reviews",
      );
    } catch (error) {
      throw AppError.internal("Failed to upload review image.");
    }

    validatedImages.push({
      url: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
    });
  }

  return validatedImages;
};
