import AppError from "@/errors/AppError";
import {
  genincomeUsecase,
  getIncomeByBatchUsecase,
  incomeHistoryUsecase,
  inocomeGenerateUsecase,
} from "@/useCase/income.generate.usecase";
import { Request, Response } from "express";

export const IncomegenController = async (req: Request, res: Response) => {
  try {
    const data = await inocomeGenerateUsecase();
    if (!data) {
      throw AppError.notFound("income is not generated");
    }
    res.status(201).json({ msg: "income generated sucessfuly", data });
  } catch (error: any) {
    throw AppError.internal(error);
  }
};

export const generateincomeController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page as string);
    const limit = Number(req.query.limit as string);
    const data = await genincomeUsecase(page, limit);
    res.status(201).json({ msg: "incomegenerate found sucessfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const incomeHistoryController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page as string);
    const limit = Number(req.query.limit as string);
    const data = await incomeHistoryUsecase(page, limit);
    res.status(201).json({ msg: "incomegenerate found sucessfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getIncomeByBatchController = async (
  req: Request,
  res: Response,
) => {
  try {
    const batchId = Number(req.params.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await getIncomeByBatchUsecase(batchId, page, limit);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
