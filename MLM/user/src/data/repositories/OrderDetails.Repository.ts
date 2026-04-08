// OrderDetails Repository

import prisma from "../../prisma-client";
import { OrderDetails, Prisma } from "@prisma/client";

export const createOrderDetails = async (
  data: Prisma.OrderDetailsCreateInput,
): Promise<OrderDetails> => {
  return prisma.orderDetails.create({ data });
};

export const getAllOrderDetails = async (): Promise<OrderDetails[]> => {
  return prisma.orderDetails.findMany({
    orderBy: { id: "asc" },
  });
};

export const getOrderDetailsById = async (
  id: number,
): Promise<OrderDetails | null> => {
  return prisma.orderDetails.findUnique({
    where: { id },
  });
};

export const getOrderDetailsByOrderId = async (
  orderId: number,
): Promise<OrderDetails[]> => {
  return prisma.orderDetails.findMany({
    where: { orderId },
  });
};

export const updateOrderDetails = async (
  id: number,
  data: Prisma.OrderDetailsUpdateInput,
): Promise<OrderDetails> => {
  return prisma.orderDetails.update({
    where: { id },
    data,
  });
};

export const deleteOrderDetails = async (id: number): Promise<OrderDetails> => {
  return prisma.orderDetails.delete({
    where: { id },
  });
};
