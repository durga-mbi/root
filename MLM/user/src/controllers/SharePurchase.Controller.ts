import { Request, Response, NextFunction } from "express";
import * as sharePurchaseService from "../useCase/planPurchase/SharePurchase.useCase";

export const getAvailableShares = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }
    const result = await sharePurchaseService.getAvailableSharesForUser(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const sharePlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sponsorId = res.locals.user?.id;
    if (!sponsorId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }
    const { purchaseId, directId } = req.body;
    const result = await sharePurchaseService.sharePlanToDirect(
      sponsorId,
      Number(purchaseId),
      Number(directId),
    );
    res.status(200).json({
      success: true,
      message: "Plan shared successfully. Waiting for acceptance.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedPlansForMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }
    const result = await sharePurchaseService.getSharedPlansForUser(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const acceptPlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }
    const { purchaseId } = req.body;
    const result = await sharePurchaseService.acceptSharedPlan(
      userId,
      Number(purchaseId),
    );
    res.status(200).json({
      success: true,
      message: "Plan accepted successfully. Your account is now active.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
