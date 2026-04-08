import prisma from "../../../prisma-client";
import { Category, aa4_category_db_status } from "@prisma/client";

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
  totalCount: number;
}

export const getCategoryById = async (id: number): Promise<Category | null> => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const getAllCategories = async (
  limit: number = 20,
  cursor?: number,
  search?: string,
): Promise<CursorPaginationResult<Category>> => {
  const take = limit + 1; // Fetch one extra to determine if there are more records

  const where: any = {
    status: aa4_category_db_status.ONE,
  };

  if (search) {
    where.catName = {
      contains: search,
    };
  }

  const [categories, totalCount] = await Promise.all([
    prisma.category.findMany({
      where: cursor ? { ...where, id: { gt: cursor } } : where,
      orderBy: { disorder: "asc" },
      take,
    }),
    prisma.category.count({ where }),
  ]);

  const hasMore = categories.length > limit;
  const data = hasMore ? categories.slice(0, limit) : categories;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return {
    data,
    nextCursor,
    totalCount,
  };
};
