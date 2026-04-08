import { CreateCategoryDTO, UpdateCategoryDTO } from "@/dto";
import prisma from "@/prisma-client";
export const catagoriesRepo = async (data: CreateCategoryDTO) => {
  return await prisma.categories.create({
    data: data,
  });
};
export const getCategoryrepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.categories.findMany({
      skip: skip,
      take: limit,
    }),
    prisma.categories.count(),
  ]);

  return {
    total,
    page,
    limit,
    data,
  };
};
export const updateCatagory = async (data: UpdateCategoryDTO, id: number) => {
  return await prisma.categories.update({ where: { id }, data });
};

export const deletecategoryrepo = async (id: number) => {
  return await prisma.categories.delete({
    where: { id },
  });
};
