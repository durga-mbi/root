import {
  deletecategoryrepo,
  getCategoryrepo,
} from "@/data/repositories/category.repo";
import { CreateCategoryDTO, UpdateCategoryDTO } from "@/dto";
import prisma from "@/prisma-client";

export const createCategoriesUsecase = async (data: CreateCategoryDTO) => {
  const isExistCategory = await prisma.categories.findUnique({
    where: { name: data.name },
  });

  if (isExistCategory) {
    throw new Error("Category already exists");
  }

  const newCategory = await prisma.categories.create({
    data,
  });
  return newCategory;
};

export const getCategoryUsecase = async (page: number, limit: number) => {
  const data = await getCategoryrepo(page, limit);
  return {
    page,
    limit,
    total: data.total,
    data: data,
  };
};

export const updateCategoryusecase = async (
  id: number,
  data: UpdateCategoryDTO,
) => {
  return await prisma.categories.update({
    where: {
      id: id,
    },
    data: {
      name: data.name,
      Description: data.Description,
      image: data.image,
      status: data.status,
    },
  });
};
export const deleteCatagoryUsecase = async (id: number) => {
  return await deletecategoryrepo(id);
};
