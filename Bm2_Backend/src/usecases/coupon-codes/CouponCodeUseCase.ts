import * as repo from "../../data/repositories/coupon-codes/CouponCodeRepository";
import AppError from "../../errors/AppError";

export const getAllCouponCodes = () => repo.getAllCoupons();

export const getCouponCodeById = async (id: number) => {
  const coupon = await repo.getCouponById(id);
  if (!coupon) throw AppError.notFound("Coupon not found");
  return coupon;
};

export const createCouponCode = async (data: any) => {
  if (!data.name) throw AppError.badRequest("Coupon name required");
  return repo.createCoupon(data);
};

export const updateCouponCode = async (id: number, data: any) => {
  await getCouponCodeById(id);
  return repo.updateCoupon(id, data);
};

export const deleteCouponCode = async (id: number) => {
  await getCouponCodeById(id);
  return repo.deleteCoupon(id);
};

export const searchCouponCodesByName = (q: string) => repo.searchCoupons(q);
