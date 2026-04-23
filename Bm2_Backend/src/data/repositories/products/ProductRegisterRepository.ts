import prisma from "../../../prisma-client";
import {
  x1_app_product_register_is_display,
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
        where: { status: "ONE" },
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
            categoryId: categoryId,
            status: "ONE",
          },
        }
        : undefined,
    },
    include: {
      images: true,
      stockItems: {
        where: { status: "ONE" },
        select: {
          id: true,
          shopId: true,
          productId: true,
          categoryId: true,
          itemName: true,
          itemCode: true,
          barCode: true,
          saleRate: true,
          onlineRate: true,
          mrpRate: true,
          curQty: true,
          catName: true,
          gstper: true,
          pur_rate: true
        }
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
          where: { status: "ONE" },
          select: {
            id: true,
            shopId: true,
            productId: true,
            categoryId: true,
            itemName: true,
            itemCode: true,
            barCode: true,
            saleRate: true,
            onlineRate: true,
            mrpRate: true,
            curQty: true,
            catName: true,
            gstper: true,
            pur_rate: true
          }
        },
      },
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  // Enrichment Fallback
  const enrichedData = await Promise.all(
    data.map(async (product: any) => {
      if (!product.stockItems || product.stockItems.length === 0) {
        const stocks = await prisma.shopStockItem.findMany({
          where: {
            OR: [
              { productId: product.productId },
              { itemName: product.productName }
            ]
          },
          select: {
            id: true,
            shopId: true,
            productId: true,
            categoryId: true,
            itemName: true,
            itemCode: true,
            barCode: true,
            saleRate: true,
            onlineRate: true,
            mrpRate: true,
            curQty: true,
            catName: true,
            gstper: true,
            pur_rate: true
          }
        });
        return { ...product, stockItems: stocks };
      }
      return product;
    })
  );

  const nextCursor =
    hasMore && enrichedData.length > 0 ? enrichedData[enrichedData.length - 1].id : null;

  return { data: enrichedData, nextCursor, totalCount };
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
    // isDisplay: x1_app_product_register_is_display.ONE,
  };

  // search
  if (filters.q) {
    where.OR = [
      { productName: { contains: filters.q } },
      { stockItems: { some: { barCode: { contains: filters.q } } } },
    ];
  }

  //  FIXED: category filter MUST be here
  if (filters.categoryId !== undefined) {
    where.categoryId = Number(filters.categoryId);
  }

  // rating filter
  if (filters.rating !== undefined) {
    where.ratings = { gte: filters.rating };
  }

  // stock filters (ONLY price + status)
  const stockWhere: any = {
    // status: caa1_shop_stock_item_db_status.ONE,
  };

  let hasStockFilter = false;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    hasStockFilter = true;
    stockWhere.saleRate = {};

    if (filters.minPrice !== undefined) {
      stockWhere.saleRate.gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      stockWhere.saleRate.lte = filters.maxPrice;
    }
  }

  //  REMOVED: category from stockItems  

  if (hasStockFilter) {
    where.stockItems = { some: stockWhere };
  }

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: {
        images: true,
        stockItems: {
          select: {
            id: true,
            shopId: true,
            productId: true,
            categoryId: true,
            itemName: true,
            itemCode: true,
            barCode: true,
            brandId: true,
            brandName: true,
            catName: true,
            gstper: true,
            pur_rate: true,
            mrpRate: true,
            saleRate: true,
            onlineRate: true,
            curQty: true,
            edition: true,
            color_name: true,
            status: true
          }
        },
      },
      orderBy: { id: "desc" },
      take,
    }),

    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  // Manual Enrichment: If stockItems are empty due to broken ID links, 
  // fetch them by matching the product name
  const enrichedData = await Promise.all(
    data.map(async (product: any) => {
      if (!product.stockItems || product.stockItems.length === 0) {
        const stocks = await prisma.shopStockItem.findMany({
          where: {
            OR: [
              { productId: product.productId },
              { itemName: product.productName }
            ]
          },
          select: {
            id: true,
            shopId: true,
            productId: true,
            categoryId: true,
            itemName: true,
            itemCode: true,
            barCode: true,
            brandId: true,
            brandName: true,
            catName: true,
            gstper: true,
            pur_rate: true,
            mrpRate: true,
            saleRate: true,
            onlineRate: true,
            curQty: true,
            edition: true,
            color_name: true,
            status: true
          }
        });
        return { ...product, stockItems: stocks };
      }
      return product;
    })
  );

  const nextCursor =
    hasMore && enrichedData.length > 0 ? enrichedData[enrichedData.length - 1].id : null;

  return { data: enrichedData, nextCursor, totalCount };
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
          where: { status: "ONE" },
          select: {
            id: true,
            shopId: true,
            productId: true,
            categoryId: true,
            itemName: true,
            itemCode: true,
            barCode: true,
            saleRate: true,
            onlineRate: true,
            mrpRate: true,
            curQty: true,
            catName: true,
            gstper: true,
            pur_rate: true
          }
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
          where: { status: "ONE" },
          select: {
            id: true,
            shopId: true,
            productId: true,
            categoryId: true,
            itemName: true,
            itemCode: true,
            barCode: true,
            saleRate: true,
            onlineRate: true,
            mrpRate: true,
            curQty: true,
            catName: true,
            gstper: true,
            pur_rate: true
          }
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
        where: { status: "ONE" },
        select: {
          id: true,
          shopId: true,
          productId: true,
          categoryId: true,
          itemName: true,
          itemCode: true,
          barCode: true,
          saleRate: true,
          onlineRate: true,
          mrpRate: true,
          curQty: true,
          catName: true,
          gstper: true,
          pur_rate: true
        }
      },
    },
    orderBy: { createdAt: "desc" },
    ...(queryLimit && { take: queryLimit }),
  });
};