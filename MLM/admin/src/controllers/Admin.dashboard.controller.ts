import AppError from "@/errors/AppError";
import { dasbordUsecase } from "@/useCase/Admin.dashboard.usecase";
import { Request, Response } from "express";

export const dasboardController = async (req: Request, res: Response) => {
  try {
    const data = await dasbordUsecase();
    res.status(201).json({ msg: "dasboard fetch sucessfully", data });
  } catch (error) {
    throw AppError.internal(error as any);
  }
};
