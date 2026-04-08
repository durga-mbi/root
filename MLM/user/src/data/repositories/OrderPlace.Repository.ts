import prisma from "../../prisma-client";
import { OrderPlace, Prisma } from "@prisma/client";

export const createOrderPlace = async (
  data: Prisma.OrderPlaceCreateInput,
): Promise<OrderPlace> => {
  return prisma.orderPlace.create({
    data,
    include: {
      items: true,
      address: true,
    },
  });
};

export const getAllOrderPlaces = async (): Promise<OrderPlace[]> => {
  return prisma.orderPlace.findMany({
    orderBy: { orderDate: "desc" },
  });
};

export const getOrderPlaceById = async (
  id: number,
): Promise<OrderPlace | null> => {
  return prisma.orderPlace.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
    },
  });
};

export const updateOrderPlace = async (
  id: number,
  data: Prisma.OrderPlaceUpdateInput,
): Promise<OrderPlace> => {
  return prisma.orderPlace.update({
    where: { id },
    data,
  });
};

export const deleteOrderPlace = async (id: number): Promise<OrderPlace> => {
  return prisma.orderPlace.delete({
    where: { id },
  });
};
