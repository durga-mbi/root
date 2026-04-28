import prisma from "../../../prisma-client";
import {
  x1_app_product_register_is_display,
} from "@prisma/client";

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
  totalCount: number;
}

//
//   COMMON HELPERS
//

const normalizeImages = (product: any) => {
  if (product.images && product.images.length > 0) {
    return product.images;
  }

  const fallback =
    product.proimg || product.productImage || product.image;

  if (fallback) {
    return [{ url: fallback }];
  }

  return [{ url: "/default-product.png" }];
};

const normalizeProduct = (product: any) => ({
  ...product,
  images: normalizeImages(product),
});

const getFallbackStockItems = async (product: any) => {
  return prisma.shopStockItem.findMany({
    where: {
      OR: [
        { productId: product.productId },
        { itemName: product.productName },
      ],
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
      pur_rate: true,
    },
  });
};

//
//   1. GET PRODUCT BY ID
//

export const getProductRegisterById = async (id: number): Promise<any | null> => {
  const product = await prisma.productRegister.findFirst({
    where: {
      id,
      isDisplay: x1_app_product_register_is_display.ONE,
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
          pur_rate: true,
        },
      },
    },
  });

  if (!product) return null;

  let stockItems = product.stockItems;

  if (!stockItems || stockItems.length === 0) {
    stockItems = await getFallbackStockItems(product);
  }

  return normalizeProduct({
    ...product,
    stockItems,
  });
};

//
//   2. RELATED PRODUCTS
//

export const getRelatedProducts = async (
  currentProductId: number,
  categoryId?: number,
  limit: number = 10,
): Promise<any[]> => {
  const products = await prisma.productRegister.findMany({
    where: {
      id: { not: currentProductId },
      isDisplay: x1_app_product_register_is_display.ONE,
      stockItems: categoryId
        ? {
            some: {
              categoryId,
              status: "ONE",
            },
          }
        : undefined,
    },
    include: {
      images: true,
      stockItems: {
        where: { status: "ONE" },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(
    products.map(async (product: any) => {
      let stockItems = product.stockItems;

      if (!stockItems || stockItems.length === 0) {
        stockItems = await getFallbackStockItems(product);
      }

      return normalizeProduct({
        ...product,
        stockItems,
      });
    }),
  );
};

//
//   3. ALL PRODUCTS (PAGINATION)
//

export const getAllProductRegisters = async (
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
        stockItems: { where: { status: "ONE" } },
      },
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  const enriched = await Promise.all(
    data.map(async (product: any) => {
      let stockItems = product.stockItems;

      if (!stockItems || stockItems.length === 0) {
        stockItems = await getFallbackStockItems(product);
      }

      return normalizeProduct({
        ...product,
        stockItems,
      });
    }),
  );

  const nextCursor =
    hasMore && enriched.length > 0
      ? enriched[enriched.length - 1].id
      : null;

  return { data: enriched, nextCursor, totalCount };
};

//
//  4. FILTERED PRODUCTS
//

export const getFilteredProducts = async (
  filters: any,
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<any>> => {
  const take = limit + 1;

  const where: any = {};

  if (filters.q) {
    where.OR = [
      { productName: { contains: filters.q } },
      { stockItems: { some: { barCode: { contains: filters.q } } } },
    ];
  }

  if (filters.categoryId !== undefined) {
    where.categoryId = Number(filters.categoryId);
  }

  if (filters.rating !== undefined) {
    where.ratings = { gte: filters.rating };
  }

  if (filters.minPrice || filters.maxPrice) {
    where.stockItems = {
      some: {
        saleRate: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
      },
    };
  }

  const [products, totalCount] = await Promise.all([
    prisma.productRegister.findMany({
      where: cursor ? { ...where, id: { lt: cursor } } : where,
      include: {
        images: true,
        stockItems: true,
      },
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  const enriched = await Promise.all(
    data.map(async (product: any) => {
      let stockItems = product.stockItems;

      if (!stockItems || stockItems.length === 0) {
        stockItems = await getFallbackStockItems(product);
      }

      return normalizeProduct({
        ...product,
        stockItems,
      });
    }),
  );

  const nextCursor =
    hasMore && enriched.length > 0
      ? enriched[enriched.length - 1].id
      : null;

  return { data: enriched, nextCursor, totalCount };
};

//
//  5. NEW ARRIVALS
//

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
        stockItems: true,
      },
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  const enriched = data.map(normalizeProduct);

  const nextCursor =
    hasMore && enriched.length > 0
      ? enriched[enriched.length - 1].id
      : null;

  return { data: enriched, nextCursor, totalCount };
};

//
//   6. DISPLAY SECTION
//

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
      include: {
        images: true,
        stockItems: true,
      },
      orderBy: { id: "desc" },
      take,
    }),
    prisma.productRegister.count({ where }),
  ]);

  const hasMore = products.length > limit;
  const data = hasMore ? products.slice(0, limit) : products;

  const enriched = data.map(normalizeProduct);

  const nextCursor =
    hasMore && enriched.length > 0
      ? enriched[enriched.length - 1].id
      : null;

  return { data: enriched, nextCursor, totalCount };
};

//
//  7. SEARCH
//

export const searchProductRegistersByName = async (
  searchTerm: string,
  limit?: number,
): Promise<any[]> => {
  const products = await prisma.productRegister.findMany({
    where: {
      isDisplay: x1_app_product_register_is_display.ONE,
      productName: { contains: searchTerm },
    },
    include: {
      images: true,
      stockItems: true,
    },
    orderBy: { createdAt: "desc" },
    ...(limit && { take: limit }),
  });

  return products.map(normalizeProduct);
};