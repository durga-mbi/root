import prisma from "../../prisma-client";

export const getAllProducts = async (filters: {
  categoryId?: number;
  subcategoryId?: number;
  brandId?: number;
}) => {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.subcategoryId && { subcategoryId: filters.subcategoryId }),
      ...(filters.brandId && { brandId: filters.brandId }),
    },
    include: {
      category: true,
      subcategory: true,
      brand: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      subcategory: true,
      brand: true,
      reviews: {
        where: { status: "ACTIVE" },
        include: { user: { select: { firstName: true, lastName: true } } },
      },
    },
  });
};

export const getCategoriesWithHierarchy = async () => {
  return prisma.categories.findMany({
    where: { status: "ACTIVE" },
    include: {
      subcategories: {
        where: { status: "ACTIVE" },
        include: {
          brands: { where: { status: "ACTIVE" } },
        },
      },
    },
  });
};
