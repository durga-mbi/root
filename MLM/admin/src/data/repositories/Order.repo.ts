// order.repository.ts

import prisma from "../../prisma-client";
import { Prisma, OrderPlace } from "@prisma/client";

/**
 * Order type including relations
 */
export type OrderWithRelations = Prisma.OrderPlaceGetPayload<{
  include: {
    items: { include: { product: true } };
    address: true;
    orderStatusLogs: true;
  };
}>;

/**
 * Create Order (with items + address)
 */
export const createOrder = async (
  data: Prisma.OrderPlaceCreateInput,
): Promise<OrderWithRelations> => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.orderPlace.create({
      data,
      include: {
        items: { include: { product: true } },
        address: true,
        orderStatusLogs: true,
      },
    });

    await tx.orderStatusLog.create({
      data: {
        orderId: order.id,
        status: order.orderStatus,
        message: "Order placed successfully",
        createdBy: "User",
      },
    });

    return order;
  });
};

/**
 * Get All Orders (paginated with relations)
 */
export const getAllOrdersRepo = async (
  page: number,
  limit: number,
): Promise<{ data: OrderWithRelations[]; total: number }> => {
  const [data, total] = await prisma.$transaction([
    prisma.orderPlace.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        customer: true,
        items: { include: { product: true } },
        address: true,
      },
      orderBy: {
        orderDate: "desc",
      },
    }),
    prisma.orderPlace.count(),
  ]);

  return { data: data as any, total };
};

/**
 * Get Order By ID
 */
export const getOrderByIdRepo = async (
  id: number,
): Promise<OrderWithRelations | null> => {
  return prisma.orderPlace.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      address: true,
      orderStatusLogs: {
        orderBy: { createdAt: "asc" }
      }
    },
  });
};

/**
 * Get Orders By Customer
 */
export const getOrdersByCustomer = async (
  customerId: number,
): Promise<OrderWithRelations[]> => {
  return prisma.orderPlace.findMany({
    where: { customerId },
    include: {
      items: { include: { product: true } },
      address: true,
      orderStatusLogs: {
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: {
      orderDate: "desc",
    },
  });
};

/**
 * Update Order (main order fields)
 */
export const updateOrder = async (
  id: number,
  data: Prisma.OrderPlaceUpdateInput,
): Promise<OrderPlace> => {
  return prisma.orderPlace.update({
    where: { id },
    data,
  });
};

/**
 * Update Order Status
 */
export const updateOrderStatusRepo = async (
  id: number,
  status: Prisma.OrderPlaceUpdateInput["orderStatus"],
): Promise<OrderPlace> => {
  return prisma.orderPlace.update({
    where: { id },
    data: {
      orderStatus: status,
    },
  });
};

/**
 * Update Payment Status
 */
export const updatePaymentStatus = async (
  id: number,
  status: Prisma.OrderPlaceUpdateInput["paymentStatus"],
): Promise<OrderPlace> => {
  return prisma.orderPlace.update({
    where: { id },
    data: {
      paymentStatus: status,
    },
  });
};

/**
 * Update Order Address
 */
export const updateOrderAddress = async (
  orderId: number,
  data: Prisma.OrderAddressUpdateInput,
) => {
  return prisma.orderAddress.update({
    where: { orderId },
    data,
  });
};

/**
 * Update Order Item
 */
export const updateOrderItem = async (
  id: number,
  data: Prisma.OrderDetailsUpdateInput,
) => {
  return prisma.orderDetails.update({
    where: { id },
    data,
  });
};

/**
 * Add Order Item
 */
export const addOrderItem = async (data: Prisma.OrderDetailsCreateInput) => {
  return prisma.orderDetails.create({
    data,
  });
};

/**
 * Remove Order Item
 */
export const deleteOrderItem = async (id: number) => {
  return prisma.orderDetails.delete({
    where: { id },
  });
};

/**
 * Delete Order (OrderPlace + Items + Address)
 */
export const deleteOrder = async (id: number): Promise<OrderPlace> => {
  return prisma.$transaction(async (tx) => {
    await tx.orderDetails.deleteMany({
      where: { orderId: id },
    });

    await tx.orderAddress.deleteMany({
      where: { orderId: id },
    });

    return tx.orderPlace.delete({
      where: { id },
    });
  });
};
