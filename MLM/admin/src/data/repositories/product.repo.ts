import { CreateProductDTO } from "@/dto";

import prisma from "@/prisma-client";

export const skuConfigrepo = async (data: any) => {
  await prisma.skuConfig.upsert({
    where: { key: "SKU_SEQUENCE" },
    update: { value: "1002" },
    create: {
      key: "SKU_SEQUENCE",
      value: "1002",
    },
  });
};

export const findProductConfig = async (sku: string) => {
  return await prisma.product.findUnique({
    where: { sku },
  });
};

export const getSkuConfig = () => {
  return prisma.skuConfig.findUnique({
    where: { key: "SKU_SEQUENCE" },
  });
};

export const updateConfigSku = async (value: string) => {
  return await prisma.skuConfig.update({
    where: { key: "SKU_SEQUENCE" },
    data: { value },
  });
};

export const createProductrepo = async (data: any) => {
  const { categoryId, subcategoryId, brandId, mainImage, otherImage, ...rest } = data;
  return await prisma.product.create({
    data: {
      ...rest,
      HSNcode: data.HSNcode || "0000",
      tax: data.tax || 0,
      productmainimage: mainImage || data.productmainimage || "",
      productOtherimage: otherImage || data.productOtherimage || "",
      category: { connect: { id: Number(categoryId) } },
      subcategory: { connect: { id: Number(subcategoryId) } },
      brand: { connect: { id: Number(brandId) } },
    },
  });
};
export const getproductRepo = async (limit: number, page: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      skip: skip,
      take: limit,
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
      orderBy: { id: "desc" },
    }),
    prisma.product.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateProductRepo = async (id: number, data: any) => {
  const result = await prisma.product.update({
    where: { id: id },
    data,
  });
  return result;

};
export const deleteProductRepo = async (id: number) => {
  const data = await prisma.product.delete({
    where: { id: id },
  });
};

export const findProductBySku = async (sku: string) => {
  return await prisma.product.findFirst({
    where: { sku },
  });
};