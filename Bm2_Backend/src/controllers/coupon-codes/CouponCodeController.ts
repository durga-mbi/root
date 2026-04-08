import { Request, Response, NextFunction } from "express";
import * as usecase from "../../usecases/coupon-codes/CouponCodeUseCase";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await usecase.getAllCouponCodes();
    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (e) {
    next(e);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupon = await usecase.getCouponCodeById(Number(req.params.id));
    res.json({ success: true, data: coupon });
  } catch (e) {
    next(e);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupon = await usecase.createCouponCode(req.body);
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (e) {
    next(e);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupon = await usecase.updateCouponCode(
      Number(req.params.id),
      req.body,
    );
    res.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (e) {
    next(e);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await usecase.deleteCouponCode(Number(req.params.id));
    res.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

export const search = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const q = req.query.q as string;
    if (!q || q.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Search term is required. Please provide 'q' query parameter.",
      });
      return;
    }
    const data = await usecase.searchCouponCodesByName(q.trim());
    res.json({
      success: true,
      count: data.length,
      searchTerm: q.trim(),
      data,
    });
  } catch (e) {
    next(e);
  }
};
