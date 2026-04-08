import { Request, Response, NextFunction } from "express";
import {
  createOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getOrdersByCustomerService,
  updateOrderService,
  deleteOrderService,
} from "../../useCase/Order/order.usecase";
import AppError from "@/errors/AppError";

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!res.locals.user?.id) {
      throw AppError.unauthorized("User not authenticated");
    }

    const result = await createOrderService({
      ...req.body,
      customerId: res.locals.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllOrdersService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = Number(req.params.id);

    const result = await getOrderByIdService(orderId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByCustomerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!res.locals.user?.id) {
      throw AppError.unauthorized("User not authenticated");
    }

    const userId = res.locals.user.id;

    const result = await getOrdersByCustomerService(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = Number(req.params.id);

    const result = await updateOrderService(orderId, req.body);

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = Number(req.params.id);

    const result = await deleteOrderService(orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
