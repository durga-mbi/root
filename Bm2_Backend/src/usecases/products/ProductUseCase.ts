// import * as productRegisterRepository from "../../data/repositories/products/ProductRegisterRepository";
// import AppError from "../../errors/AppError";
// import { getProductMainImage } from "../../utils/product-image";

// // Helper to flatten product data (extract price/MRP from nested stockItems)
// // Helper to flatten/transform product data with variants and stock status
// const transformProduct = (product: any) => {
//   const stockItems = product.stockItems || [];

//   // Transform variants to include inStock flag and clean names
//   const variants = stockItems.map((item: any) => ({
//     id: item.id,
//     sku: item.barCode,
//     size: item.edition, // Mapping edition to size
//     color: item.color_name,
//     price: item.saleRate || 0,
//     mrp: item.mrpRate ? parseFloat(item.mrpRate) : item.saleRate || 0,
//     curQty: item.curQty || 0,
//     inStock: (item.curQty || 0) > 0,
//   }));

//   // Primary stock item for display in lists
//   const primaryStock = stockItems[0];
//   const totalQty = stockItems.reduce(
//     (acc: number, item: any) => acc + (item.curQty || 0),
//     0,
//   );
//   const mainImage = getProductMainImage(product);

//   return {
//     ...product,
//     productImage: mainImage,
//     image: mainImage,
//     price: primaryStock?.saleRate || null,
//     mrp: primaryStock?.mrpRate
//       ? parseFloat(primaryStock.mrpRate)
//       : primaryStock?.saleRate || null,
//     totalStock: totalQty,
//     inStock: totalQty > 0,
//     variants: variants,
//     // Remove raw stockItems from the root if we're using transformed variants
//     stockItems: undefined,
//   };
// };

// // Slug to displaySection mapping (API slugs -> DB values)
// const SLUG_TO_SECTION: Record<string, string> = {
//   fashion: "Fashion",
//   featured: "Featured",
//   trending: "Trending",
//   "new-arrivals": "New Arrival",
//   "new arrival": "New Arrival",
// };

// export const getNewArrivals = async (limit?: number, cursor?: number) => {
//   const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
//   const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
//   const result = await productRegisterRepository.getNewArrivals(
//     queryLimit,
//     queryCursor,
//   );
//   return {
//     ...result,
//     data: result.data.map(transformProduct),
//   };
// };

// // Get products by category slug
// export const getProductsByCategorySlug = async (
//   slug: string,
//   limit?: number,
//   cursor?: number,
// ) => {
//   const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
//   const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
//   const displaySection = SLUG_TO_SECTION[slug.toLowerCase()] ?? slug;
//   const result =
//     await productRegisterRepository.getProductRegistersByDisplaySection(
//       displaySection,
//       queryLimit,
//       queryCursor,
//     );
//   return {
//     ...result,
//     data: result.data.map(transformProduct),
//   };
// };

// // Get all product registers
// export const getAllProductRegisters = async (
//   limit?: number,
//   cursor?: number,
// ) => {
//   const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
//   const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
//   const result = await productRegisterRepository.getAllProductRegisters(
//     queryLimit,
//     queryCursor,
//   );
//   return {
//     ...result,
//     data: result.data.map(transformProduct),
//   };
// };

// // Get product register by ID with related products
// export const getProductDetail = async (id: number) => {
//   const product = await productRegisterRepository.getProductRegisterById(id);
//   if (!product) {
//     throw AppError.notFound("Product register not found.");
//   }

//   const transformedProduct = transformProduct(product);

//   // Get related products (same category)
//   // We get the catId from the first stock item of the current product
//   const categoryId = product.stockItems?.[0]?.catId;
//   const related = await productRegisterRepository.getRelatedProducts(
//     id,
//     categoryId,
//   );

//   return {
//     product: transformedProduct,
//     relatedProducts: related.map(transformProduct),
//   };
// };

// export const getProductRegisterById = async (id: number) => {
//   const product = await productRegisterRepository.getProductRegisterById(id);
//   if (!product) {
//     throw AppError.notFound("Product register not found.");
//   }
//   return transformProduct(product);
// };

// // Search product registers by name
// export const searchProductRegistersByName = async (
//   searchTerm: string,
//   limit?: number,
// ) => {
//   const products = await productRegisterRepository.searchProductRegistersByName(
//     searchTerm.trim(),
//     limit,
//   );
//   return products.map(transformProduct);
// };

// export const getFilteredProducts = async (filters: any) => {
//   const limit = filters.limit ? Math.floor(filters.limit) : 20;
//   const cursor = filters.cursor ? Math.floor(filters.cursor) : undefined;

//   const result = await productRegisterRepository.getFilteredProducts(
//     {
//       q: filters.q?.trim(),
//       minPrice: filters.minPrice,
//       maxPrice: filters.maxPrice,
//       rating: filters.rating,
//       categoryId: filters.categoryId,
//     },
//     limit,
//     cursor,
//   );
//   return {
//     ...result,
//     data: result.data.map(transformProduct),
//   };
// };


import * as productRegisterRepository from "../../data/repositories/products/ProductRegisterRepository";
import AppError from "../../errors/AppError";
import { getProductMainImage } from "../../utils/product-image";

// Transform product safely
const transformProduct = (product: any, searchTerm?: string) => {
  console.log(`[Debug] Transforming product: ${product?.id} - ${product?.productName}`);
  let stockItems = Array.isArray(product?.stockItems) ? product.stockItems : [];

  const variants = stockItems.map((item: any) => ({
    id: item.id,
    sku: item.barCode,
    size: item.edition,
    color: item.color_name,
    price: item.onlineRate || item.saleRate || 0,
    onlinePrice: item.onlineRate || item.saleRate || 0,
    mrp: item.onlineRate || item.saleRate || (item.mrpRate ? parseFloat(item.mrpRate) : 0),
    purchaseRate: item.pur_rate || 0,
    gst: item.gstper || 0,
    categoryName: item.catName,
    curQty: item.curQty || 0,
    inStock: (item.curQty || 0) > 0,
  }));

  // Find the stock item that matches the barcode if a search term is provided
  let primaryStock = stockItems[0];
  if (searchTerm) {
    const matchingStock = stockItems.find(
      (s: any) => s.barCode?.trim().toLowerCase() === searchTerm.trim().toLowerCase()
    );
    if (matchingStock) primaryStock = matchingStock;
  }

  const totalQty = stockItems.reduce(
    (acc: number, item: any) => acc + (item.curQty || 0),
    0
  );

  const mainImage = getProductMainImage(product);

  return {
    ...product,
    productImage: mainImage,
    image: mainImage,
    comId: product.comId || primaryStock?.shopId,
    categoryId: product.categoryId || primaryStock?.categoryId,
    categoryName: primaryStock?.catName,
    price: primaryStock?.onlineRate || primaryStock?.saleRate || 0,
    onlinePrice: primaryStock?.onlineRate || primaryStock?.saleRate || 0,
    mrp: primaryStock?.onlineRate || primaryStock?.saleRate || (primaryStock?.mrpRate
      ? parseFloat(primaryStock.mrpRate)
      : 0),
    purchaseRate: primaryStock?.pur_rate ?? 0,
    gst: primaryStock?.gstper ?? 0,
    totalStock: totalQty,
    inStock: totalQty > 0,
    variants,
    stockItems: undefined,
  };
};

// Slug mapping
const SLUG_TO_SECTION: Record<string, string> = {
  fashion: "Fashion",
  featured: "Featured",
  trending: "Trending",
  "new-arrivals": "New Arrival",
  "new arrival": "New Arrival",
};

// 🔥 FIXED: safer pagination
const normalizePagination = (limit?: number, cursor?: any) => {
  return {
    queryLimit: limit && limit > 0 ? Math.floor(limit) : 20,
    queryCursor: cursor ? cursor : undefined, // ❗ do NOT parseInt blindly
  };
};

// Get New Arrivals
export const getNewArrivals = async (limit?: number, cursor?: any) => {
  const { queryLimit, queryCursor } = normalizePagination(limit, cursor);

  const result = await productRegisterRepository.getNewArrivals(
    queryLimit,
    queryCursor
  );

  return {
    ...result,
    data: (result?.data || []).map((p: any) => transformProduct(p)),
  };
};

// Get by Category
export const getProductsByCategorySlug = async (
  slug: string,
  limit?: number,
  cursor?: any
) => {
  const { queryLimit, queryCursor } = normalizePagination(limit, cursor);

  const displaySection =
    SLUG_TO_SECTION[slug.toLowerCase()] ?? slug;

  const result =
    await productRegisterRepository.getProductRegistersByDisplaySection(
      displaySection,
      queryLimit,
      queryCursor
    );

  return {
    ...result,
    data: (result?.data || []).map((p: any) => transformProduct(p)),
  };
};

// Get All Products
export const getAllProductRegisters = async (
  limit?: number,
  cursor?: any
) => {
  const { queryLimit, queryCursor } = normalizePagination(limit, cursor);

  const result =
    await productRegisterRepository.getAllProductRegisters(
      queryLimit,
      queryCursor
    );

  return {
    ...result,
    data: (result?.data || []).map((p: any) => transformProduct(p)),
  };
};

// Get Product Detail
export const getProductDetail = async (id: number) => {
  const product =
    await productRegisterRepository.getProductRegisterById(id);

  if (!product) {
    throw AppError.notFound("Product register not found.");
  }

  const transformedProduct = transformProduct(product);

  const categoryId = product?.stockItems?.[0]?.catId;

  const related =
    await productRegisterRepository.getRelatedProducts(
      id,
      categoryId
    );

  return {
    product: transformedProduct,
    relatedProducts: (related || []).map((p: any) => transformProduct(p)),
  };
};

// Get by ID
export const getProductRegisterById = async (id: number) => {
  const product =
    await productRegisterRepository.getProductRegisterById(id);

  if (!product) {
    throw AppError.notFound("Product register not found.");
  }

  return transformProduct(product);
};

// Search
export const searchProductRegistersByName = async (
  searchTerm: string,
  limit?: number
) => {
  const products =
    await productRegisterRepository.searchProductRegistersByName(
      searchTerm?.trim() || "",
      limit
    );

  return (products || []).map((p: any) => transformProduct(p, searchTerm));
};

// Filtered Products
export const getFilteredProducts = async (filters: any) => {
  const { queryLimit, queryCursor } = normalizePagination(
    filters.limit,
    filters.cursor
  );

  const result = await productRegisterRepository.getFilteredProducts(
    {
      q: filters.q?.trim(),
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      rating: filters.rating,
      categoryId: filters.categoryId,
    },
    queryLimit,
    queryCursor
  );

  return {
    ...result,
    data: (result?.data || []).map((p: any) => transformProduct(p, filters.q)),
  };
};