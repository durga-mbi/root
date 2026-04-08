// OrderAddress Repository

import prisma from "../../prisma-client";
import { OrderAddress, Prisma } from "@prisma/client";

export const createOrderAddress = async (
  data: Prisma.OrderAddressCreateInput,
): Promise<OrderAddress> => {
  return prisma.orderAddress.create({ data });
};

export const getOrderAddressByOrderId = async (
  orderId: number,
): Promise<OrderAddress | null> => {
  return prisma.orderAddress.findUnique({
    where: { orderId },
  });
};

export const updateOrderAddress = async (
  orderId: number,
  data: Prisma.OrderAddressUpdateInput,
): Promise<OrderAddress> => {
  return prisma.orderAddress.update({
    where: { orderId },
    data,
  });
};

export const deleteOrderAddress = async (
  orderId: number,
): Promise<OrderAddress> => {
  return prisma.orderAddress.delete({
    where: { orderId },
  });
};
