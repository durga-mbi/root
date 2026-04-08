import { CreateBrandDTO, UpdateBrandDTO } from "@/dto";
import prisma from "@/prisma-client";

export const createBrandRepo = async (data: CreateBrandDTO) => {
  return prisma.brand.create({
    data: {
      brandname: data.brandname,
      image: data.image,
      status: "ACTIVE",
      subcategoryId: data.subcategoryId,
    },
  });
};

export const getBrandRepo = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.brand.findMany({
      skip,
      take: limit,
      include: {
        subcategory: true,
      },
      orderBy: {
        id: "desc",
      },
    }),
    prisma.brand.count(),
  ]);

  return { data, total };
};

export const updateBrandRepo = async (id: number, data: UpdateBrandDTO) => {
  return prisma.brand.update({
    where: { id },
    data,
  });
};

export const deleteBrandRepo = async (id: number) => {
  return prisma.brand.delete({
    where: { id },
  });
};
