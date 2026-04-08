import * as productRegisterRepository from "../../data/repositories/products/ProductRegisterRepository";
import AppError from "../../errors/AppError";
import { getProductMainImage } from "../../utils/product-image";

// Helper to flatten product data (extract price/MRP from nested stockItems)
// Helper to flatten/transform product data with variants and stock status
const transformProduct = (product: any) => {
  const stockItems = product.stockItems || [];

  // Transform variants to include inStock flag and clean names
  const variants = stockItems.map((item: any) => ({
    id: item.id,
    sku: item.barCode,
    size: item.edition, // Mapping edition to size
    color: item.color_name,
    price: item.saleRate || 0,
    mrp: item.mrpRate ? parseFloat(item.mrpRate) : item.saleRate || 0,
    curQty: item.curQty || 0,
    inStock: (item.curQty || 0) > 0,
  }));

  // Primary stock item for display in lists
  const primaryStock = stockItems[0];
  const totalQty = stockItems.reduce(
    (acc: number, item: any) => acc + (item.curQty || 0),
    0,
  );
  const mainImage = getProductMainImage(product);

  return {
    ...product,
    productImage: mainImage,
    image: mainImage,
    price: primaryStock?.saleRate || null,
    mrp: primaryStock?.mrpRate
      ? parseFloat(primaryStock.mrpRate)
      : primaryStock?.saleRate || null,
    totalStock: totalQty,
    inStock: totalQty > 0,
    variants: variants,
    // Remove raw stockItems from the root if we're using transformed variants
    stockItems: undefined,
  };
};

// Slug to displaySection mapping (API slugs -> DB values)
const SLUG_TO_SECTION: Record<string, string> = {
  fashion: "Fashion",
  featured: "Featured",
  trending: "Trending",
  "new-arrivals": "New Arrival",
  "new arrival": "New Arrival",
};

export const getNewArrivals = async (limit?: number, cursor?: number) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  const result = await productRegisterRepository.getNewArrivals(
    queryLimit,
    queryCursor,
  );
  return {
    ...result,
    data: result.data.map(transformProduct),
  };
};

// Get products by category slug
export const getProductsByCategorySlug = async (
  slug: string,
  limit?: number,
  cursor?: number,
) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  const displaySection = SLUG_TO_SECTION[slug.toLowerCase()] ?? slug;
  const result =
    await productRegisterRepository.getProductRegistersByDisplaySection(
      displaySection,
      queryLimit,
      queryCursor,
    );
  return {
    ...result,
    data: result.data.map(transformProduct),
  };
};

// Get all product registers
export const getAllProductRegisters = async (
  limit?: number,
  cursor?: number,
) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  const result = await productRegisterRepository.getAllProductRegisters(
    queryLimit,
    queryCursor,
  );
  return {
    ...result,
    data: result.data.map(transformProduct),
  };
};

// Get product register by ID with related products
export const getProductDetail = async (id: number) => {
  const product = await productRegisterRepository.getProductRegisterById(id);
  if (!product) {
    throw AppError.notFound("Product register not found.");
  }

  const transformedProduct = transformProduct(product);

  // Get related products (same category)
  // We get the catId from the first stock item of the current product
  const categoryId = product.stockItems?.[0]?.catId;
  const related = await productRegisterRepository.getRelatedProducts(
    id,
    categoryId,
  );

  return {
    product: transformedProduct,
    relatedProducts: related.map(transformProduct),
  };
};

export const getProductRegisterById = async (id: number) => {
  const product = await productRegisterRepository.getProductRegisterById(id);
  if (!product) {
    throw AppError.notFound("Product register not found.");
  }
  return transformProduct(product);
};

// Search product registers by name
export const searchProductRegistersByName = async (
  searchTerm: string,
  limit?: number,
) => {
  const products = await productRegisterRepository.searchProductRegistersByName(
    searchTerm.trim(),
    limit,
  );
  return products.map(transformProduct);
};

export const getFilteredProducts = async (filters: any) => {
  const limit = filters.limit ? Math.floor(filters.limit) : 20;
  const cursor = filters.cursor ? Math.floor(filters.cursor) : undefined;

  const result = await productRegisterRepository.getFilteredProducts(
    {
      q: filters.q?.trim(),
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      rating: filters.rating,
      categoryId: filters.categoryId,
    },
    limit,
    cursor,
  );
  return {
    ...result,
    data: result.data.map(transformProduct),
  };
};
