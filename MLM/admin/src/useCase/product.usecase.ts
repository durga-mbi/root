import {
  createProductrepo,
  deleteProductRepo,
  findProductBySku,
  findProductConfig,
  getproductRepo,
  getSkuConfig,
  skuConfigrepo,
  updateConfigSku,
  updateProductRepo,
} from "@/data/repositories/product.repo";
import AppError from "@/errors/AppError";
import prisma from "@/prisma-client";

export const createConfig = async (data: any) => {
  return await skuConfigrepo(data);
};

export const createProductUsecase = async (data: any) => {
  try {
    let finalSku: string;

    if (data.sku) {
      const existingProduct = await findProductBySku(data.sku);

      if (existingProduct) {
        const errors: string[] = [];

        if (existingProduct.categoryId !== data.categoryId) {
          throw AppError.badRequest("categoryId does not match");
        }

        if (existingProduct.subcategoryId !== data.subcategoryId) {
          throw AppError.badRequest("subcategoryId does not match");
        }

        if (existingProduct.brandId !== data.brandId) {
          throw AppError.badRequest("brandId does not match");
        }

        if (existingProduct.HSNcode !== data.HSNcode) {
          throw AppError.badRequest("HSNcode does not match");
        }

        if (existingProduct.dp_amount !== data.dp_amount) {
          throw AppError.badRequest("dp_amount does not match");
        }

        if (existingProduct.mrp_amount !== data.mrp_amount) {
          throw AppError.badRequest("mrp_amount does not match");
        }

        if (existingProduct.tax !== data.tax) {
          throw AppError.badRequest("tax does not match");
        }

        if (existingProduct.description !== data.description) {
          throw AppError.badRequest("description does not match");
        }

        if (existingProduct.specifaction !== data.specification) {
          throw AppError.badRequest("specifaction does not match");
        }
        if (errors.length > 0) {
          throw AppError.badRequest(
            `SKU already used with different data: ${errors.join(", ")}`,
          );
        }
        finalSku = data.sku;
      } else {
        finalSku = data.sku;
      }
    } else {
      let skuConfig = await getSkuConfig();

      if (!skuConfig) {
        await skuConfigrepo({});
        skuConfig = await getSkuConfig();
      }

      const nextSequence = Number(skuConfig!.value) + 1;
      finalSku = `SKU${nextSequence}`;

      await updateConfigSku(nextSequence.toString());
    }

    const { specification, ...rest } = data;
    const product = await createProductrepo({
      ...rest,
      specifaction: specification || "N/A",
      sku: finalSku,
    });

    return product;
  } catch (error) {
    console.error("USECASE ERROR:", error);
    throw error;
  }
};
export const getProductUsecase = async (page: number, limit: number) => {
  const data = await getproductRepo(limit, page);

  return {
    page,
    limit,
    total: data.total,
    data: data.data,
  };
};
export const updaateProductUsecase = async (id: number, data: any) => {
  return await updateProductRepo(id, data);
};
export const deleteProductusecase = async (id: number) => {
  return await deleteProductRepo(id);
};
