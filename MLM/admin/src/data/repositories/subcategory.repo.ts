import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from "@/dto";
import prisma from "@/prisma-client";

export const createSubCategoryRepo = async (data: CreateSubCategoryDTO) => {
  return await prisma.subcategories.create({
    data: {
      name: data.name,
      Description: data.Description,
      image: data.image,
      status: "ACTIVE",
      category: {
        connect: {
          id: data.categoryId,
        },
      },
    },
  });
};

export const getSubCategoryRepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.subcategories.findMany({
      skip,
      take: limit,
      include: {
        category: true,
      },
      orderBy: {
        id: "desc",
      },
    }),
    prisma.subcategories.count(),
  ]);

  return { data, total };
};

export const updateSubCategoryRepo = async (
  id: number,
  data: UpdateSubCategoryDTO,
) => {
  return await prisma.subcategories.update({
    where: { id },
    data,
  });
};

export const deleteSubCategoryRepo = async (id: number) => {
  return await prisma.subcategories.delete({
    where: { id },
  });
};
