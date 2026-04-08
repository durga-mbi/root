import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma-client";

export const getMyPayouts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user!.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.usersPayoutHistory.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          payout: {
            select: {
              payoutDate: true,
              payoutCycle: true,
            }
          }
        }
      }),
      prisma.usersPayoutHistory.count({
        where: { userId }
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    next(error);
  }
};
