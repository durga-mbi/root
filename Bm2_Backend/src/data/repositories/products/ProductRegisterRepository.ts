import prisma from "../../../prisma-client";
import {
  ProductRegister as PrismaProductRegister,
  x1_app_product_register_is_display,
  caa1_shop_stock_item_db_status,
} from "@prisma/client";

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
  totalCount: number;
}

export const getProductRegisterById = async (
  id: number,
): Promise<any | null> => {
  return prisma.productRegister.findFirst({
    where: { id, isDisplay: x1_app_product_register_is_display.ONE },
    include: {
      images: true,
      stockItems: {
        where: { status: caa1_shop_stock_item_db_status.ONE },
      },
    },
  });
};

export const getRelatedProducts = async (
  currentProductId: number,
  categoryId?: number,
  limit: number = 10,
): Promise<any[]> => {
  return prisma.productRegister.findMany({
    where: {
      id: { not: currentProductId },
      isDisplay: x1_app_product_register_is_display.ONE,
      stockItems: categoryId
        ? {
            some: {
              catId: categoryId,
              status: caa1_shop_stock_item_db_status.ONE,
            },
          }
        : undefined,
    },
    include: {
      images: true,
      stockItems: {
        where: { status: caa1_shop_stock_item_db_status.ONE },
        take: 1,
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};

export const getAllProductRegisters = async (
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<any>> => {
  const take = limit + 1;
  const where: any = { isDisplay: x1_app_product_register_is_display.ONE };

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: {
        images: true,
        stockItems: {
          where: { status: caa1_shop_stock_item_db_status.ONE },
          take: 1,
        },
      },
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor, totalCount };
};

export const getFilteredProducts = async (
  filters: {
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    categoryId?: number;
  },
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<any>> => {
  const take = limit + 1;

  const where: any = {
    isDisplay: x1_app_product_register_is_display.ONE,
  };

  if (filters.q) {
    where.productName = { contains: filters.q };
  }

  // Stock table specific filters (Price and Category)
  const stockWhere: any = { status: caa1_shop_stock_item_db_status.ONE };
  let hasStockFilter = false;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    hasStockFilter = true;
    stockWhere.saleRate = {};
    if (filters.minPrice !== undefined)
      stockWhere.saleRate.gte = filters.minPrice;
    if (filters.maxPrice !== undefined)
      stockWhere.saleRate.lte = filters.maxPrice;
  }

  if (filters.categoryId !== undefined) {
    hasStockFilter = true;
    stockWhere.catId = filters.categoryId;
  }

  if (hasStockFilter) {
    where.stockItems = { some: stockWhere };
  }

  if (filters.rating !== undefined) {
    where.ratings = { gte: filters.rating };
  }

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: {
        images: true,
        stockItems: {
          where: { status: caa1_shop_stock_item_db_status.ONE },
          take: 1,
        },
      },
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor, totalCount };
};

export const getNewArrivals = async (
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<any>> => {
  const take = limit + 1;
  const where = { isDisplay: x1_app_product_register_is_display.ONE };

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: {
        images: true,
        stockItems: {
          where: { status: caa1_shop_stock_item_db_status.ONE },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor, totalCount };
};

export const getProductRegistersByDisplaySection = async (
  displaySection: string,
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<any>> => {
  const take = limit + 1;
  const where = {
    isDisplay: x1_app_product_register_is_display.ONE,
    displaySection: displaySection,
  };

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: {
        images: true,
        stockItems: {
          where: { status: caa1_shop_stock_item_db_status.ONE },
          take: 1,
        },
      },
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor, totalCount };
};

export const searchProductRegistersByName = async (
  searchTerm: string,
  limit?: number,
): Promise<any[]> => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : undefined;
  return prisma.productRegister.findMany({
    where: {
      isDisplay: x1_app_product_register_is_display.ONE,
      productName: { contains: searchTerm },
    },
    include: {
      images: true,
      stockItems: {
        where: { status: caa1_shop_stock_item_db_status.ONE },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    ...(queryLimit && { take: queryLimit }),
  });
};
