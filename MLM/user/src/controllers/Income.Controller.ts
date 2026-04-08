import { Request, Response, NextFunction } from "express";
import { getUnifiedIncomeHistory } from "@/useCase/system_income/unifiedIncome.useCase";
import AppError from "@/errors/AppError";

export const getMyIncomeHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) throw AppError.unauthorized("User not authenticated");

    const result = await getUnifiedIncomeHistory(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
