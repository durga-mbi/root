import { OrderRepository } from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

/**
 * Get all orders with pagination
 */
export const getAllOrdersUseCase = async (
  params: {
    page?: number;
    limit?: number;
    status?: string;
    comId?: number;
  } = {},
) => {
  return orderRepo.getAllOrders(params);
};
