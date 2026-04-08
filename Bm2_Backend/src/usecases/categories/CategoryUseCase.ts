import * as categoryRepository from "../../data/repositories/categories/CategoryRepository";
import AppError from "../../errors/AppError";
import { getLevenshteinDistance } from "../../utils";

export const getAllCategories = async (
  limit?: number,
  cursor?: number,
  search?: string,
) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  const searchTerm = search?.trim().toLowerCase();

  if (!searchTerm) {
    return await categoryRepository.getAllCategories(queryLimit, queryCursor);
  }

  const allCategories = await categoryRepository.getAllCategories(100, 0);
  const categories = allCategories.data;

  const scoredCategories = categories
    .map((cat) => {
      const name = (cat.catName || "").toLowerCase();
      let score = 0;

      if (name === searchTerm) score = 100;
      else if (name.startsWith(searchTerm)) score = 80;
      else if (name.includes(searchTerm)) score = 50;
      else {
        const distance = getLevenshteinDistance(name, searchTerm);
        if (distance <= 2) {
          score = 40 - distance * 10;
        }
      }

      return { ...cat, score };
    })
    .filter((cat) => cat.score > 0)
    .sort((a, b) => b.score - a.score || (a.disorder || 0) - (b.disorder || 0));

  return {
    data: scoredCategories.slice(0, queryLimit),
    nextCursor: null,
    totalCount: scoredCategories.length,
  };
};

export const getCategoryById = async (id: number) => {
  const category = await categoryRepository.getCategoryById(id);
  if (!category) {
    throw AppError.notFound("Category not found.");
  }
  return category;
};
