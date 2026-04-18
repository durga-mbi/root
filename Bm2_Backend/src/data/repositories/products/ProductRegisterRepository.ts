import prisma from "../../../prisma-client";
import {
  x1_app_product_register_is_display,
  caa1_shop_stock_item_db_status,
} from "@prisma/client";

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
  totalCount: number;
}

//////////////////////////////////////////////////////
// COMMON INCLUDE (REUSABLE)
//////////////////////////////////////////////////////

const productInclude = {
  images: true,
  stockItems: {
    where: { status: caa1_shop_stock_item_db_status.ONE },
    orderBy: { saleRate: "asc" }, // IMPORTANT: deterministic stock
    take: 1,
  },
};

//////////////////////////////////////////////////////
// COMMON MAPPER
//////////////////////////////////////////////////////

const mapProductWithPrice = (item: any) => {
  const stock = item.stockItems?.[0];

  return {
    ...item,
    price: stock?.online_rate ?? stock?.saleRate ?? 0,
  };
};

//////////////////////////////////////////////////////
// GET PRODUCT BY ID
//////////////////////////////////////////////////////

export const getProductRegisterById = async (
  id: number,
): Promise<any | null> => {
  const product = await prisma.productRegister.findFirst({
    where: { id, isDisplay: x1_app_product_register_is_display.ONE },
    include: productInclude,
  });

  if (!product) return null;

  return mapProductWithPrice(product);
};

//////////////////////////////////////////////////////
// RELATED PRODUCTS
//////////////////////////////////////////////////////

export const getRelatedProducts = async (
  currentProductId: number,
  categoryId?: number,
  limit: number = 10,
): Promise<any[]> => {
  const products = await prisma.productRegister.findMany({
    where: {
      id: { not: currentProductId },
      isDisplay: x1_app_product_register_is_display.ONE,
      ...(categoryId !== undefined && { categoryId }),
    },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapProductWithPrice);
};

//////////////////////////////////////////////////////
// ALL PRODUCTS (PAGINATION)
//////////////////////////////////////////////////////

export const getAllProductRegisters = async (
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<any>> => {
  const take = limit + 1;

  const where = {
    isDisplay: x1_app_product_register_is_display.ONE,
  };

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: productInclude,
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return {
    data: data.map(mapProductWithPrice),
    nextCursor,
    totalCount,
  };
};

//////////////////////////////////////////////////////
// FILTERED PRODUCTS
//////////////////////////////////////////////////////

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

  // 🔍 Search
  if (filters.q) {
    where.productName = {
      contains: filters.q,
      mode: "insensitive",
    };
  }

  // 📂 Category
  if (filters.categoryId !== undefined) {
    where.categoryId = Number(filters.categoryId);
  }

  // ⭐ Rating
  if (filters.rating !== undefined) {
    where.ratings = { gte: filters.rating };
  }

  // 💰 Price filter
  const stockWhere: any = {
    status: caa1_shop_stock_item_db_status.ONE,
  };

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    stockWhere.saleRate = {};

    if (filters.minPrice !== undefined) {
      stockWhere.saleRate.gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      stockWhere.saleRate.lte = filters.maxPrice;
    }

    where.stockItems = { some: stockWhere };
  }

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: productInclude,
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return {
    data: data.map(mapProductWithPrice),
    nextCursor,
    totalCount,
  };
};

//////////////////////////////////////////////////////
// NEW ARRIVALS
//////////////////////////////////////////////////////

export const getNewArrivals = async (
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<any>> => {
  const take = limit + 1;

  const where = {
    isDisplay: x1_app_product_register_is_display.ONE,
  };

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: productInclude,
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return {
    data: data.map(mapProductWithPrice),
    nextCursor,
    totalCount,
  };
};

//////////////////////////////////////////////////////
// DISPLAY SECTION
//////////////////////////////////////////////////////

export const getProductRegistersByDisplaySection = async (
  displaySection: string,
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<any>> => {
  const take = limit + 1;

  const where = {
    isDisplay: x1_app_product_register_is_display.ONE,
    displaySection,
  };

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: productInclude,
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return {
    data: data.map(mapProductWithPrice),
    nextCursor,
    totalCount,
  };
};

//////////////////////////////////////////////////////
// SEARCH
//////////////////////////////////////////////////////

export const searchProductRegistersByName = async (
  searchTerm: string,
  limit?: number,
): Promise<any[]> => {
  const products = await prisma.productRegister.findMany({
    where: {
      isDisplay: x1_app_product_register_is_display.ONE,
      productName: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    ...(limit && { take: limit }),
  });

  return products.map(mapProductWithPrice);
};