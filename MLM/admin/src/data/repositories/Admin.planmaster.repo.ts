import { CreatePlanDto, UpdatePlanDto } from "@/dto";
import AppError from "@/errors/AppError";
import prisma from "@/prisma-client";
import { convertFeatures } from "@/utils/convertstring";

export const createPlanrepo = async (data: CreatePlanDto) => {
  const features = convertFeatures(data.features);

  return prisma.plansMaster.create({
    data: {
      ...data,
      features,
    },
  });
};

export const getPlanRepo = async () => {
  return await prisma.plansMaster.findMany();
};

export const getplanbyIdRepo = (id: number) => {
  return prisma.plansMaster.findUnique({
    where: { id },
  });
};
export const updatePlanRepo = (id: number, data: UpdatePlanDto) => {
  return prisma.plansMaster.update({
    where: { id },
    data,
  });
};

export const deletePlanrepo = (id: number) => {
  return prisma.plansMaster.delete({
    where: { id },
  });
};
