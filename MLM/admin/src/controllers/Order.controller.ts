import { Request, Response } from "express";
import {
  getAllOrdersUsecase,
  getOrderByIdUsecase,
  updateOrderStatusUsecase,
} from "@/useCase/Order.usecase";
import AppError from "@/errors/AppError";

export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await getAllOrdersUsecase(page, limit);
    res.status(200).json({ 
      success: true, 
      data: {
        data: result.data,
        total: result.total
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await getOrderByIdUsecase(id);
    if (!data) throw AppError.notFound("Order not found");
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!status) throw AppError.badRequest("Status is required");
    const data = await updateOrderStatusUsecase(id, status);
    res.status(200).json({ success: true, message: "Status updated", data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
