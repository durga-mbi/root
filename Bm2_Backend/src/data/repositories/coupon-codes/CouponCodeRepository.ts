import prisma from "../../../prisma-client";

export const getAllCoupons = () =>
  prisma.couponCode.findMany({
    orderBy: { createdAt: "desc" },
  });

export const getCouponById = (id: number) =>
  prisma.couponCode.findUnique({
    where: { id },
  });

export const createCoupon = (data: any) => prisma.couponCode.create({ data });

export const updateCoupon = (id: number, data: any) =>
  prisma.couponCode.update({
    where: { id },
    data,
  });

export const deleteCoupon = (id: number) =>
  prisma.couponCode.delete({
    where: { id },
  });

export const searchCoupons = (q: string) =>
  prisma.couponCode.findMany({
    where: {
      name: {
        contains: q,
      },
    },
    orderBy: { createdAt: "desc" },
  });
