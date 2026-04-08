import {
  getAllOrdersRepo,
  getOrderByIdRepo,
  updateOrderStatusRepo,
} from "@/data/repositories/Order.repo";
import { OrderStatus } from "@prisma/client";

export const getAllOrdersUsecase = async (page: number, limit: number) => {
  return await getAllOrdersRepo(page, limit);
};

export const getOrderByIdUsecase = async (id: number) => {
  return await getOrderByIdRepo(id);
};

export const updateOrderStatusUsecase = async (
  id: number,
  status: OrderStatus,
) => {
  return await updateOrderStatusRepo(id, status);
};
