import * as productImageRegisterRepository from "../../data/repositories/product-image-registers/ProductImageRegisterRepository";
import AppError from "../../errors/AppError";

// Get product image register by ID
export const getProductImageRegisterById = async (id: number) => {
  const image =
    await productImageRegisterRepository.getProductImageRegisterById(id);
  if (!image) {
    throw AppError.notFound("Product image register not found.");
  }
  return image;
};

// Get product image registers by product ID
export const getProductImageRegistersByProductId = async (
  productId: number,
) => {
  return productImageRegisterRepository.getProductImageRegistersByProductId(
    productId,
  );
};

// Get all product image registers
export const getAllProductImageRegisters = async (
  limit?: number,
  cursor?: number,
) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 50;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  return productImageRegisterRepository.getAllProductImageRegisters(
    queryLimit,
    queryCursor,
  );
};
