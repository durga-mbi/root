import prisma from "../../../prisma-client";
import {
  ProductImageRegister as PrismaProductImageRegister,
  x2_app_product_img_register_status,
} from "@prisma/client";

export const getProductImageRegisterById = async (
  id: number,
): Promise<PrismaProductImageRegister | null> => {
  return prisma.productImageRegister.findFirst({
    where: { id, status: x2_app_product_img_register_status.ONE },
  });
};

export const getProductImageRegistersByProductId = async (
  productId: number,
): Promise<PrismaProductImageRegister[]> => {
  return prisma.productImageRegister.findMany({
    where: { productId, status: x2_app_product_img_register_status.ONE },
    orderBy: { id: "asc" },
  });
};

export const getAllProductImageRegisters = async (
  limit: number = 50,
  cursor?: number,
): Promise<{
  data: PrismaProductImageRegister[];
  nextCursor: number | null;
}> => {
  const take = limit + 1;

  const where = { status: x2_app_product_img_register_status.ONE };
  const images = await prisma.productImageRegister.findMany({
    where: cursor ? { ...where, id: { lt: cursor } } : where,
    orderBy: { id: "desc" },
    take,
  });

  const hasMore = images.length > limit;
  const data = hasMore ? images.slice(0, limit) : images;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor };
};
