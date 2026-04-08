import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma-client";
import AppError from "@/errors/AppError";
import { getUserWalletDetails } from "@/useCase/wallet/wallet.useCase";

export const getWalletController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;

    if (!userId) {
      throw AppError.unauthorized("Unauthorized");
    }

    const result = await prisma.$transaction((tx) =>
      getUserWalletDetails(userId, tx),
    );

    res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getWalletHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) throw AppError.unauthorized("Unauthorized");

    const { fromDate, toDate } = req.query;

    const result = await prisma.walletTransaction.findMany({
      where: {
        user_id: userId,
        createdAt: {
          gte: fromDate ? new Date(fromDate as string) : undefined,
          lte: toDate ? new Date(toDate as string) : undefined,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};