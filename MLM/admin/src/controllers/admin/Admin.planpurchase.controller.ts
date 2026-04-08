import { Request, Response, NextFunction } from "express";
import config from "@/config";
import AppError from "@/errors/AppError";

// Internal User API URL
const USER_INTERNAL_URL = process.env.USER_INTERNAL_URL || "http://user:3001";

export const getPendingApprovalsProxy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = (req as any).admin?.id;
    const response = await fetch(`${USER_INTERNAL_URL}/v1/planpurchase/details/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": config.appSecret,
        "x-admin-id": String(adminId || 0),
      },
    });

    const json = await response.json();
    if (!response.ok) {
      res.status(response.status).json(json);
      return;
    }

    res.status(200).json(json);
  } catch (error) {
    next(error);
  }
};

export const approvePurchaseProxy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = (req as any).admin?.id;
    const response = await fetch(`${USER_INTERNAL_URL}/v1/planpurchase/approve/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": config.appSecret,
        "x-admin-id": String(adminId || 0),
      },
    });

    const json = await response.json();
    if (!response.ok) {
      res.status(response.status).json(json);
      return;
    }

    res.status(200).json(json);
  } catch (error) {
    next(error);
  }
};

export const rejectPurchaseProxy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = (req as any).admin?.id;
    const response = await fetch(`${USER_INTERNAL_URL}/v1/planpurchase/reject/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": config.appSecret,
        "x-admin-id": String(adminId || 0),
      },
    });

    const json = await response.json();
    if (!response.ok) {
      res.status(response.status).json(json);
      return;
    }

    res.status(200).json(json);
  } catch (error) {
    next(error);
  }
};
