import prisma from "../../prisma-client";
import {
  OrderRepository,
  OrderStatus,
} from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

/**
 * Update order status — robust version
 * Updates both the master status and the tracking history
 */
export const updateOrderStatusUseCase = async (
  orderId: string,
  status: OrderStatus,
  updated_by?: number,
  additionalData?: any,
) => {
  const result = await orderRepo.updateStatusWithDetails(orderId, status, {
    updated_by,
    ...additionalData,
  });

  return {
    message: "Status Updated Successfully",
    data: result,
  };
};
